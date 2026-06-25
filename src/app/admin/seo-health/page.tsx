import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { readSeoAudit } from "@/lib/seo-audit/store";
import type { Severity } from "@/lib/seo-audit/audit";
import { SeoRescanButton } from "@/components/admin/SeoRescanButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Needs work";
  return "Poor";
}

function sevIcon(s: Severity) {
  if (s === "critical") return <XCircle size={16} className="sh-sev sh-sev--critical" />;
  if (s === "warning") return <AlertTriangle size={16} className="sh-sev sh-sev--warning" />;
  return <Info size={16} className="sh-sev sh-sev--info" />;
}

export default async function SeoHealthPage() {
  const audit = await readSeoAudit();

  return (
    <div>
      <div className="a-page-head">
        <div>
          <h1 className="a-page-head__title">
            <ShieldCheck size={20} style={{ verticalAlign: "-3px", marginRight: 8, color: "var(--a-navy-800)" }} />
            SEO Health
          </h1>
          <p className="a-page-head__sub">
            Technical SEO audit across all your pages.
          </p>
        </div>
        <div className="a-page-head__actions">
          <SeoRescanButton hasData={Boolean(audit)} />
        </div>
      </div>

      {!audit ? (
        <div className="a-card an-connect">
          <div className="an-connect__icon">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2 className="an-connect__title">Run your first SEO scan</h2>
            <p className="an-connect__text">
              Click <strong>Run scan</strong> to crawl every page on your site and
              check titles, meta descriptions, headings, image alt text, Open
              Graph, structured data and more. The result is saved here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Score summary */}
          <div className="a-card sh-summary">
            <div className="sh-ring" data-score={audit.score}>
              <svg viewBox="0 0 120 120" className="sh-ring__svg">
                <circle className="sh-ring__bg" cx="60" cy="60" r="52" />
                <circle
                  className="sh-ring__fg"
                  cx="60"
                  cy="60"
                  r="52"
                  strokeDasharray={`${(audit.score / 100) * 326.7} 326.7`}
                />
              </svg>
              <div className="sh-ring__num">
                <span>{audit.score}</span>
                <small>/ 100</small>
              </div>
            </div>
            <div className="sh-summary__body">
              <h2 className="sh-summary__title">{scoreLabel(audit.score)}</h2>
              <p className="sh-summary__sub">
                {audit.pagesScanned} pages scanned · {audit.topIssues.reduce((s, i) => s + i.count, 0)} issues found
              </p>
              <div className="sh-pills">
                <span className="sh-pill sh-pill--critical">{audit.counts.critical} Critical</span>
                <span className="sh-pill sh-pill--warning">{audit.counts.warning} Warnings</span>
                <span className="sh-pill sh-pill--info">{audit.counts.info} Info</span>
                <span className="sh-pill sh-pill--passed">{audit.counts.passed} Pages passed</span>
              </div>
              <div className="sh-scanned">
                Last scanned:{" "}
                {new Date(audit.scannedAt).toLocaleString("en-US")}
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="sh-stats">
            <StatCard icon={<XCircle size={18} />} tone="critical" label="Critical" value={audit.counts.critical} />
            <StatCard icon={<AlertTriangle size={18} />} tone="warning" label="Warnings" value={audit.counts.warning} />
            <StatCard icon={<Info size={18} />} tone="info" label="Info" value={audit.counts.info} />
            <StatCard icon={<CheckCircle2 size={18} />} tone="passed" label="Pages Passed" value={audit.counts.passed} />
          </div>

          {/* Category breakdown */}
          <div className="a-card" style={{ marginBottom: 20 }}>
            <div className="a-card__head">
              <h2 className="a-card__title">Category breakdown</h2>
            </div>
            <div className="sh-cats">
              {audit.categories.map((c) => (
                <div className="sh-cat" key={c.key}>
                  <div className="sh-cat__top">
                    <span className="sh-cat__label">{c.label}</span>
                    <span className="sh-cat__pct">{c.pct}%</span>
                  </div>
                  <div className="sh-bar">
                    <span
                      className={`sh-bar__fill${c.pct >= 90 ? "" : c.pct >= 70 ? " is-warn" : " is-bad"}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <div className="sh-cat__sub">
                    {c.passed}/{c.total} checks passed
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top issues */}
          {audit.topIssues.length > 0 && (
            <div className="a-card" style={{ marginBottom: 20 }}>
              <div className="a-card__head">
                <h2 className="a-card__title">Top issues</h2>
              </div>
              <div className="sh-issues">
                {audit.topIssues.slice(0, 12).map((it) => (
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
          )}

          {/* Per-page list (worst first) */}
          <div className="a-card">
            <div className="a-card__head">
              <h2 className="a-card__title">Pages ({audit.pages.length})</h2>
              <span className="a-muted">Lowest-scoring first</span>
            </div>
            <div className="sh-pages">
              {audit.pages.map((p) => (
                <div className="sh-page" key={p.url}>
                  <span className={`sh-page__score${p.score >= 90 ? " is-good" : p.score >= 70 ? " is-warn" : " is-bad"}`}>
                    {p.score}
                  </span>
                  <span className="sh-page__url" title={p.url}>{p.url}</span>
                  <span className="sh-page__issues">
                    {p.issues.length === 0
                      ? "No issues"
                      : `${p.issues.length} issue${p.issues.length === 1 ? "" : "s"}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: number;
}) {
  return (
    <div className={`sh-stat sh-stat--${tone}`}>
      <span className="sh-stat__icon">{icon}</span>
      <div>
        <div className="sh-stat__value">{value}</div>
        <div className="sh-stat__label">{label}</div>
      </div>
    </div>
  );
}
