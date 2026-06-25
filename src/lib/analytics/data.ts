import "server-only";
import { unstable_cache } from "next/cache";
import {
  ga4RunReport,
  gscQuery,
  hasGaConfig,
  hasGscConfig,
  type GaRow,
} from "./google";

export const ANALYTICS_TAG = "analytics";

/** Allowed chart / table windows (days). Stat cards stay fixed at 30d/7d/today. */
export const RANGE_OPTIONS = [7, 30, 90] as const;
export type RangeDays = (typeof RANGE_OPTIONS)[number];

export function normalizeRange(input: unknown): RangeDays {
  const n = Number(input);
  return (RANGE_OPTIONS as readonly number[]).includes(n)
    ? (n as RangeDays)
    : 30;
}

export type Overview = {
  users30: number;
  users7: number;
  usersToday: number;
  newUsers30: number;
  sessions30: number;
  pageViews30: number;
  activeTotal: number;
};

export type DailyPoint = { date: string; users: number };
export type DailyClick = { date: string; clicks: number };
export type PageRow = { path: string; views: number };
export type CountryRow = { country: string; users: number };
export type KeywordRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};
export type SearchPageRow = {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type AnalyticsDashboard = {
  ga: boolean;
  gsc: boolean;
  gaError: string | null;
  gscError: string | null;
  rangeDays: RangeDays;
  overview: Overview | null;
  daily: DailyPoint[];
  dailyClicks: DailyClick[];
  topPages: PageRow[];
  topCountries: CountryRow[];
  keywords: KeywordRow[];
  searchPages: SearchPageRow[];
};

function num(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function metric(rows: GaRow[]): string[] {
  return rows[0]?.metricValues?.map((m) => m.value) ?? [];
}

// GA4 accepts relative dates like "30daysAgo" / "today".
async function rangeTotals(start: string): Promise<number[]> {
  const r = await ga4RunReport({
    metrics: [
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
    ],
    dateRanges: [{ startDate: start, endDate: "today" }],
  });
  return metric(r.rows).map(num);
}

async function loadGa(rangeDays: RangeDays): Promise<{
  overview: Overview | null;
  daily: DailyPoint[];
  topPages: PageRow[];
  topCountries: CountryRow[];
  error: string | null;
}> {
  if (!hasGaConfig())
    return {
      overview: null,
      daily: [],
      topPages: [],
      topCountries: [],
      error: null,
    };
  try {
    const [t30, t7, tToday, dailyRep, pagesRep, countriesRep] =
      await Promise.all([
        rangeTotals("30daysAgo"),
        rangeTotals("7daysAgo"),
        rangeTotals("today"),
        ga4RunReport({
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }],
          dateRanges: [
            { startDate: `${rangeDays - 1}daysAgo`, endDate: "today" },
          ],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
        ga4RunReport({
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          dateRanges: [{ startDate: `${rangeDays}daysAgo`, endDate: "today" }],
          orderBys: [
            { metric: { metricName: "screenPageViews" }, desc: true },
          ],
          limit: 25,
        }),
        ga4RunReport({
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
          dateRanges: [{ startDate: `${rangeDays}daysAgo`, endDate: "today" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 25,
        }),
      ]);

    const overview: Overview = {
      users30: t30[0] ?? 0,
      users7: t7[0] ?? 0,
      usersToday: tToday[0] ?? 0,
      newUsers30: t30[1] ?? 0,
      sessions30: t30[2] ?? 0,
      pageViews30: t30[3] ?? 0,
      activeTotal: t30[0] ?? 0,
    };

    const daily: DailyPoint[] = dailyRep.rows.map((r) => {
      const d = r.dimensionValues?.[0]?.value ?? "";
      const date =
        d.length === 8
          ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
          : d;
      return { date, users: num(r.metricValues?.[0]?.value) };
    });

    const topPages: PageRow[] = pagesRep.rows.map((r) => ({
      path: r.dimensionValues?.[0]?.value ?? "/",
      views: num(r.metricValues?.[0]?.value),
    }));

    const topCountries: CountryRow[] = countriesRep.rows.map((r) => ({
      country: r.dimensionValues?.[0]?.value ?? "—",
      users: num(r.metricValues?.[0]?.value),
    }));

    return { overview, daily, topPages, topCountries, error: null };
  } catch (e) {
    return {
      overview: null,
      daily: [],
      topPages: [],
      topCountries: [],
      error: e instanceof Error ? e.message : "GA4 request failed",
    };
  }
}

function ymd(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function loadGsc(rangeDays: RangeDays): Promise<{
  keywords: KeywordRow[];
  searchPages: SearchPageRow[];
  dailyClicks: DailyClick[];
  error: string | null;
}> {
  if (!hasGscConfig())
    return { keywords: [], searchPages: [], dailyClicks: [], error: null };
  try {
    // Search Console data lags ~2-3 days; end a couple of days back.
    const startDate = ymd(rangeDays);
    const endDate = ymd(2);
    const [kw, pg, daily] = await Promise.all([
      gscQuery({ startDate, endDate, dimensions: ["query"], rowLimit: 25 }),
      gscQuery({ startDate, endDate, dimensions: ["page"], rowLimit: 25 }),
      gscQuery({ startDate, endDate, dimensions: ["date"], rowLimit: 100 }),
    ]);
    return {
      keywords: kw.map((r) => ({
        query: r.keys?.[0] ?? "—",
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      searchPages: pg.map((r) => ({
        page: r.keys?.[0] ?? "—",
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })),
      dailyClicks: daily
        .map((r) => ({ date: r.keys?.[0] ?? "", clicks: r.clicks }))
        .filter((r) => r.date)
        .sort((a, b) => a.date.localeCompare(b.date)),
      error: null,
    };
  } catch (e) {
    return {
      keywords: [],
      searchPages: [],
      dailyClicks: [],
      error: e instanceof Error ? e.message : "Search Console request failed",
    };
  }
}

async function loadDashboard(rangeDays: RangeDays): Promise<AnalyticsDashboard> {
  const [ga, gsc] = await Promise.all([loadGa(rangeDays), loadGsc(rangeDays)]);
  return {
    ga: hasGaConfig(),
    gsc: hasGscConfig(),
    gaError: ga.error,
    gscError: gsc.error,
    rangeDays,
    overview: ga.overview,
    daily: ga.daily,
    dailyClicks: gsc.dailyClicks,
    topPages: ga.topPages,
    topCountries: ga.topCountries,
    keywords: gsc.keywords,
    searchPages: gsc.searchPages,
  };
}

// Cached for 5 minutes per range so the Google APIs are not hit on every page
// load; the "Clear Cache" button busts ANALYTICS_TAG to force a fresh pull.
export async function getAnalyticsDashboard(
  rangeDays: RangeDays = 30,
): Promise<AnalyticsDashboard> {
  return unstable_cache(
    () => loadDashboard(rangeDays),
    ["analytics-dashboard", String(rangeDays)],
    { tags: [ANALYTICS_TAG], revalidate: 300 },
  )();
}
