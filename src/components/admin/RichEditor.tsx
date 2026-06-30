"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Heading4,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Minus,
  Upload,
  Undo2,
  Redo2,
  Pilcrow,
  Table,
  FileCode2,
  Eye,
  MousePointerClick,
  ExternalLink,
  Unlink,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAdminUI } from "./AdminUI";
import { COMPANY } from "@/lib/company";

// Tags kept when cleaning pasted content; everything else is unwrapped so a
// paste from Word/Google Docs/another site loses its fonts, colours and inline
// styles and adopts the blog's own typography (consistent across the post).
const PASTE_ALLOWED = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "ul", "ol", "li",
  "strong", "em", "b", "i", "u", "s", "sup", "sub",
  "a", "blockquote", "br", "hr",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
  "img", "figure", "figcaption", "code", "pre",
]);

function cleanPastedHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  tmp
    .querySelectorAll("script,style,meta,link,title,head,iframe,object")
    .forEach((n) => n.remove());
  const process = (node: Element) => {
    Array.from(node.children).forEach((c) => process(c as Element));
    const tag = node.tagName.toLowerCase();
    Array.from(node.attributes).forEach((a) => {
      const keep =
        (tag === "a" && (a.name === "href" || a.name === "title")) ||
        (tag === "img" && (a.name === "src" || a.name === "alt"));
      if (!keep) node.removeAttribute(a.name);
    });
    if (!PASTE_ALLOWED.has(tag)) {
      const parent = node.parentNode;
      if (parent) {
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        parent.removeChild(node);
      }
    }
  };
  Array.from(tmp.children).forEach((c) => process(c as Element));
  return tmp.innerHTML;
}

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** Bump to re-seed the editor DOM from `value`. */
  resetKey?: number | string;
  placeholder?: string;
}

