"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Anchor, ExternalLink } from "lucide-react";
import { useAdminUI } from "@/components/admin/AdminUI";

interface SvcMeta {
  slug: string;
  order: number;
  published: boolean;
  navEn: string;
  navZh: string;
  titleEn: string;
}

export default function AdminServicesPage() {
  const { toast, confirm } = useAdminUI();
  const [items, setItems] = useState<SvcMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

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
            {items.length} pages · shown under the Services menu
          </p>
        </div>
        <div className="a-page-head__actions">
          <Link href="/admin/services/new" className="a-btn a-btn--primary">
            <Plus /> New Service Page
          </Link>
        </div>
      </div>

      <div className="a-card">
        {loading ? (
          <div className="a-loading">
            <span className="a-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="a-empty">
            <Anchor />
            <div className="a-empty__title">No service pages</div>
            <div className="a-empty__text">Create your first service page.</div>
            <Link
              href="/admin/services/new"
              className="a-btn a-btn--cyan a-btn--sm"
            >
              <Plus /> Create one
            </Link>
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
                {items.map((m) => (
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
