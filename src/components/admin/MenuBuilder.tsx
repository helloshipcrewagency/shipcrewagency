"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  RotateCcw,
  Link2,
} from "lucide-react";
import { useAdminUI } from "@/components/admin/AdminUI";
import type { MenuNode } from "@/lib/menu/types";

type PaletteItem = {
  labelEn: string;
  labelZh: string;
  url: string;
  external?: boolean;
};
type PaletteGroup = { group: string; items: PaletteItem[] };

let seq = 0;
function genId(): string {
  seq += 1;
  return `m${seq}_${Date.now().toString(36)}`;
}

function clone(tree: MenuNode[]): MenuNode[] {
  return JSON.parse(JSON.stringify(tree));
}

type Loc = {
  parent: MenuNode | null;
  arr: MenuNode[];
  index: number;
  node: MenuNode;
};

function locate(
  tree: MenuNode[],
  id: string,
  parent: MenuNode | null = null,
): Loc | null {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) return { parent, arr: tree, index: i, node: tree[i] };
    const ch = tree[i].children;
    if (ch) {
      const r = locate(ch, id, tree[i]);
      if (r) return r;
    }
  }
  return null;
}

function isWithin(node: MenuNode, id: string): boolean {
  if (node.id === id) return true;
  return (node.children ?? []).some((c) => isWithin(c, id));
}

function countNodes(tree: MenuNode[]): number {
  return tree.reduce((n, x) => n + 1 + countNodes(x.children ?? []), 0);
}
function maxDepth(tree: MenuNode[], d = 1): number {
  let m = tree.length ? d : 0;
  for (const x of tree) if (x.children?.length) m = Math.max(m, maxDepth(x.children, d + 1));
  return m;
}

