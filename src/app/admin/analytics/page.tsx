import {
  Users,
  UserPlus,
  MousePointerClick,
  Eye,
  Activity,
  Globe2,
  Search,
  FileText,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { getAnalyticsDashboard } from "@/lib/analytics/data";
import { AnalyticsSetupGuide } from "@/components/admin/AnalyticsSetupGuide";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const nf = new Intl.NumberFormat("en-US");

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="an-stat">
      <div className="an-stat__icon">{icon}</div>
      <div className="an-stat__body">
        <div className="an-stat__value">{value}</div>
        <div className="an-stat__label">{label}</div>
        {hint && <div className="an-stat__hint">{hint}</div>}
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const d = await getAnalyticsDashboard();
  const configured = d.ga || d.gsc;

  const maxDaily = Math.max(1, ...d.daily.map((p) => p.users));

  return (
    <div>
      <div className="a-page-head">
        <div>
          <h1 className="a-page-head__title">Analytics</h1>
          <p className="a-page-head__sub">
            Live traffic from Google Analytics 4 and search performance from
            Google Search Console — last 30 days.
          </p>
        </div>
      </div>

      {!configured && (
        <div className="a-card an-connect">
          <div className="an-connect__icon">
            <BarChart3 size={26} />
          </div>
          <div>
            <h2 className="an-connect__title">Connect your analytics</h2>
            <p className="an-connect__text">
              Add a Google service account and your GA4 property / Search Console
              site to see live visitor numbers, top pages, countries and search
              keywords here. The step-by-step guide below walks through every
              value you need.
            </p>
          </div>
        </div>
      )}

      {(d.gaError || d.gscError) && (
        <div className="an-error">
          <AlertTriangle size={16} />
          <div>
            {d.gaError && <div>Analytics: {d.gaError}</div>}
            {d.gscError && <div>Search Console: {d.gscError}</div>}
            <div className="an-error__hint">
              Double-check the property ID / site URL and that the service
              account has been granted access.
            </div>
          </div>
        </div>
      )}

      {d.ga && d.overview && (
        <>
          <div className="an-stats">
            <StatCard
              icon={<Users size={18} />}
              label="Users · 30 days"
              value={nf.format(d.overview.users30)}
            />
            <StatCard
              icon={<Users size={18} />}
              label="Users · 7 days"
              value={nf.format(d.overview.users7)}
            />
            <StatCard
              icon={<Activity size={18} />}
              label="Users · Today"
              value={nf.format(d.overview.usersToday)}
            />
            <StatCard
              icon={<UserPlus size={18} />}
              label="New users · 30 days"
              value={nf.format(d.overview.newUsers30)}
            />
            <StatCard
              icon={<MousePointerClick size={18} />}
              label="Sessions · 30 days"
              value={nf.format(d.overview.sessions30)}
            />
            <StatCard
              icon={<Eye size={18} />}
              label="Page views · 30 days"
              value={nf.format(d.overview.pageViews30)}
            />
            <StatCard
              icon={<Activity size={18} />}
              label="Active users · total"
              value={nf.format(d.overview.activeTotal)}
            />
          </div>

          <div className="a-card an-chart">
            <div className="a-card__head">
              <h2 className="a-card__title">Daily active users</h2>
              <span className="a-muted">Last 30 days</span>
            </div>
            {d.daily.length ? (
              <div className="an-bars">
                {d.daily.map((p) => (
                  <div className="an-bar" key={p.date} title={`${p.date}: ${nf.format(p.users)} users`}>
                    <div
                      className="an-bar__fill"
                      style={{ height: `${(p.users / maxDaily) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="a-muted">No data for this period yet.</div>
            )}
          </div>
        </>
      )}

      <div className="an-cols">
        {d.ga && (
          <>
            <TableCard
              title="Top pages"
              icon={<FileText size={16} />}
              note="Last 30 days"
              head={["Page", "Views"]}
              rows={d.topPages.map((p) => [p.path, nf.format(p.views)])}
              emptyKey="page"
            />
            <TableCard
              title="Top countries"
              icon={<Globe2 size={16} />}
              note="Last 30 days"
              head={["Country", "Users"]}
              rows={d.topCountries.map((c) => [c.country, nf.format(c.users)])}
              emptyKey="country"
            />
          </>
        )}

        {d.gsc && (
          <>
            <TableCard
              title="Top search keywords"
              icon={<Search size={16} />}
              note="Search Console · 30 days"
              head={["Query", "Clicks", "Impr.", "CTR", "Pos."]}
              rows={d.keywords.map((k) => [
                k.query,
                nf.format(k.clicks),
                nf.format(k.impressions),
                `${(k.ctr * 100).toFixed(1)}%`,
                k.position.toFixed(1),
              ])}
              emptyKey="keyword"
            />
            <TableCard
              title="Top search pages"
              icon={<FileText size={16} />}
              note="Search Console · 30 days"
              head={["Page", "Clicks", "Impr.", "CTR", "Pos."]}
              rows={d.searchPages.map((p) => [
                p.page,
                nf.format(p.clicks),
                nf.format(p.impressions),
                `${(p.ctr * 100).toFixed(1)}%`,
                p.position.toFixed(1),
              ])}
              emptyKey="page"
            />
          </>
        )}
      </div>

      <AnalyticsSetupGuide />
    </div>
  );
}

function TableCard({
  title,
  icon,
  note,
  head,
  rows,
  emptyKey,
}: {
  title: string;
  icon: React.ReactNode;
  note: string;
  head: string[];
  rows: string[][];
  emptyKey: string;
}) {
  return (
    <div className="a-card an-table-card">
      <div className="a-card__head">
        <h2 className="a-card__title an-table-card__title">
          {icon} {title}
        </h2>
        <span className="a-muted">{note}</span>
      </div>
      {rows.length ? (
        <div className="a-table-wrap">
          <table className="a-table an-table">
            <thead>
              <tr>
                {head.map((h, i) => (
                  <th key={h} className={i === 0 ? "" : "a-th-right"}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((cell, ci) => (
                    <td
                      key={ci}
                      className={
                        ci === 0 ? "an-cell-key" : "a-th-right an-cell-num"
                      }
                    >
                      {ci === 0 ? <span title={cell}>{cell}</span> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="a-muted an-empty-row">No {emptyKey} data yet.</div>
      )}
    </div>
  );
}
