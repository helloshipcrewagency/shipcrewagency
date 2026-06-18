"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Anchor,
  ExternalLink,
  Search,
  CheckCircle2,
  FileEdit,
  Languages,
} from "lucide-react";
import { useAdminUI } from "@/components/admin/AdminUI";

interface SvcMeta {
  slug: string;
  order: number;
  published: boolean;
  navEn: string;
  navZh: string;
  titleEn: string;
}

function Tile({
  icon,
  label,
  value,
  hint,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  variant?: "blue" | "green" | "amber" | "navy";
}) {
  return (
    <div className="a-tile">
      <div className="a-tile__top">
        <span className="a-tile__label">{label}</span>
        <span
          className={`a-tile__icon${variant ? ` a-tile__icon--${variant}` : ""}`}
        >
          {icon}
        </span>
      </div>
      <div className="a-tile__value">{value}</div>
      {hint && <div className="a-tile__hint">{hint}</div>}
    </div>
  );
}

export default function AdminServicesPage() {
  const { toast, confirm } = useAdminUI();
  const [items, setItems] = useState<SvcMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((m) => m.published).length;
    const bilingual = items.filter((m) => (m.navZh || "").trim().length).length;
    return { total, published, drafts: total - published, bilingual };
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((m) => {
      if (status === "published" && !m.published) return false;
      if (status === "draft" && m.published) return false;
      if (!needle) return true;
      return (
        m.navEn.toLowerCase().includes(needle) ||
        (m.navZh || "").toLowerCase().includes(needle) ||
        m.slug.toLowerCase().includes(needle) ||
        (m.titleEn || "").toLowerCase().includes(needle)
      );
    });
  }, [items, q, status]);

  const remove = async (m: SvcMeta) => {
    const ok = await confirm({
      title: "Delete service page?",
      message: `Remove "${m.navEn}" (/services/${m.slug}). This cannot be undone.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setDeleting(m.slug);
    try {
      const res = await fetch(
        `/api/admin/services?slug=${encodeURIComponent(m.slug)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Delete failed");
      }
      toast.success("Service page deleted");
      setItems((prev) => prev.filter((x) => x.slug !== m.slug));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="a-page-head">
        <div>
          <h1 className="a-page-head__title">Service Pages</h1>
          <p className="a-page-head__sub">
            {stats.total} pages · {stats.published} published ·{" "}
            {stats.drafts} draft · shown under the Services menu
          </p>
        </div>
        <div className="a-page-head__actions">
          <Link href="/admin/services/new" className="a-btn a-btn--primary">
            <Plus /> New Service Page
          </Link>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="a-stats">
        <Tile
          icon={<Anchor />}
          variant="blue"
          label="Total Pages"
          value={stats.total}
        />
        <Tile
          icon={<CheckCircle2 />}
          variant="green"
          label="Published"
          value={stats.published}
        />
        <Tile
          icon={<FileEdit />}
          variant="amber"
          label="Drafts"
          value={stats.drafts}
        />
        <Tile
          icon={<Languages />}
          variant="navy"
          label="With 中文"
          value={stats.bilingual}
          hint="bilingual pages"
        />
      </div>

      {/* Toolbar: search + status filter */}
      <div className="a-toolbar" style={{ marginBottom: 18, gap: 10 }}>
        <div
          className="a-input-group"
          style={{ flex: 1, maxWidth: 380, position: "relative" }}
        >
          <Search
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 16,
              height: 16,
              color: "var(--a-ink-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            className="a-input"
            style={{ paddingLeft: 36 }}
            placeholder="Search service pages…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="a-select"
          style={{ width: 170 }}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "all" | "published" | "draft")
          }
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="a-card">
        {loading ? (
          <div className="a-loading">
            <span className="a-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="a-empty">
            <Anchor />
            <div className="a-empty__title">
              {items.length === 0 ? "No service pages" : "No matches"}
            </div>
            <div className="a-empty__text">
              {items.length === 0
                ? "Create your first service page."
                : "Try a different search or filter."}
            </div>
            {items.length === 0 && (
              <Link
                href="/admin/services/new"
                className="a-btn a-btn--cyan a-btn--sm"
              >
                <Plus /> Create one
              </Link>
            )}
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>中文</th>
                  <th>Status</th>
                  <th className="a-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.slug}>
                    <td>
                      <div className="a-table__title">{m.navEn}</div>
                      <div className="a-table__sub">{m.titleEn}</div>
                    </td>
                    <td>
                      <a
                        className="a-muted"
                        href={`/services/${m.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        /services/{m.slug}
                        <ExternalLink style={{ width: 13, height: 13 }} />
                      </a>
                    </td>
                    <td>{m.navZh || "—"}</td>
                    <td>
                      <span
                        className={`a-badge ${
                          m.published ? "a-badge--published" : "a-badge--draft"
                        }`}
                      >
                        {m.published ? "published" : "draft"}
                      </span>
                    </td>
                    <td>
                      <div className="a-table__actions">
                        <Link
                          href={`/admin/services/edit?slug=${encodeURIComponent(
                            m.slug,
                          )}`}
                          className="a-iconbtn"
                          title="Edit"
                        >
                          <Pencil />
                        </Link>
                        <button
                          type="button"
                          className="a-iconbtn a-iconbtn--danger"
                          onClick={() => remove(m)}
                          disabled={deleting === m.slug}
                          title="Delete"
                        >
                          {deleting === m.slug ? (
                            <span
                              className="a-spin"
                              style={{ width: 15, height: 15 }}
                            />
                          ) : (
                            <Trash2 />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
