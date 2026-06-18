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
  CheckCircle2,
  CircleSlash,
} from "lucide-react";
import {
  getAnalyticsDashboard,
  normalizeRange,
  type Overview,
} from "@/lib/analytics/data";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { AnalyticsHeaderActions } from "@/components/admin/AnalyticsHeaderActions";
import { AnalyticsSetupGuide } from "@/components/admin/AnalyticsSetupGuide";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const nf = new Intl.NumberFormat("en-US");
const ZERO: Overview = {
  users30: 0,
  users7: 0,
  usersToday: 0,
  newUsers30: 0,
  sessions30: 0,
  pageViews30: 0,
  activeTotal: 0,
};

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="an-stat">
      <div className="an-stat__top">
        <span className="an-stat__label">{label}</span>
        <span className="an-stat__icon">{icon}</span>
      </div>
      <div className="an-stat__value">{value}</div>
    </div>
  );
}

type ListItem = { key: string; value: string; sub?: string; mag: number };

function ListCard({
  title,
  icon,
  note,
  items,
  accent,
  emptyLabel,
}: {
  title: string;
  icon: React.ReactNode;
  note: string;
  items: ListItem[];
  accent: "teal" | "gold";
  emptyLabel: string;
}) {
  return (
    <div className="a-card an-list-card">
      <div className="an-list-card__head">
        <h2 className="an-list-card__title">
          {icon}
          {title}
        </h2>
        <span className="an-list-card__note">{note}</span>
      </div>
      {items.length ? (
        <ol className="an-list">
          {items.map((it, i) => (
            <li className="an-list__row" key={`${it.key}-${i}`}>
              <span className="an-list__rank">#{i + 1}</span>
              <span className="an-list__key">
                <span className="an-list__key-main" title={it.key}>
                  {it.key}
                </span>
                {it.sub && <span className="an-list__key-sub">{it.sub}</span>}
              </span>
              <span className="an-list__val">{it.value}</span>
              <span
                className={`an-list__bar an-list__bar--${accent}`}
                style={{ transform: `scaleY(${(0.35 + 0.65 * it.mag).toFixed(3)})` }}
              />
            </li>
          ))}
        </ol>
      ) : (
        <div className="an-nodata">{emptyLabel}</div>
      )}
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range = normalizeRange(rangeParam);
  const d = await getAnalyticsDashboard(range);
  const configured = d.ga || d.gsc;
  const ov = d.overview ?? ZERO;

  const maxViews = Math.max(1, ...d.topPages.map((p) => p.views));
  const maxCountry = Math.max(1, ...d.topCountries.map((c) => c.users));
  const maxKwClicks = Math.max(1, ...d.keywords.map((k) => k.clicks));
  const maxSpClicks = Math.max(1, ...d.searchPages.map((p) => p.clicks));

  return (
    <div>
      <div className="an-head">
        <div>
          <h1 className="a-page-head__title">Analytics</h1>
          <p className="a-page-head__sub">
            Live data from Google Analytics &amp; Search Console
          </p>
        </div>
        <div className="an-head__right">
          <AnalyticsHeaderActions range={range} />
          <span className={`an-status${d.ga ? " is-on" : ""}`}>
            {d.ga ? <CheckCircle2 size={15} /> : <CircleSlash size={15} />}
            GA4 {d.ga ? "Connected" : "Not connected"}
          </span>
          <span className={`an-status${d.gsc ? " is-on" : ""}`}>
            {d.gsc ? <CheckCircle2 size={15} /> : <CircleSlash size={15} />}
            Search Console
          </span>
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

      {d.ga && (
        <>
          <div className="an-stats">
            <StatCard icon={<Users size={18} />} label="Users (30d)" value={nf.format(ov.users30)} />
            <StatCard icon={<Users size={18} />} label="Users (7d)" value={nf.format(ov.users7)} />
            <StatCard icon={<Activity size={18} />} label="Today" value={nf.format(ov.usersToday)} />
            <StatCard icon={<UserPlus size={18} />} label="New Users (30d)" value={nf.format(ov.newUsers30)} />
            <StatCard icon={<MousePointerClick size={18} />} label="Sessions (30d)" value={nf.format(ov.sessions30)} />
            <StatCard icon={<Eye size={18} />} label="Page Views (30d)" value={nf.format(ov.pageViews30)} />
            <StatCard icon={<Activity size={18} />} label="Total Active Users" value={nf.format(ov.activeTotal)} />
          </div>

          <AnalyticsChart
            daily={d.daily}
            dailyClicks={d.dailyClicks}
            rangeDays={d.rangeDays}
          />
        </>
      )}

      <div className="an-cols">
        {d.ga && (
          <>
            <ListCard
              title="Top 25 Pages"
              icon={<FileText size={16} />}
              note={`by page views · ${range}d`}
              accent="teal"
              emptyLabel="No page data yet."
              items={d.topPages.map((p) => ({
                key: p.path,
                value: nf.format(p.views),
                mag: p.views / maxViews,
              }))}
            />
            <ListCard
              title="Top 25 Countries"
              icon={<Globe2 size={16} />}
              note={`by active users · ${range}d`}
              accent="teal"
              emptyLabel="No country data yet."
              items={d.topCountries.map((c) => ({
                key: c.country,
                value: nf.format(c.users),
                mag: c.users / maxCountry,
              }))}
            />
          </>
        )}

        {d.gsc && (
          <>
            <ListCard
              title="Top 25 Search Keywords"
              icon={<Search size={16} />}
              note={`Search Console · ${range}d`}
              accent="gold"
              emptyLabel="No keyword data yet."
              items={d.keywords.map((k) => ({
                key: k.query,
                value: nf.format(k.clicks),
                sub: `${nf.format(k.impressions)} impr · ${(k.ctr * 100).toFixed(1)}% CTR · pos ${k.position.toFixed(1)}`,
                mag: k.clicks / maxKwClicks,
              }))}
            />
            <ListCard
              title="Top 25 Search Pages"
              icon={<FileText size={16} />}
              note={`Search Console · ${range}d`}
              accent="gold"
              emptyLabel="No search page data yet."
              items={d.searchPages.map((p) => ({
                key: p.page,
                value: nf.format(p.clicks),
                sub: `${nf.format(p.impressions)} impr · ${(p.ctr * 100).toFixed(1)}% CTR · pos ${p.position.toFixed(1)}`,
                mag: p.clicks / maxSpClicks,
              }))}
            />
          </>
        )}
      </div>

      <AnalyticsSetupGuide />
    </div>
  );
}
