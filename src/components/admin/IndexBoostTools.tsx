"use client";

import { useState } from "react";
import { Zap, Radio, Rss, ExternalLink } from "lucide-react";
import { useAdminUI } from "./AdminUI";

export function IndexBoostTools({
  notIndexedCount,
  gsc,
}: {
  notIndexedCount: number;
  gsc: boolean;
}) {
  const { toast } = useAdminUI();
  const [busy, setBusy] = useState<string | null>(null);

  const call = async (action: string, okMsg: string) => {
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/indexing?action=${action}`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      toast.success(okMsg);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="ix-tools">
      <div className="ix-tool">
        <div className="ix-tool__head">
          <span className="ix-tool__icon ix-tool__icon--blue">
            <Zap size={18} />
          </span>
          <div>
            <div className="ix-tool__title">IndexNow</div>
            <div className="ix-tool__sub">Instant crawl notification</div>
          </div>
        </div>
        <p className="ix-tool__text">
          Submit your not-indexed URLs to Bing, Yandex &amp; other engines. No
          daily limit.
        </p>
        <button
          type="button"
          className="a-btn a-btn--cyan ix-tool__btn"
          onClick={() => call("indexnow", "Submitted to IndexNow")}
          disabled={busy !== null || notIndexedCount === 0}
        >
          {busy === "indexnow" ? (
            <span className="a-spin" style={{ width: 15, height: 15 }} />
          ) : (
            <Zap size={15} />
          )}
          Submit Not-Indexed ({notIndexedCount})
        </button>
      </div>

      <div className="ix-tool">
        <div className="ix-tool__head">
          <span className="ix-tool__icon ix-tool__icon--green">
            <Radio size={18} />
          </span>
          <div>
            <div className="ix-tool__title">Sitemap Submit</div>
            <div className="ix-tool__sub">Google Search Console</div>
          </div>
        </div>
        <p className="ix-tool__text">
          Submit your sitemap to Google Search Console. Use after publishing new
          content.
        </p>
        <button
          type="button"
          className="a-btn a-btn--primary ix-tool__btn"
          onClick={() => call("sitemap", "Sitemap submitted")}
          disabled={busy !== null || !gsc}
          title={gsc ? "" : "Connect Search Console first"}
        >
          {busy === "sitemap" ? (
            <span className="a-spin" style={{ width: 15, height: 15 }} />
          ) : (
            <Radio size={15} />
          )}
          Submit Sitemap
        </button>
      </div>

      <div className="ix-tool">
        <div className="ix-tool__head">
          <span className="ix-tool__icon ix-tool__icon--gold">
            <Rss size={18} />
          </span>
          <div>
            <div className="ix-tool__title">RSS Feed</div>
            <div className="ix-tool__sub">Auto-discovery for crawlers</div>
          </div>
        </div>
        <p className="ix-tool__text">
          The RSS feed helps search engines discover new content automatically.
        </p>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="a-btn a-btn--ghost ix-tool__btn"
        >
          <ExternalLink size={15} /> View RSS Feed
        </a>
        <div className="ix-tool__active">✓ Active — auto-linked in &lt;head&gt;</div>
      </div>
    </div>
  );
}