export function MenuBuilder() {
  const { toast, confirm } = useAdminUI();
  const [tree, setTree] = useState<MenuNode[]>([]);
  const [palette, setPalette] = useState<PaletteGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);

  // custom-link form
  const [cEn, setCEn] = useState("");
  const [cZh, setCZh] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cExternal, setCExternal] = useState(false);

  // drag state
  const dragId = useRef<string | null>(null);
  const [dropHint, setDropHint] = useState<{ id: string; pos: "before" | "into" } | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/menu", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setTree(Array.isArray(data.menu) ? data.menu : []);
      setPalette(Array.isArray(data.palette) ? data.palette : []);
      setDirty(false);
    } catch {
      toast.error("Could not load the menu.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const mutate = useCallback((fn: (t: MenuNode[]) => void) => {
    setTree((prev) => {
      const t = clone(prev);
      fn(t);
      return t;
    });
    setDirty(true);
  }, []);

  const addNode = (item: PaletteItem) =>
    mutate((t) =>
      void t.push({
        id: genId(),
        labelEn: item.labelEn,
        labelZh: item.labelZh,
        url: item.url,
        external: item.external,
      }),
    );

  const addCustom = () => {
    if (!cEn.trim() && !cZh.trim()) {
      toast.error("Give the link a label first.");
      return;
    }
    mutate((t) =>
      void t.push({
        id: genId(),
        labelEn: cEn.trim() || cZh.trim(),
        labelZh: cZh.trim() || cEn.trim(),
        url: cUrl.trim(),
        external: cExternal,
      }),
    );
    setCEn("");
    setCZh("");
    setCUrl("");
    setCExternal(false);
  };

  const update = (id: string, patch: Partial<MenuNode>) =>
    mutate((t) => {
      const loc = locate(t, id);
      if (loc) Object.assign(loc.node, patch);
    });

  const remove = (id: string) =>
    mutate((t) => {
      const loc = locate(t, id);
      if (loc) loc.arr.splice(loc.index, 1);
    });

  const moveUp = (id: string) =>
    mutate((t) => {
      const loc = locate(t, id);
      if (loc && loc.index > 0) {
        const [n] = loc.arr.splice(loc.index, 1);
        loc.arr.splice(loc.index - 1, 0, n);
      }
    });

  const moveDown = (id: string) =>
    mutate((t) => {
      const loc = locate(t, id);
      if (loc && loc.index < loc.arr.length - 1) {
        const [n] = loc.arr.splice(loc.index, 1);
        loc.arr.splice(loc.index + 1, 0, n);
      }
    });

  // make this item a child of its previous sibling
  const indent = (id: string) =>
    mutate((t) => {
      const loc = locate(t, id);
      if (loc && loc.index > 0) {
        const prev = loc.arr[loc.index - 1];
        const [n] = loc.arr.splice(loc.index, 1);
        prev.children = prev.children ?? [];
        prev.children.push(n);
      }
    });

  // move this item up to its grandparent level, just after its parent
  const outdent = (id: string) =>
    mutate((t) => {
      const loc = locate(t, id);
      if (loc && loc.parent) {
        const [n] = loc.arr.splice(loc.index, 1);
        const ploc = locate(t, loc.parent.id);
        if (ploc) ploc.arr.splice(ploc.index + 1, 0, n);
      }
    });

  const toggleEdit = (id: string) =>
    setEditing((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  // ---- drag & drop ----
  const onDrop = (targetId: string) => {
    const src = dragId.current;
    const hint = dropHint;
    dragId.current = null;
    setDropHint(null);
    if (!src || !hint || src === targetId) return;
    mutate((t) => {
      const srcLoc = locate(t, src);
      if (!srcLoc) return;
      // never drop a node into its own subtree
      if (isWithin(srcLoc.node, targetId)) return;
      const [moved] = srcLoc.arr.splice(srcLoc.index, 1);
      const tLoc = locate(t, targetId);
      if (!tLoc) {
        t.push(moved);
        return;
      }
      if (hint.pos === "into") {
        tLoc.node.children = tLoc.node.children ?? [];
        tLoc.node.children.push(moved);
      } else {
        tLoc.arr.splice(tLoc.index, 0, moved);
      }
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu: tree }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (Array.isArray(data.menu)) setTree(data.menu);
      setDirty(false);
      toast.success("Menu saved.");
    } catch {
      toast.error("Could not save the menu.");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    const ok = await confirm({
      title: "Reset to the default menu?",
      message:
        "This clears your custom menu and the site falls back to its built-in navigation (Home, About, Services, etc.). You can rebuild a custom menu anytime.",
      confirmLabel: "Reset menu",
      tone: "danger",
    });
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu: [] }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setTree([]);
      setDirty(false);
      toast.success("Reverted to the default menu.");
    } catch {
      toast.error("Could not reset the menu.");
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(
    () => ({ total: countNodes(tree), depth: maxDepth(tree) }),
    [tree],
  );

  const renderNodes = (nodes: MenuNode[], depth: number) =>
    nodes.map((node, i) => {
      const isEditing = editing.has(node.id);
      const last = i === nodes.length - 1;
      return (
        <div key={node.id} className="mb-branch">
          <div
            className={`mb-row${dropHint?.id === node.id ? ` is-drop-${dropHint.pos}` : ""}`}
            style={{ marginLeft: depth * 22 }}
            draggable
            onDragStart={() => {
              dragId.current = node.id;
            }}
            onDragOver={(e) => {
              e.preventDefault();
              const r = e.currentTarget.getBoundingClientRect();
              const into = e.clientY - r.top > r.height * 0.55;
              setDropHint({ id: node.id, pos: into ? "into" : "before" });
            }}
            onDragLeave={() => setDropHint(null)}
            onDrop={() => onDrop(node.id)}
          >
            <span className="mb-grip" title="Drag to move">
              <GripVertical size={15} />
            </span>
            <span className="mb-label">
              {node.labelEn || node.labelZh}
              <span className="mb-url">
                {node.external ? "↗ " : "/"}
                {node.url || (node.external ? "" : "(home)")}
              </span>
            </span>
            <span className="mb-actions">
              <button
                type="button"
                className="mb-ic"
                title="Move up"
                onClick={() => moveUp(node.id)}
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                className="mb-ic"
                title="Move down"
                onClick={() => moveDown(node.id)}
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                className="mb-ic"
                title="Nest under previous item"
                disabled={i === 0}
                onClick={() => indent(node.id)}
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                className="mb-ic"
                title="Move out one level"
                disabled={depth === 0}
                onClick={() => outdent(node.id)}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                className={`mb-ic${isEditing ? " is-on" : ""}`}
                title="Edit labels & link"
                onClick={() => toggleEdit(node.id)}
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                className="mb-ic mb-ic--danger"
                title="Remove"
                onClick={() => remove(node.id)}
              >
                <Trash2 size={14} />
              </button>
            </span>
          </div>

          {isEditing && (
            <div className="mb-edit" style={{ marginLeft: depth * 22 }}>
              <div className="mb-edit__grid">
                <label className="a-field">
                  <span className="a-label">Label (English)</span>
                  <input
                    className="a-input"
                    value={node.labelEn}
                    onChange={(e) => update(node.id, { labelEn: e.target.value })}
                  />
                </label>
                <label className="a-field">
                  <span className="a-label">Label (中文)</span>
                  <input
                    className="a-input"
                    value={node.labelZh}
                    onChange={(e) => update(node.id, { labelZh: e.target.value })}
                  />
                </label>
                <label className="a-field">
                  <span className="a-label">
                    {node.external ? "External URL" : "Path"}
                  </span>
                  <input
                    className="a-input a-input--mono"
                    value={node.url}
                    placeholder={node.external ? "https://…" : "about · services/crew-manning · (blank = home)"}
                    onChange={(e) => update(node.id, { url: e.target.value })}
                  />
                </label>
                <label className="a-checkbox mb-edit__check">
                  <input
                    type="checkbox"
                    checked={Boolean(node.external)}
                    onChange={(e) =>
                      update(node.id, { external: e.target.checked })
                    }
                  />
                  <span>Open in a new tab (external link)</span>
                </label>
              </div>
            </div>
          )}

          {node.children?.length ? (
            <div className="mb-children">
              {renderNodes(node.children, depth + 1)}
            </div>
          ) : null}
          {last && depth === 0 ? null : null}
        </div>
      );
    });

  return (
    <div className="mb">
      <div className="a-page-head">
        <div>
          <h1 className="a-page-head__title">Menu Builder</h1>
          <p className="a-page-head__sub">
            Build the header navigation — drag to reorder, nest items as deep as
            you like, and give every item an English and a 中文 label.
          </p>
        </div>
        <div className="a-page-head__actions">
          <button
            type="button"
            className="a-btn a-btn--ghost"
            onClick={resetToDefault}
            disabled={saving || loading}
          >
            <RotateCcw size={15} /> Reset to default
          </button>
          <button
            type="button"
            className="a-btn a-btn--primary"
            onClick={save}
            disabled={saving || loading}
          >
            <Save size={15} /> {saving ? "Saving…" : "Save menu"}
          </button>
        </div>
      </div>

      {dirty && (
        <div className="mb-dirty">Unsaved changes — remember to save.</div>
      )}

      <div className="mb-grid">
        {/* palette */}
        <aside className="mb-palette">
          <div className="a-card">
            <div className="a-card__head">
              <h2 className="a-card__title">Add to menu</h2>
            </div>
            {palette.map((g) => (
              <div className="mb-pal-group" key={g.group}>
                <div className="mb-pal-group__title">{g.group}</div>
                <div className="mb-pal-items">
                  {g.items.map((it) => (
                    <button
                      type="button"
                      key={g.group + it.url + it.labelEn}
                      className="mb-pal-item"
                      onClick={() => addNode(it)}
                      title={`Add “${it.labelEn}”`}
                    >
                      <Plus size={13} />
                      <span>{it.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mb-pal-group">
              <div className="mb-pal-group__title">
                <Link2 size={13} /> Custom link
              </div>
              <div className="mb-custom">
                <input
                  className="a-input"
                  placeholder="Label (English)"
                  value={cEn}
                  onChange={(e) => setCEn(e.target.value)}
                />
                <input
                  className="a-input"
                  placeholder="标签 (中文)"
                  value={cZh}
                  onChange={(e) => setCZh(e.target.value)}
                />
                <input
                  className="a-input a-input--mono"
                  placeholder={cExternal ? "https://…" : "path e.g. contact"}
                  value={cUrl}
                  onChange={(e) => setCUrl(e.target.value)}
                />
                <label className="a-checkbox">
                  <input
                    type="checkbox"
                    checked={cExternal}
                    onChange={(e) => setCExternal(e.target.checked)}
                  />
                  <span>External link (new tab)</span>
                </label>
                <button
                  type="button"
                  className="a-btn a-btn--cyan a-btn--sm"
                  onClick={addCustom}
                >
                  <Plus size={14} /> Add custom link
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* tree */}
        <section className="mb-tree-wrap">
          <div className="a-card">
            <div className="a-card__head">
              <h2 className="a-card__title">Menu structure</h2>
              <span className="a-muted">
                {stats.total} item{stats.total === 1 ? "" : "s"} · {stats.depth}{" "}
                level{stats.depth === 1 ? "" : "s"} deep
              </span>
            </div>

            {loading ? (
              <div className="a-loading">
                <span className="a-spin" /> Loading…
              </div>
            ) : tree.length === 0 ? (
              <div className="a-empty">
                <div className="a-empty__title">Using the default menu</div>
                <div className="a-empty__text">
                  Add items from the left to build a custom header menu. Until you
                  save at least one item, the site keeps its built-in navigation.
                </div>
              </div>
            ) : (
              <div
                className="mb-tree"
                onDragOver={(e) => e.preventDefault()}
              >
                {renderNodes(tree, 0)}
              </div>
            )}
          </div>
          <p className="mb-tip">
            Tip: drag a row onto the <strong>lower half</strong> of another row to
            nest it inside; drop on the <strong>upper half</strong> to place it
            above. The arrow buttons do the same without dragging.
          </p>
        </section>
      </div>
    </div>
  );
}
