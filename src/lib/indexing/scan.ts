import "server-only";
import crypto from "node:crypto";
import { siteUrl } from "@/lib/seo";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase/server";
import { gscQuery, hasGscConfig } from "@/lib/analytics/google";

export type IndexPage = { url: string; state: string; indexed: boolean };
export type IndexReport = {
  scannedAt: string;
  gsc: boolean;
  total: number;
  indexed: number;
  notIndexed: number;
  indexRate: number;
  coverage: { state: string; count: number }[];
  pages: IndexPage[];
};

async function sitemapUrls(): Promise<string[]> {
  const base = siteUrl();
  try {
    const res = await fetch(`${base}/sitemap.xml`, { cache: "no-store" });
    if (res.ok) {
      const xml = await res.text();
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) =>
        m[1].trim(),
      );
      if (urls.length) return urls;
    }
  } catch {
    /* ignore */
  }
  return [base];
}

function pathOf(u: string): string {
  try {
    return new URL(u).pathname || "/";
  } catch {
    return u;
  }
}

function ymd(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// Index status is derived from Search Console's Search Analytics (one fast
// request — the same API the Analytics dashboard uses). A page that has shown
// up in Google search results over the last 90 days is indexed. This avoids the
// slow, owner-only URL Inspection API (one request per page) that timed out.
export async function runIndexScan(maxPages = 200): Promise<IndexReport> {
  const urls = (await sitemapUrls()).slice(0, maxPages);
  const gsc = hasGscConfig();

  const seen = new Set<string>();
  if (gsc) {
    try {
      const rows = await gscQuery({
        startDate: ymd(90),
        endDate: ymd(1),
        dimensions: ["page"],
        rowLimit: 25000,
      });
      for (const r of rows) {
        const p = r.keys?.[0];
        if (p) seen.add(pathOf(p));
      }
    } catch {
      /* leave seen empty — pages fall back to "unknown" */
    }
  }

  const hasData = seen.size > 0;
  const pages: IndexPage[] = urls.map((u) => {
    const path = pathOf(u);
    const indexed = seen.has(path);
    const state = !gsc
      ? "Unknown — connect Search Console"
      : indexed
        ? "Indexed (appears in search)"
        : hasData
          ? "Not appearing in search yet"
          : "Unknown — no Search Console data";
    return { url: path, state, indexed };
  });

  const indexed = pages.filter((p) => p.indexed).length;
  const total = pages.length;
  const coverageMap = new Map<string, number>();
  for (const p of pages)
    coverageMap.set(p.state, (coverageMap.get(p.state) ?? 0) + 1);

  return {
    scannedAt: new Date().toISOString(),
    gsc,
    total,
    indexed,
    notIndexed: total - indexed,
    indexRate: total ? Math.round((indexed / total) * 100) : 0,
    coverage: [...coverageMap.entries()]
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count),
    pages,
  };
}

// ---- persistence (site_settings) -------------------------------------------
const REPORT_KEY = "index_report";
const KEY_KEY = "indexnow_key";

export async function readIndexReport(): Promise<IndexReport | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const { data } = await getSupabaseAdmin()
      .from("site_settings")
      .select("value")
      .eq("key", REPORT_KEY)
      .maybeSingle();
    const v = (data as { value?: unknown } | null)?.value;
    return typeof v === "string" ? (JSON.parse(v) as IndexReport) : null;
  } catch {
    return null;
  }
}

export async function writeIndexReport(report: IndexReport): Promise<void> {
  await getSupabaseAdmin()
    .from("site_settings")
    .upsert(
      {
        key: REPORT_KEY,
        value: JSON.stringify(report),
        type: "json",
        group_name: "seo",
        label: "Index report",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
}

// ---- IndexNow --------------------------------------------------------------
export async function getIndexNowKey(): Promise<string | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const { data } = await getSupabaseAdmin()
      .from("site_settings")
      .select("value")
      .eq("key", KEY_KEY)
      .maybeSingle();
    const v = (data as { value?: unknown } | null)?.value;
    return typeof v === "string" && v ? v : null;
  } catch {
    return null;
  }
}

async function getOrCreateIndexNowKey(): Promise<string> {
  const existing = await getIndexNowKey();
  if (existing) return existing;
  const key = crypto.randomUUID().replace(/-/g, "");
  await getSupabaseAdmin()
    .from("site_settings")
    .upsert(
      {
        key: KEY_KEY,
        value: key,
        type: "string",
        group_name: "seo",
        label: "IndexNow key",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
  return key;
}

export async function submitIndexNow(
  urls: string[],
): Promise<{ ok: boolean; status: number; submitted: number }> {
  if (!urls.length) return { ok: false, status: 0, submitted: 0 };
  const base = siteUrl();
  const host = new URL(base).host;
  const key = await getOrCreateIndexNowKey();
  const keyLocation = `${base}/api/indexnow/key`;
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList: urls.slice(0, 10000) }),
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status, submitted: urls.length };
}

/** Absolute URLs of pages not indexed (for IndexNow submission). */
export function notIndexedUrls(report: IndexReport): string[] {
  const base = siteUrl();
  return report.pages
    .filter((p) => !p.indexed)
    .map((p) => `${base}${p.url}`);
}