export default function RichEditor({
  value,
  onChange,
  resetKey,
  placeholder = "Write your post…",
}: RichEditorProps) {
  const { toast, prompt } = useAdminUI();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onChangeRef = useRef(onChange);
  const initializedRef = useRef(false);
  const savedSelectionRef = useRef<Range | null>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");
  // Inline popups for editing an existing link / image.
  const [linkPop, setLinkPop] = useState<{
    top: number;
    left: number;
    href: string;
  } | null>(null);
  const [imgPop, setImgPop] = useState<{ top: number; left: number } | null>(
    null,
  );
  const linkElRef = useRef<HTMLAnchorElement | null>(null);
  const imgElRef = useRef<HTMLImageElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Seed the contentEditable once when content first arrives.
  useEffect(() => {
    if (viewMode !== "visual") return;
    if (editorRef.current && value && !initializedRef.current) {
      editorRef.current.innerHTML = value;
      initializedRef.current = true;
    }
  }, [value, viewMode]);

  // Re-seed on resetKey change (e.g. data loaded into edit form).
  useEffect(() => {
    if (resetKey === undefined) return;
    if (viewMode !== "visual") return;
    if (!editorRef.current) return;
    editorRef.current.innerHTML = value ?? "";
    initializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const syncContent = useCallback(() => {
    if (editorRef.current) onChangeRef.current(editorRef.current.innerHTML);
  }, []);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  }, []);

  const detectFormats = useCallback(() => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      if (document.queryCommandState("strikeThrough"))
        formats.add("strikeThrough");
      if (document.queryCommandState("insertUnorderedList"))
        formats.add("insertUnorderedList");
      if (document.queryCommandState("insertOrderedList"))
        formats.add("insertOrderedList");
      const block = document.queryCommandValue("formatBlock");
      if (block) formats.add(block.toLowerCase());
    } catch {
      /* ignore */
    }
    setActiveFormats(formats);
  }, []);

  const exec = useCallback(
    (command: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, val);
      syncContent();
      detectFormats();
    },
    [syncContent, detectFormats],
  );

  const toggleViewMode = useCallback(() => {
    if (viewMode === "visual") {
      if (editorRef.current) onChangeRef.current(editorRef.current.innerHTML);
      setViewMode("html");
    } else {
      initializedRef.current = false;
      setViewMode("visual");
    }
  }, [viewMode]);

  const toggleHeading = (level: number) => {
    const tag = `h${level}`;
    const current = document.queryCommandValue("formatBlock").toLowerCase();
    exec("formatBlock", current === tag ? "p" : tag);
  };

  const toggleBlock = (tag: string) => {
    const current = document.queryCommandValue("formatBlock").toLowerCase();
    exec("formatBlock", current === tag ? "p" : tag);
  };

  const insertLink = async () => {
    saveSelection();
    const sel = window.getSelection();
    const hasText = Boolean(sel && !sel.isCollapsed && sel.toString().trim());
    const url = await prompt({
      title: "Insert Link",
      label: "Link URL",
      defaultValue: "https://",
      placeholder: "https://example.com  ·  /contact  ·  mailto:…",
      confirmLabel: hasText ? "Insert" : "Next",
    });
    if (!url) return;
    if (hasText) {
      editorRef.current?.focus();
      restoreSelection();
      exec("createLink", url);
      return;
    }
    // No text selected — ask for the visible link text and insert an anchor.
    const text = await prompt({
      title: "Insert Link",
      label: "Link text",
      defaultValue: url,
      confirmLabel: "Insert",
    });
    editorRef.current?.focus();
    restoreSelection();
    const safe = (text || url).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    exec("insertHTML", `<a href="${url.replace(/"/g, "&quot;")}">${safe}</a>`);
  };

  // Insert a styled call-to-action button (defaults to the WhatsApp link).
  const insertCta = async () => {
    saveSelection();
    const text = await prompt({
      title: "Add CTA Button",
      label: "Button text",
      defaultValue: "Request Crew on WhatsApp",
      confirmLabel: "Next",
    });
    if (!text) return;
    const link = await prompt({
      title: "Add CTA Button",
      label: "Button link",
      message:
        "WhatsApp, phone or any URL. Examples: https://wa.me/8801626366030 · tel:+8801626366030 · mailto:info@shipcrewagency.com",
      defaultValue: `https://wa.me/${COMPANY.whatsapp}`,
      confirmLabel: "Insert",
    });
    if (!link) return;
    editorRef.current?.focus();
    restoreSelection();
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeLink = link.replace(/"/g, "&quot;");
    exec(
      "insertHTML",
      `<p><a class="post-cta" href="${safeLink}">${safeText}</a></p><p><br></p>`,
    );
  };

  const insertImageUrl = async () => {
    saveSelection();
    const url = await prompt({
      title: "Insert Image by URL",
      label: "Image URL",
      defaultValue: "https://",
      placeholder: "https://…",
      confirmLabel: "Next",
    });
    if (!url) return;
    const alt =
      (await prompt({
        title: "Image Alt Text",
        label: "Alt text (for SEO & accessibility)",
        placeholder: "Describe the image",
        confirmLabel: "Insert",
      })) || "Article image";
    editorRef.current?.focus();
    restoreSelection();
    exec(
      "insertHTML",
      `<img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" /><p><br></p>`,
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const alt =
      (await prompt({
        title: "Image Alt Text",
        label: "Alt text for this image (SEO & accessibility)",
        defaultValue: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        confirmLabel: "Upload",
      })) || file.name;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const imgHtml = `<img src="${data.url}" alt="${alt.replace(
        /"/g,
        "&quot;",
      )}" /><p><br></p>`;
      editorRef.current?.focus();
      restoreSelection();
      const success = document.execCommand("insertHTML", false, imgHtml);
      if (!success && editorRef.current) editorRef.current.innerHTML += imgHtml;
      syncContent();
      toast.success("Image inserted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertHR = () => exec("insertHTML", "<hr />");

  const insertTable = async () => {
    const rows = parseInt(
      (await prompt({
        title: "Insert Table",
        label: "Number of rows",
        defaultValue: "3",
        confirmLabel: "Next",
      })) || "0",
      10,
    );
    if (!rows) return;
    const cols = parseInt(
      (await prompt({
        title: "Insert Table",
        label: "Number of columns",
        defaultValue: "3",
        confirmLabel: "Insert",
      })) || "0",
      10,
    );
    if (!cols) return;
    let html =
      '<table><thead><tr>' +
      Array.from({ length: cols }, () => "<th>Header</th>").join("") +
      "</tr></thead><tbody>";
    for (let i = 0; i < rows - 1; i++) {
      html +=
        "<tr>" +
        Array.from({ length: cols }, () => "<td>Cell</td>").join("") +
        "</tr>";
    }
    html += "</tbody></table><p><br></p>";
    editorRef.current?.focus();
    restoreSelection();
    exec("insertHTML", html);
  };

  // ---- inline link / image editing popups ----
  const closestTag = useCallback(
    (node: Node | null, tag: string): HTMLElement | null => {
      let n: Node | null = node;
      while (n && n !== editorRef.current) {
        if (n.nodeType === 1 && (n as Element).tagName === tag)
          return n as HTMLElement;
        n = n.parentNode;
      }
      return null;
    },
    [],
  );

  const updateLinkPopup = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
    const node = sel.anchorNode;
    // Focus moved to the popup / a modal — keep the current popup & ref.
    if (!node || !editorRef.current.contains(node)) return;
    const a = closestTag(node, "A") as HTMLAnchorElement | null;
    if (a) {
      linkElRef.current = a;
      const r = a.getBoundingClientRect();
      setLinkPop({
        top: r.bottom + 6,
        left: r.left,
        href: a.getAttribute("href") || "",
      });
    } else {
      setLinkPop(null);
      linkElRef.current = null;
    }
  }, [closestTag]);

  const reposition = useCallback(() => {
    if (linkElRef.current) {
      const r = linkElRef.current.getBoundingClientRect();
      setLinkPop((p) => (p ? { ...p, top: r.bottom + 6, left: r.left } : p));
    }
    if (imgElRef.current) {
      const r = imgElRef.current.getBoundingClientRect();
      setImgPop((p) => (p ? { ...p, top: r.bottom + 6, left: r.left } : p));
    }
  }, []);

  useEffect(() => {
    if (viewMode !== "visual") {
      setLinkPop(null);
      setImgPop(null);
      return;
    }
    const onSel = () => updateLinkPopup();
    document.addEventListener("selectionchange", onSel);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("selectionchange", onSel);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [viewMode, updateLinkPopup, reposition]);

  const editLinkUrl = async () => {
    const a = linkElRef.current;
    if (!a) return;
    const url = await prompt({
      title: "Edit Link",
      label: "Link URL",
      defaultValue: a.getAttribute("href") || "https://",
      confirmLabel: "Save",
    });
    if (url == null) return;
    a.setAttribute("href", url);
    if (/^https?:\/\//i.test(url)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    } else {
      a.removeAttribute("target");
      a.removeAttribute("rel");
    }
    setLinkPop((p) => (p ? { ...p, href: url } : p));
    syncContent();
  };
  const openLinkUrl = () => {
    const href = linkElRef.current?.getAttribute("href");
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  };
  const removeLink = () => {
    const a = linkElRef.current;
    const parent = a?.parentNode;
    if (!a || !parent) return;
    while (a.firstChild) parent.insertBefore(a.firstChild, a);
    parent.removeChild(a);
    linkElRef.current = null;
    setLinkPop(null);
    syncContent();
  };

  const IMG_SIZE = ["img-small", "img-medium", "img-full"];
  const IMG_ALIGN = ["img-left", "img-center", "img-right"];
  const setImgClass = (group: string[], cls: string) => {
    const img = imgElRef.current;
    if (!img) return;
    group.forEach((c) => img.classList.remove(c));
    img.classList.add(cls);
    syncContent();
  };
  const editImgAlt = async () => {
    const img = imgElRef.current;
    if (!img) return;
    const alt = await prompt({
      title: "Image Alt Text",
      label: "Alt text (for SEO & accessibility)",
      defaultValue: img.getAttribute("alt") || "",
      confirmLabel: "Save",
    });
    if (alt != null) {
      img.setAttribute("alt", alt);
      syncContent();
    }
  };
  const deleteImg = () => {
    imgElRef.current?.parentNode?.removeChild(imgElRef.current);
    imgElRef.current = null;
    setImgPop(null);
    syncContent();
  };
  const replaceImg = () => replaceInputRef.current?.click();
  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const img = imgElRef.current;
    if (!file || !img) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      img.setAttribute("src", data.url);
      syncContent();
      toast.success("Image replaced");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const isActive = (fmt: string) => activeFormats.has(fmt);

  const Btn = ({
    onClick,
    title,
    active,
    children,
  }: {
    onClick: () => void;
    title: string;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        saveSelection();
        onClick();
      }}
      className={`a-editor__btn${active ? " is-active" : ""}`}
    >
      {children}
    </button>
  );

  const Divider = () => <span className="a-editor__divider" />;

  return (
    <div className="a-editor">
      <div className="a-editor__bar">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            opacity: viewMode === "html" ? 0.4 : 1,
            pointerEvents: viewMode === "html" ? "none" : "auto",
          }}
        >
          <Btn onClick={() => exec("undo")} title="Undo">
            <Undo2 />
          </Btn>
          <Btn onClick={() => exec("redo")} title="Redo">
            <Redo2 />
          </Btn>
          <Divider />
          <Btn onClick={() => toggleHeading(2)} title="Heading 2" active={isActive("h2")}>
            <Heading2 />
          </Btn>
          <Btn onClick={() => toggleHeading(3)} title="Heading 3" active={isActive("h3")}>
            <Heading3 />
          </Btn>
          <Btn onClick={() => toggleHeading(4)} title="Heading 4" active={isActive("h4")}>
            <Heading4 />
          </Btn>
          <Btn onClick={() => exec("formatBlock", "p")} title="Paragraph" active={isActive("p")}>
            <Pilcrow />
          </Btn>
          <Divider />
          <Btn onClick={() => exec("bold")} title="Bold" active={isActive("bold")}>
            <Bold />
          </Btn>
          <Btn onClick={() => exec("italic")} title="Italic" active={isActive("italic")}>
            <Italic />
          </Btn>
          <Btn onClick={() => exec("underline")} title="Underline" active={isActive("underline")}>
            <Underline />
          </Btn>
          <Btn
            onClick={() => exec("strikeThrough")}
            title="Strikethrough"
            active={isActive("strikeThrough")}
          >
            <Strikethrough />
          </Btn>
          <Divider />
          <Btn
            onClick={() => exec("insertUnorderedList")}
            title="Bullet List"
            active={isActive("insertUnorderedList")}
          >
            <List />
          </Btn>
          <Btn
            onClick={() => exec("insertOrderedList")}
            title="Numbered List"
            active={isActive("insertOrderedList")}
          >
            <ListOrdered />
          </Btn>
          <Divider />
          <Btn onClick={() => exec("justifyLeft")} title="Align Left">
            <AlignLeft />
          </Btn>
          <Btn onClick={() => exec("justifyCenter")} title="Align Center">
            <AlignCenter />
          </Btn>
          <Btn onClick={() => exec("justifyRight")} title="Align Right">
            <AlignRight />
          </Btn>
          <Divider />
          <Btn onClick={() => toggleBlock("blockquote")} title="Quote" active={isActive("blockquote")}>
            <Quote />
          </Btn>
          <Btn onClick={() => toggleBlock("pre")} title="Code Block" active={isActive("pre")}>
            <Code />
          </Btn>
          <Btn onClick={insertHR} title="Horizontal Line">
            <Minus />
          </Btn>
          <Btn onClick={insertTable} title="Insert Table">
            <Table />
          </Btn>
          <Divider />
          <Btn onClick={insertLink} title="Insert Link">
            <LinkIcon />
          </Btn>
          <Btn onClick={insertImageUrl} title="Image by URL">
            <ImageIcon />
          </Btn>
          <button
            type="button"
            title="Upload Image"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              fileInputRef.current?.click();
            }}
            className="a-editor__btn"
          >
            {uploading ? <span className="a-spin" style={{ width: 15, height: 15 }} /> : <Upload />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <Divider />
          <Btn onClick={insertCta} title="Insert CTA button (WhatsApp / phone / link)">
            <MousePointerClick />
          </Btn>
        </div>

        {/* Toggle lives OUTSIDE the formatting group so it stays clickable
            even while that group is disabled in HTML (raw) mode. */}
        <Divider />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleViewMode();
          }}
          title={viewMode === "visual" ? "Edit raw HTML" : "Back to visual editor"}
          className={`a-editor__toggle${viewMode === "html" ? " is-on" : ""}`}
        >
          {viewMode === "visual" ? (
            <>
              <FileCode2 /> HTML
            </>
          ) : (
            <>
              <Eye /> Visual
            </>
          )}
        </button>
      </div>

      {viewMode === "html" ? (
        <textarea
          className="a-editor__html"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder="<!-- Edit raw HTML. Switch to Visual to preview. -->"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          className="a-editor__surface"
          onPaste={(e) => {
            const html = e.clipboardData.getData("text/html");
            if (!html) return; // plain text — let the browser handle it
            e.preventDefault();
            editorRef.current?.focus();
            document.execCommand("insertHTML", false, cleanPastedHtml(html));
            syncContent();
            detectFormats();
          }}
          onInput={() => {
            syncContent();
            detectFormats();
          }}
          onBlur={() => {
            saveSelection();
            syncContent();
          }}
          onKeyUp={detectFormats}
          onMouseUp={detectFormats}
          onClick={(e) => {
            const t = e.target as HTMLElement;
            if (t.tagName === "IMG") {
              imgElRef.current = t as HTMLImageElement;
              const r = t.getBoundingClientRect();
              setImgPop({ top: r.bottom + 6, left: r.left });
              setLinkPop(null);
            } else {
              setImgPop(null);
              imgElRef.current = null;
            }
          }}
        />
      )}

      {viewMode === "visual" && linkPop && (
        <div
          className="a-editor__pop"
          style={{ top: linkPop.top, left: linkPop.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="a-editor__pop-url" title={linkPop.href}>
            {linkPop.href || "(no link)"}
          </span>
          <button type="button" className="a-editor__pop-btn" title="Open link" onClick={openLinkUrl}>
            <ExternalLink size={14} />
          </button>
          <button type="button" className="a-editor__pop-btn" title="Edit link" onClick={editLinkUrl}>
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="a-editor__pop-btn a-editor__pop-btn--danger"
            title="Remove link"
            onClick={removeLink}
          >
            <Unlink size={14} />
          </button>
        </div>
      )}

      {viewMode === "visual" && imgPop && (
        <div
          className="a-editor__pop"
          style={{ top: imgPop.top, left: imgPop.left }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button type="button" className="a-editor__pop-btn" title="Edit alt text" onClick={editImgAlt}>
            Alt
          </button>
          <span className="a-editor__pop-sep" />
          <button type="button" className="a-editor__pop-btn" title="Small" onClick={() => setImgClass(IMG_SIZE, "img-small")}>
            S
          </button>
          <button type="button" className="a-editor__pop-btn" title="Medium" onClick={() => setImgClass(IMG_SIZE, "img-medium")}>
            M
          </button>
          <button type="button" className="a-editor__pop-btn" title="Full width" onClick={() => setImgClass(IMG_SIZE, "img-full")}>
            Full
          </button>
          <span className="a-editor__pop-sep" />
          <button type="button" className="a-editor__pop-btn" title="Align left" onClick={() => setImgClass(IMG_ALIGN, "img-left")}>
            <AlignLeft size={14} />
          </button>
          <button type="button" className="a-editor__pop-btn" title="Align center" onClick={() => setImgClass(IMG_ALIGN, "img-center")}>
            <AlignCenter size={14} />
          </button>
          <button type="button" className="a-editor__pop-btn" title="Align right" onClick={() => setImgClass(IMG_ALIGN, "img-right")}>
            <AlignRight size={14} />
          </button>
          <span className="a-editor__pop-sep" />
          <button type="button" className="a-editor__pop-btn" title="Replace image" onClick={replaceImg}>
            <Upload size={14} />
          </button>
          <button
            type="button"
            className="a-editor__pop-btn a-editor__pop-btn--danger"
            title="Delete image"
            onClick={deleteImg}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleReplace}
        style={{ display: "none" }}
      />
    </div>
  );
}
