"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Share2,
  Twitter,
  Type,
  Image as ImageIcon,
  Code2,
  ShieldCheck,
  Zap,
  Link2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronsUpDown,
} from "lucide-react";
import type { SeoAudit, Severity } from "@/lib/seo-audit/audit";

const CAT_ICON: Record<string, React.ReactNode> = {
  meta: <FileText size={16} />,
  og: <Share2 size={16} />,
  twitter: <Twitter size={16} />,
  headings: <Type size={16} />,
  images: <ImageIcon size={16} />,
  structured: <Code2 size={16} />,
  technical: <ShieldCheck size={16} />,
  performance: <Zap size={16} />,
  links: <Link2 size={16} />,
};

type Tab = "overview" | "pages" | "global";
type SortKey = "url" | "score" | "kb" | "critical" | "warn" | "info";

function sevIcon(s: Severity) {
  if (s === "critical") return <XCircle size={16} className="sh-sev--critical" />;
  if (s === "warning") return <AlertTriangle size={16} className="sh-sev--warning" />;
  return <Info size={16} className="sh-sev--info" />;
}

export function SeoHealthTabs({ audit }: { audit: SeoAudit }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [asc, setAsc] = useState(true);

  // Tolerate audits saved before these fields existed (old data has no
  // globals / per-page size+severity counts). They fill in on the next scan.
  const globals = audit.globals ?? [];
  const categories = audit.categories ?? [];
  const topIssues = audit.topIssues ?? [];

  const pages = useMemo(() => {
    const norm = (audit.pages ?? []).map((p) => ({
      url: p.url,
      title: p.title ?? "",
      ok: p.ok,
      score: p.score ?? 0,
      kb: p.kb ?? 0,
      critical:
        p.critical ??
        p.issues?.filter((i) => i.severity === "critical").length ??
        0,
      warn:
        p.warn ??
        p.issues?.filter((i) => i.severity === "warning").length ??
        0,
      info:
        p.info ?? p.issues?.filter((i) => i.severity === "info").length ?? 0,
    }));
    const term = q.trim().toLowerCase();
    const filtered = term
      ? norm.filter(
          (p) =>
            p.url.toLowerCase().includes(term) ||
            p.title.toLowerCase().includes(term),
        )
      : norm;
    return [...filtered].sort((a, b) => {
      const av = sortKey === "url" ? a.url : (a[sortKey] as number);
      const bv = sortKey === "url" ? b.url : (b[sortKey] as number);
      if (av < bv) return asc ? -1 : 1;
      if (av > bv) return asc ? 1 : -1;
      return 0;
    });
  }, [audit.pages, q, sortKey, asc]);

  const sort = (key: SortKey) => {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(key === "url" || key === "score");
    }
  };

  const Th = ({ k, label, right }: { k: SortKey; label: string; right?: boolean }) => (
    <th
      className={`sht-th${right ? " a-th-right" : ""}${sortKey === k ? " is-sorted" : ""}`}
      onClick={() => sort(k)}
    >
      <span>
        {label} <ChevronsUpDown size={12} />
      </span>
    </th>
  );

  return (
    <div className="sht">
      <div className="sht-tabs">
        <button type="button" className={`sht-tab${tab === "overview" ? " is-active" : ""}`} onClick={() => setTab("overview")}>
          Overview
        </button>
        <button type="button" className={`sht-tab${tab === "pages" ? " is-active" : ""}`} onClick={() => setTab("pages")}>
          Pages ({audit.pages?.length ?? 0})
        </button>
        <button type="button" className={`sht-tab${tab === "global" ? " is-active" : ""}`} onClick={() => setTab("global")}>
          Global Checks ({globals.length})
        </button>
      </div>

      {tab === "overview" && (
        <>
          <h3 className="sht-h">Category Breakdown</h3>
          <div className="sh-cats">
            {categories.map((c) => (
              <div className="a-card sh-cat" key={c.key}>
                <div className="sh-cat__top">
                  <span className="sh-cat__label">
                    <span className="sh-cat__icon">{CAT_ICON[c.key]}</span>
                    {c.label}
                  </span>
                  <span className="sh-cat__pct">{c.pct}%</span>
                </div>
                <div className="sh-bar">
                  <span
                    className={`sh-bar__fill${c.pct >= 90 ? "" : c.pct >= 70 ? " is-warn" : " is-bad"}`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <div className="sh-cat__sub">{c.passed}/{c.total} checks passed</div>
              </div>
            ))}
          </div>

          {topIssues.length > 0 && (
            <>
              <h3 className="sht-h">Top Issues</h3>
              <div className="a-card sht-card">
                <div className="sh-issues">
                  {topIssues.slice(0, 12).map((it) => (
                    <div className="sh-issue" key={it.label}>
                      {sevIcon(it.severity)}
                      <div className="sh-issue__body">
                        <div className="sh-issue__title">{it.label}</div>
                        <div className="sh-issue__cat">{it.category}</div>
                      </div>
                      <div className="sh-issue__count">
                        {it.count}
                        <small>{it.count === 1 ? "page" : "pages"}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {tab === "pages" && (
        <div className="a-card sht-card">
          <div className="sht-search">
            <Search size={15} />
            <input
              className="sht-search__input"
              placeholder="Search pages…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="a-table-wrap">
            <table className="a-table sht-table">
              <thead>
                <tr>
                  <Th k="url" label="Page" />
                  <Th k="score" label="Score" right />
                  <Th k="kb" label="Size" right />
                  <Th k="critical" label="Critical" right />
                  <Th k="warn" label="Warn" right />
                  <Th k="info" label="Info" right />
                  <th className="a-th-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.url}>
                    <td className="sht-page">
                      <span className="sht-page__url" title={p.url}>{p.url}</span>
                      {p.title && <span className="sht-page__title" title={p.title}>{p.title}</span>}
                    </td>
                    <td className="a-th-right">
                      <span className={`sht-score${p.score >= 90 ? " is-good" : p.score >= 70 ? " is-warn" : " is-bad"}`}>
                        {p.score}
                      </span>
                    </td>
                    <td className="a-th-right a-muted">{p.kb}KB</td>
                    <td className={`a-th-right${p.critical ? " sht-n--crit" : " a-muted"}`}>{p.critical}</td>
                    <td className={`a-th-right${p.warn ? " sht-n--warn" : " a-muted"}`}>{p.warn}</td>
                    <td className={`a-th-right${p.info ? " sht-n--info" : " a-muted"}`}>{p.info}</td>
                    <td className="a-th-right">
                      {p.ok ? (
                        <CheckCircle2 size={16} className="sh-sev--passed" />
                      ) : (
                        <XCircle size={16} className="sh-sev--critical" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "global" && (
        <div className="a-card sht-card">
          {globals.length === 0 && (
            <div className="an-nodata">
              Run a fresh scan to see the site-wide checks.
            </div>
          )}
          <div className="sht-global">
            {globals.map((g) => (
              <div className="sht-gcheck" key={g.name}>
                {g.passed ? (
                  <CheckCircle2 size={18} className="sh-sev--passed" />
                ) : (
                  <XCircle size={18} className="sh-sev--critical" />
                )}
                <div className="sht-gcheck__body">
                  <div className="sht-gcheck__name">
                    {g.name}
                    <span className={`sht-badge${g.passed ? " is-pass" : " is-fail"}`}>
                      {g.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                  <div className="sht-gcheck__detail">{g.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
