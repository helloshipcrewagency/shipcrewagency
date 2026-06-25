import "server-only";
import { siteUrl } from "@/lib/seo";

// ---------------------------------------------------------------------------
// Self-audit SEO health check. Crawls the site's own pages (from sitemap.xml),
// parses each one and runs technical-SEO checks. No external API — it only
// reads the site's own rendered HTML.
// ---------------------------------------------------------------------------

export type Severity = "critical" | "warning" | "info";

export type PageIssue = { category: string; label: string; severity: Severity };

export type PageResult = {
  url: string;
  ok: boolean;
  score: number;
  passed: number;
  total: number;
  issues: PageIssue[];
};

export type CategoryStat = {
  key: string;
  label: string;
  passed: number;
  total: number;
  pct: number;
};

export type TopIssue = {
  label: string;
  category: string;
  severity: Severity;
  count: number;
};

export type SeoAudit = {
  scannedAt: string;
  pagesScanned: number;
  score: number;
  counts: { critical: number; warning: number; info: number; passed: number };
  categories: CategoryStat[];
  topIssues: TopIssue[];
  pages: PageResult[];
};

const CATEGORIES: { key: string; label: string }[] = [
  { key: "meta", label: "Meta Tags" },
  { key: "og", label: "Open Graph" },
  { key: "twitter", label: "Twitter Cards" },
  { key: "headings", label: "Headings" },
  { key: "images", label: "Images" },
  { key: "structured", label: "Structured Data" },
  { key: "technical", label: "Technical" },
  { key: "performance", label: "Performance" },
  { key: "links", label: "Internal Links" },
];

type Check = {
  category: string;
  label: string;
  pass: boolean;
  severity: Severity;
};

function parseMetas(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<meta\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const name = /\b(?:name|property)=["']([^"']+)["']/i.exec(tag)?.[1];
    const content = /\bcontent=["']([^"']*)["']/i.exec(tag)?.[1] ?? "";
    if (name) map.set(name.toLowerCase(), content);
  }
  return map;
}

function titleText(html: string): string {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
}

