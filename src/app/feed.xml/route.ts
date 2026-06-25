import { getPublishedPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";
import { stripHtml } from "@/lib/utils";

export const runtime = "nodejs";
export const revalidate = 3600;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// RSS feed of the latest blog posts. Helps search engines (and readers) discover
// new content automatically; linked from <head> for auto-discovery.
export async function GET() {
  const base = siteUrl();
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = (await getPublishedPosts("en")).slice(0, 30);
  } catch {
    posts = [];
  }

  const items = posts
    .map((p) => {
      const url = `${base}/blog/${p.slug}`;
      const dateStr = p.published_at || p.created_at || "";
      let pubDate = "";
      try {
        pubDate = dateStr ? new Date(dateStr).toUTCString() : "";
      } catch {
        pubDate = "";
      }
      const desc = stripHtml(p.excerpt || "").slice(0, 400);
      return [
        "<item>",
        `<title>${esc(p.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        pubDate ? `<pubDate>${pubDate}</pubDate>` : "",
        `<description>${esc(desc)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Ship Crew Agency — Maritime Knowledge Hub</title>
<link>${base}/blog</link>
<atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
<description>Guides, compliance resources and maritime workforce insights from Ship Crew Agency.</description>
<language>en</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
