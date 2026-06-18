import "server-only";
import {
  ga4RunReport,
  gscQuery,
  hasGaConfig,
  hasGscConfig,
  type GaRow,
} from "./google";

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
  overview: Overview | null;
  daily: DailyPoint[];
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

async function loadGa(): Promise<{
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
          dateRanges: [{ startDate: "29daysAgo", endDate: "today" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
        ga4RunReport({
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          orderBys: [
            { metric: { metricName: "screenPageViews" }, desc: true },
          ],
          limit: 25,
        }),
        ga4RunReport({
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
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

async function loadGsc(): Promise<{
  keywords: KeywordRow[];
  searchPages: SearchPageRow[];
  error: string | null;
}> {
  if (!hasGscConfig())
    return { keywords: [], searchPages: [], error: null };
  try {
    // Search Console data lags ~2-3 days; end a couple of days back.
    const startDate = ymd(30);
    const endDate = ymd(2);
    const [kw, pg] = await Promise.all([
      gscQuery({ startDate, endDate, dimensions: ["query"], rowLimit: 25 }),
      gscQuery({ startDate, endDate, dimensions: ["page"], rowLimit: 25 }),
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
      error: null,
    };
  } catch (e) {
    return {
      keywords: [],
      searchPages: [],
      error: e instanceof Error ? e.message : "Search Console request failed",
    };
  }
}

export async function getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
  const [ga, gsc] = await Promise.all([loadGa(), loadGsc()]);
  return {
    ga: hasGaConfig(),
    gsc: hasGscConfig(),
    gaError: ga.error,
    gscError: gsc.error,
    overview: ga.overview,
    daily: ga.daily,
    topPages: ga.topPages,
    topCountries: ga.topCountries,
    keywords: gsc.keywords,
    searchPages: gsc.searchPages,
  };
}
