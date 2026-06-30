"use client";

import { useState } from "react";
import { Copy, Check, Zap, Search, ExternalLink, Send } from "lucide-react";
import { useAdminUI } from "./AdminUI";
import type { IndexReport, IndexPage } from "@/lib/indexing/scan";

export function IndexReportView({
  report,
  origin,
}: {
  report: IndexReport;
  origin: string;
}) {
  const { toast } = useAdminUI();
  const [copied, setCopied] = useState<string | null>(null);
  const [indexing, setIndexing] = useState(false);
  const [busyUrl, setBusyUrl] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const abs = (path: string) => `${origin}${path}`;
  const urlsForState = (state: string) =>
    report.pages.filter((p) => p.state === state).map((p) => abs(p.url));

  const copy = async (urls: string[], key: string, label: string) => {
    if (!urls.length) return;
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setCopied(key);
      toast.success(`${urls.length} ${label} URL${urls.length === 1 ? "" : "s"} copied`);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const submitOne = async (path: string) => {
    const full = abs(path);
    setBusyUrl(path);
    try {
      const res = await fetch("/api/admin/indexing?action=indexnow-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: full }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submit failed");
      toast.success("Submitted to IndexNow");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setBusyUrl(null);
    }
  };

  const indexAll = async () => {
    setIndexing(true);
    try {
      const res = await fetch("/api/admin/indexing?action=indexnow", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submit failed");
      toast.success(`Submitted ${data.submitted ?? ""} URLs to IndexNow`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setIndexing(false);
    }
  };

  // Donut geometry
  const R = 70;
  const C = 2 * Math.PI * R;
  const indexedArc = (report.indexRate / 100) * C;

  const term = q.trim().toLowerCase();
  const match = (p: IndexPage) =>
    !term || p.url.toLowerCase().includes(term) || p.state.toLowerCase().includes(term);
  const indexedPages = report.pages.filter((p) => p.indexed && match(p));
  const notIndexedPages = report.pages.filter((p) => !p.indexed && match(p));
  const totalNotIndexed = report.pages.filter((p) => !p.indexed).length;

  return (
    <>
      <div className="ix-grid">
        {/* Donut */}
        <div className="a-card ix-donut-card">
          <svg viewBox="0 0 180 180" className="ix-donut">
            <circle className="ix-donut__bg" cx="90" cy="90" r={R} />
            <circle
              className="ix-donut__fg"
              cx="90"
              cy="90"
              r={R}
              strokeDasharray={`${indexedArc} ${C - indexedArc}`}
            />
            <text x="90" y="84" className="ix-donut__pct">
              {report.indexRate.toFixed(1)}%
            </text>
            <text x="90" y="104" className="ix-donut__sub">
              Indexed
            </text>
          </svg>
          <div className="ix-legend">
            <span>
              <span className="ix-dot ix-dot--green" /> Indexed ({report.indexed})
            </span>
            <span>
              <span className="ix-dot ix-dot--red" /> Not indexed ({report.notIndexed})
            </span>
          </div>
        </div>

        {/* Coverage breakdown — click a row to copy its URLs */}
        <div className="a-card">
          <div className="a-card__head">
            <h2 className="a-card__title">Coverage breakdown</h2>
          </div>
          <div className="ix-pad">
            <div className="ix-coverage">
              {report.coverage.map((c) => {
                const pct = report.total
                  ? Math.round((c.count / report.total) * 100)
                  : 0;
                const key = `cov:${c.state}`;
                return (
                  <button
                    type="button"
                    className="ix-cov ix-cov--btn"
                    key={c.state}
                    onClick={() => copy(urlsForState(c.state), key, c.state)}
                    title="Click to copy these URLs"
                  >
                    <span className="ix-cov__label">{c.state}</span>
                    <div className="ix-cov__bar">
                      <span className="ix-cov__fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="ix-cov__count">
                      {copied === key ? "Copied!" : `${c.count} (${pct}%)`}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="ix-hint">
              <Copy size={13} /> Click any row to copy its URLs
            </div>
          </div>
        </div>
      </div>

      {/* Search + Index-all toolbar */}
      <div className="ix-controls">
        <div className="ix-search">
          <Search size={15} />
          <input
            className="ix-search__input"
            placeholder="Search pages…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {totalNotIndexed > 0 && (
          <button
            type="button"
            className="a-btn a-btn--cyan"
            onClick={indexAll}
            disabled={indexing}
          >
            {indexing ? (
              <span className="a-spin" style={{ width: 15, height: 15 }} />
            ) : (
              <Zap size={15} />
            )}
            Index All Not-Indexed ({totalNotIndexed})
          </button>
        )}
      </div>

      {/* Two lists with copy-all + per-row actions */}
      <div className="an-cols">
        <PageList
          title="Indexed Pages"
          tone="good"
          rows={indexedPages}
          origin={origin}
          busyUrl={busyUrl}
          onSubmitOne={submitOne}
          copied={copied === "indexed"}
          onCopy={() =>
            copy(indexedPages.map((p) => abs(p.url)), "indexed", "indexed")
          }
          empty="No indexed pages yet."
        />
        <PageList
          title="Not Indexed Pages"
          tone="bad"
          rows={notIndexedPages}
          origin={origin}
          busyUrl={busyUrl}
          onSubmitOne={submitOne}
          copied={copied === "notindexed"}
          onCopy={() =>
            copy(
              notIndexedPages.map((p) => abs(p.url)),
              "notindexed",
              "not-indexed",
            )
          }
          empty="Everything is indexed."
        />
      </div>
    </>
  );
}

function PageList({
  title,
  tone,
  rows,
  origin,
  busyUrl,
  onSubmitOne,
  copied,
  onCopy,
  empty,
}: {
  title: string;
  tone: "good" | "bad";
  rows: IndexPage[];
  origin: string;
  busyUrl: string | null;
  onSubmitOne: (url: string) => void;
  copied: boolean;
  onCopy: () => void;
  empty: string;
}) {
  const inspectUrl = (path: string) =>
    `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(
      `${origin}/`,
    )}&id=${encodeURIComponent(`${origin}${path}`)}`;

  return (
    <div className="a-card">
      <div className="a-card__head">
        <h2 className="a-card__title">
          {title} <span className={`ix-badge ix-badge--${tone}`}>{rows.length}</span>
        </h2>
        {rows.length > 0 && (
          <button
            type="button"
            className="a-iconbtn"
            onClick={onCopy}
            title="Copy all URLs"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        )}
      </div>
      {rows.length ? (
        <div className="ix-table-wrap">
          <table className="a-table ix-table">
            <thead>
              <tr>
                <th className="ix-th-num">#</th>
                <th className="ix-url">URL</th>
                <th className="ix-col-status">Status</th>
                <th className="a-th-right ix-col-act">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => {
                const busy = busyUrl === p.url;
                return (
                  <tr key={p.url}>
                    <td className="ix-td-num">{i + 1}</td>
                    <td className="ix-url">
                      <a
                        className="ix-row__url"
                        href={`${origin}${p.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.url}
                      >
                        <span>{p.url}</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                    <td className="ix-col-status">
                      <span
                        className={`ix-row__state ix-row__state--${tone}`}
                        title={p.state}
                      >
                        {tone === "good" ? "Indexed" : "Not indexed"}
                      </span>
                    </td>
                    <td className="a-th-right ix-col-act">
                      <div className="ix-row__act">
                        {tone === "bad" && (
                          <a
                            className="ix-act ix-act--google"
                            href={inspectUrl(p.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Inspect in Google Search Console"
                          >
                            Google
                          </a>
                        )}
                        <button
                          type="button"
                          className="ix-act ix-act--now"
                          onClick={() => onSubmitOne(p.url)}
                          disabled={busy}
                          title="Submit this URL to IndexNow (Bing / Yandex)"
                        >
                          {busy ? (
                            <span
                              className="a-spin"
                              style={{ width: 12, height: 12 }}
                            />
                          ) : (
                            <Send size={12} />
                          )}
                          {tone === "good" ? "Reindex" : "IndexNow"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="an-nodata">{empty}</div>
      )}
    </div>
  );
}
