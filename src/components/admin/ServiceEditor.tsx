"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAdminUI } from "@/components/admin/AdminUI";

interface Form {
  slug: string;
  order: number;
  published: boolean;
  navEn: string;
  navZh: string;
  titleEn: string;
  titleZh: string;
  metaDescEn: string;
  metaDescZh: string;
  css: string;
  bodyEn: string;
  bodyZh: string;
  scriptEn: string;
  scriptZh: string;
}

const EMPTY: Form = {
  slug: "",
  order: 0,
  published: true,
  navEn: "",
  navZh: "",
  titleEn: "",
  titleZh: "",
  metaDescEn: "",
  metaDescZh: "",
  css: "",
  bodyEn: "",
  bodyZh: "",
  scriptEn: "",
  scriptZh: "",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ServiceEditor({ slug }: { slug?: string }) {
  const isEdit = Boolean(slug);
  const router = useRouter();
  const { toast, confirm } = useAdminUI();
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const slugTouched = useRef(false);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    fetch(`/api/admin/services?slug=${encodeURIComponent(slug as string)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d.error) {
          setError(d.error);
          setLoading(false);
          return;
        }
        setForm({
          slug: d.slug ?? "",
          order: Number(d.order) || 0,
          published: d.published !== false,
          navEn: d.navEn ?? "",
          navZh: d.navZh ?? "",
          titleEn: d.titleEn ?? "",
          titleZh: d.titleZh ?? "",
          metaDescEn: d.metaDescEn ?? "",
          metaDescZh: d.metaDescZh ?? "",
          css: d.css ?? "",
          bodyEn: d.bodyEn ?? "",
          bodyZh: d.bodyZh ?? "",
          scriptEn: d.scriptEn ?? "",
          scriptZh: d.scriptZh ?? "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load this service page.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isEdit, slug]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onNavEn = (v: string) =>
    setForm((f) => ({
      ...f,
      navEn: v,
      slug: !isEdit && !slugTouched.current ? slugify(v) : f.slug,
    }));

  const save = async () => {
    if (!form.navEn.trim()) {
      setError("English menu label is required.");
      return;
    }
    const slugVal = (form.slug.trim() || slugify(form.navEn)).trim();
    if (!slugVal) {
      setError("A URL slug is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: slugVal }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Failed to save");
      toast.success(isEdit ? "Service page saved" : "Service page created");
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!isEdit) return;
    const ok = await confirm({
      title: "Delete service page?",
      message: "This permanently removes the page. This cannot be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/services?slug=${encodeURIComponent(form.slug)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Delete failed");
      }
      toast.success("Service page deleted");
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="a-loading">
        <span className="a-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="a-page-head">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/services" className="a-iconbtn" title="Back">
            <ArrowLeft />
          </Link>
          <div>
            <h1 className="a-page-head__title">
              {isEdit ? "Edit Service Page" : "New Service Page"}
            </h1>
            <p className="a-page-head__sub">
              {isEdit
                ? `/services/${form.slug}`
                : "Adds a new page under the Services menu"}
            </p>
          </div>
        </div>
        <div className="a-page-head__actions">
          {isEdit && (
            <button
              type="button"
              className="a-btn a-btn--ghost"
              onClick={remove}
              disabled={saving}
            >
              <Trash2 /> Delete
            </button>
          )}
          <button
            type="button"
            className="a-btn a-btn--primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? (
              <span className="a-spin" style={{ width: 15, height: 15 }} />
            ) : (
              <Save />
            )}
            {isEdit ? "Save changes" : "Create page"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="a-card"
          style={{
            borderColor: "#fca5a5",
            background: "#fef2f2",
            color: "#b91c1c",
            padding: "12px 16px",
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Basics */}
      <div className="a-card" style={{ marginBottom: 18 }}>
        <div className="a-section-title">Basics</div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div className="a-field">
            <label className="a-label">URL slug</label>
            <input
              className="a-input a-input--mono"
              value={form.slug}
              readOnly={isEdit}
              onChange={(e) => {
                slugTouched.current = true;
                set("slug", slugify(e.target.value));
              }}
              placeholder="offshore-manning"
            />
            <div className="a-hint">
              {isEdit
                ? "The page URL — fixed once created."
                : "Lives at /services/<slug>. Auto-filled from the English label."}
            </div>
          </div>
          <div className="a-field">
            <label className="a-label">Menu order</label>
            <input
              className="a-input"
              type="number"
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value) || 0)}
            />
            <div className="a-hint">Lower numbers appear first.</div>
          </div>
        </div>
        <label className="a-checkbox">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Published (visible on the site and in the Services menu)
        </label>
      </div>

      {/* English */}
      <div className="a-card" style={{ marginBottom: 18 }}>
        <div className="a-section-title">English</div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div className="a-field">
            <label className="a-label">Menu label</label>
            <input
              className="a-input"
              value={form.navEn}
              onChange={(e) => onNavEn(e.target.value)}
              placeholder="Offshore Crew Manning"
            />
          </div>
          <div className="a-field">
            <label className="a-label">SEO title</label>
            <input
              className="a-input"
              value={form.titleEn}
              onChange={(e) => set("titleEn", e.target.value)}
              placeholder="… | Ship Crew Agency"
            />
          </div>
        </div>
        <div className="a-field">
          <label className="a-label">SEO description</label>
          <textarea
            className="a-textarea"
            style={{ minHeight: 64 }}
            value={form.metaDescEn}
            onChange={(e) => set("metaDescEn", e.target.value)}
          />
        </div>
        <div className="a-field">
          <label className="a-label">Page body — HTML</label>
          <textarea
            className="a-textarea a-textarea--mono"
            style={{ minHeight: 340 }}
            spellCheck={false}
            value={form.bodyEn}
            onChange={(e) => set("bodyEn", e.target.value)}
          />
        </div>
        <div className="a-field" style={{ marginBottom: 0 }}>
          <label className="a-label">Page script — JavaScript (optional)</label>
          <textarea
            className="a-textarea a-textarea--mono"
            style={{ minHeight: 120 }}
            spellCheck={false}
            value={form.scriptEn}
            onChange={(e) => set("scriptEn", e.target.value)}
          />
        </div>
      </div>

      {/* Chinese */}
      <div className="a-card" style={{ marginBottom: 18 }}>
        <div className="a-section-title">中文 (Chinese)</div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div className="a-field">
            <label className="a-label">Menu label</label>
            <input
              className="a-input"
              value={form.navZh}
              onChange={(e) => set("navZh", e.target.value)}
              placeholder="海上平台船员配备"
            />
          </div>
          <div className="a-field">
            <label className="a-label">SEO title</label>
            <input
              className="a-input"
              value={form.titleZh}
              onChange={(e) => set("titleZh", e.target.value)}
            />
          </div>
        </div>
        <div className="a-field">
          <label className="a-label">SEO description</label>
          <textarea
            className="a-textarea"
            style={{ minHeight: 64 }}
            value={form.metaDescZh}
            onChange={(e) => set("metaDescZh", e.target.value)}
          />
        </div>
        <div className="a-field">
          <label className="a-label">Page body — HTML</label>
          <textarea
            className="a-textarea a-textarea--mono"
            style={{ minHeight: 340 }}
            spellCheck={false}
            value={form.bodyZh}
            onChange={(e) => set("bodyZh", e.target.value)}
          />
        </div>
        <div className="a-field" style={{ marginBottom: 0 }}>
          <label className="a-label">Page script — JavaScript (optional)</label>
          <textarea
            className="a-textarea a-textarea--mono"
            style={{ minHeight: 120 }}
            spellCheck={false}
            value={form.scriptZh}
            onChange={(e) => set("scriptZh", e.target.value)}
          />
        </div>
      </div>

      {/* Shared CSS */}
      <div className="a-card" style={{ marginBottom: 18 }}>
        <div className="a-section-title">
          Stylesheet — CSS (shared by both languages)
        </div>
        <div className="a-field" style={{ marginBottom: 0 }}>
          <textarea
            className="a-textarea a-textarea--mono"
            style={{ minHeight: 260 }}
            spellCheck={false}
            value={form.css}
            onChange={(e) => set("css", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
