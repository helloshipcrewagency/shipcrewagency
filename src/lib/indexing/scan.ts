import "server-only";
import crypto from "node:crypto";
import { siteUrl } from "@/lib/seo";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase/server";
import { gscInspectUrl, hasGscConfig } from "@/lib/analytics/google";

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

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    }),
  );
  return out;
}

export async function runIndexScan(maxPages = 120): Promise<IndexReport> {
  const urls = (await sitemapUrls()).slice(0, maxPages);
  const gsc = hasGscConfig();
  let pages: IndexPage[];

  if (gsc) {
    pages = await mapLimit(urls, 4, async (u) => {
      const r = await gscInspectUrl(u);
      const path = (() => {
        try {
          return new URL(u).pathname || "/";
        } catch {
          return u;
        }
      })();
      return {
        url: path,
        state: r?.coverageState ?? "Unknown",
        indexed: r?.verdict === "PASS",
      };
    });
  } else {
    pages = urls.map((u) => {
      const path = (() => {
        try {
          return new URL(u).pathname || "/";
        } catch {
          return u;
        }
      })();
      return { url: path, state: "Unknown", indexed: false };
    });
  }

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
