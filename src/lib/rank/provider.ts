import "server-only";
import { siteUrl } from "@/lib/seo";

// Rank checking is done through a third-party SERP API. We support SerpApi out
// of the box: set SERPAPI_KEY and rank checks start working. Without a key the
// page still works — positions just stay empty until a key is added.
export function hasRankProvider(): boolean {
  return Boolean(process.env.SERPAPI_KEY);
}

function rootHost(host: string): string {
  return host.replace(/^www\./, "").toLowerCase();
}

export async function checkRank(
  keyword: string,
): Promise<{ position: number | null; url: string | null }> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return { position: null, url: null };

  const ourHost = rootHost(new URL(siteUrl()).host);
  const params = new URLSearchParams({
    engine: "google",
    q: keyword,
    num: "100",
    hl: "en",
    gl: "us",
    api_key: apiKey,
  });

  try {
    const res = await fetch(`https://serpapi.com/search.json?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return { position: null, url: null };
    const data = (await res.json()) as {
      organic_results?: { position?: number; link?: string }[];
    };
    for (const r of data.organic_results ?? []) {
      if (!r.link) continue;
      try {
        if (rootHost(new URL(r.link).host) === ourHost) {
          return { position: r.position ?? null, url: r.link };
        }
      } catch {
        /* skip malformed link */
      }
    }
    return { position: null, url: null };
  } catch {
    return { position: null, url: null };
  }
}