function runChecks(html: string, path: string): Check[] {
  const meta = parseMetas(html);
  const checks: Check[] = [];
  const add = (
    category: string,
    label: string,
    pass: boolean,
    severity: Severity,
  ) => checks.push({ category, label, pass, severity });

  // Meta
  const title = titleText(html);
  add("meta", "Missing <title>", title.length > 0, "critical");
  add("meta", "Title is too long (over 60 chars)", title.length === 0 || title.length <= 60, "warning");
  add("meta", "Title is too short (under 30 chars)", title.length === 0 || title.length >= 30, "warning");
  const desc = meta.get("description") ?? "";
  add("meta", "Missing meta description", desc.length > 0, "warning");
  add("meta", "Meta description too long (over 160)", desc.length === 0 || desc.length <= 160, "warning");
  add("meta", "Missing canonical link", /<link[^>]+rel=["']canonical["']/i.test(html), "info");

  // Open Graph
  add("og", "Missing og:title", meta.has("og:title"), "warning");
  add("og", "Missing og:description", meta.has("og:description"), "warning");
  add("og", "Missing og:image", meta.has("og:image"), "warning");
  add("og", "Missing og:type", meta.has("og:type"), "info");

  // Twitter
  add("twitter", "Missing twitter:card", meta.has("twitter:card"), "warning");
  add("twitter", "Missing twitter:title", meta.has("twitter:title"), "info");
  add("twitter", "Missing twitter:image", meta.has("twitter:image"), "info");

  // Headings
  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const h1Count = headings.filter((n) => n === 1).length;
  add("headings", "Page has no H1 tag", h1Count >= 1, "warning");
  add("headings", "Page has more than one H1", h1Count <= 1, "warning");
  let skips = false;
  for (let i = 1; i < headings.length; i++)
    if (headings[i] - headings[i - 1] > 1) skips = true;
  add("headings", "Heading hierarchy skips a level", !skips, "warning");

  // Images
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const missingAlt = imgs.filter((t) => !/\balt=["'][^"']+["']/i.test(t));
  add("images", "Image is missing alt text", missingAlt.length === 0, "warning");

  // Structured data
  add("structured", "No structured data (JSON-LD)", /<script[^>]+type=["']application\/ld\+json["']/i.test(html), "info");

  // Technical
  add("technical", "Missing viewport meta", meta.has("viewport"), "warning");
  add("technical", "Missing <html lang>", /<html[^>]+lang=/i.test(html), "warning");
  add("technical", "Missing charset", /<meta[^>]+charset/i.test(html), "info");

  // Performance
  const kb = Math.round(html.length / 1024);
  add("performance", `HTML is large (${kb}KB, recommended < 500KB)`, kb < 500, "info");

  // Internal links
  const internal = [...html.matchAll(/<a\b[^>]*href=["'](\/[^"'#][^"']*)["']/gi)].length;
  add("links", "Page has no internal links", internal > 0 || path === "/", "info");

  return checks;
}

async function fetchUrls(): Promise<string[]> {
  const base = siteUrl();
  try {
    const res = await fetch(`${base}/sitemap.xml`, { cache: "no-store" });
    if (res.ok) {
      const xml = await res.text();
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
      if (urls.length) return urls;
    }
  } catch {
    /* fall through */
  }
  return ["", "about", "services", "crew", "blog", "contact", "faq"].map((p) =>
    p ? `${base}/${p}` : base,
  );
}

type Audited = { page: PageResult; checks: Check[] };

async function auditOne(url: string): Promise<Audited | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const html = await res.text();
    const path = new URL(url).pathname || "/";
    const checks = runChecks(html, path);
    const passed = checks.filter((c) => c.pass).length;
    const issues: PageIssue[] = checks
      .filter((c) => !c.pass)
      .map((c) => ({ category: c.category, label: c.label, severity: c.severity }));
    return {
      checks,
      page: {
        url: path,
        ok: !issues.some((i) => i.severity === "critical"),
        score: Math.round((passed / checks.length) * 100),
        passed,
        total: checks.length,
        issues,
      },
    };
  } catch {
    return null;
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

export async function runSeoAudit(maxPages = 80): Promise<SeoAudit> {
  const urls = (await fetchUrls()).slice(0, maxPages);
  const audited = (await mapLimit(urls, 6, auditOne)).filter(
    (a): a is Audited => a !== null,
  );

  const catTotals = new Map<string, { passed: number; total: number }>();
  for (const c of CATEGORIES) catTotals.set(c.key, { passed: 0, total: 0 });
  const issueCounts = new Map<string, TopIssue>();
  let critical = 0;
  let warning = 0;
  let info = 0;
  let totalChecks = 0;
  let totalPassed = 0;

  for (const { checks } of audited) {
    for (const c of checks) {
      totalChecks++;
      const t = catTotals.get(c.category);
      if (t) {
        t.total++;
        if (c.pass) t.passed++;
      }
      if (c.pass) {
        totalPassed++;
      } else {
        if (c.severity === "critical") critical++;
        else if (c.severity === "warning") warning++;
        else info++;
        const ex = issueCounts.get(c.label);
        if (ex) ex.count++;
        else
          issueCounts.set(c.label, {
            label: c.label,
            category: c.category,
            severity: c.severity,
            count: 1,
          });
      }
    }
  }

  const categories: CategoryStat[] = CATEGORIES.map((c) => {
    const t = catTotals.get(c.key) ?? { passed: 0, total: 0 };
    return {
      key: c.key,
      label: c.label,
      passed: t.passed,
      total: t.total,
      pct: t.total ? Math.round((t.passed / t.total) * 100) : 100,
    };
  });

  const pages = audited.map((a) => a.page).sort((a, b) => a.score - b.score);

  return {
    scannedAt: new Date().toISOString(),
    pagesScanned: pages.length,
    score: totalChecks ? Math.round((totalPassed / totalChecks) * 100) : 100,
    counts: {
      critical,
      warning,
      info,
      passed: pages.filter((p) => p.ok).length,
    },
    categories,
    topIssues: [...issueCounts.values()].sort((a, b) => b.count - a.count),
    pages,
  };
}
