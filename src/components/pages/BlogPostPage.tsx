import Image from "next/image";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { Button } from "@/components/ui/Button";
import { IMG, BLOG_IMAGES } from "@/lib/media";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { PageHero } from "@/components/ui/PageHero";
import { Icon } from "@/components/icons";
import { getDict, href, type Lang } from "@/i18n";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { formatDate, stripHtml } from "@/lib/utils";
import { siteUrl } from "@/lib/seo";
import { ShareBar } from "@/components/blog/ShareBar";

function sanitizeBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "ul", "ol", "li",
      "strong", "em", "b", "i", "u", "s", "del", "sup", "sub", "mark", "small",
      "a", "blockquote", "br", "hr",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
      "img", "figure", "figcaption",
      "div", "span", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel", "class"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      "*": ["class", "id"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Open external links safely in a new tab.
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.href && /^https?:\/\//i.test(attribs.href)) {
          attribs.target = attribs.target || "_blank";
          attribs.rel = "noopener noreferrer";
        }
        return { tagName, attribs };
      },
    },
    disallowedTagsMode: "discard",
  });
}

// Slugify heading text into an anchor id.
function headingId(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "section"
  );
}

// Some posts (often pasted or AI-generated) wrap whole paragraphs in heading
// tags, which makes them render huge and pollutes the table of contents. Any
// h2–h4 whose text is clearly a sentence (long) is turned back into a paragraph.
function normalizeHeadings(html: string): string {
  return html.replace(
    /<(h[2-4])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (match, _tag: string, _attrs: string | undefined, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      return text.length > 90 ? `<p>${inner}</p>` : match;
    },
  );
}

// Inject ids onto h2/h3 and collect a table-of-contents list.
function buildToc(html: string): {
  html: string;
  toc: { id: string; text: string; level: number }[];
} {
  const toc: { id: string; text: string; level: number }[] = [];
  const used = new Set<string>();
  const out = html.replace(
    /<(h2|h3)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string | undefined, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text || text.length > 90) return match;
      const base = headingId(text);
      let id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      toc.push({ id, text, level: tag.toLowerCase() === "h3" ? 3 : 2 });
      const attrStr = attrs ?? "";
      const newAttrs = /\sid\s*=/i.test(attrStr)
        ? attrStr
        : `${attrStr} id="${id}"`;
      return `<${tag}${newAttrs}>${inner}</${tag}>`;
    },
  );
  return { html: out, toc };
}

export async function BlogPostPage({
  lang,
  slug,
}: {
  lang: Lang;
  slug: string;
}) {
  const post = await getPostBySlug(lang, slug);
  if (!post) notFound();

  const t = getDict(lang);
  const related = await getRelatedPosts(lang, slug, 4);
  const { html: body, toc } = buildToc(
    normalizeHeadings(sanitizeBody(post.content)),
  );
  const dateLabel = formatDate(post.published_at || post.created_at, lang);
  const shareUrl = siteUrl() + href(lang, `blog/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || stripHtml(post.excerpt),
    datePublished: post.published_at || post.created_at,
    dateModified: post.published_at || post.created_at,
    author: {
      "@type": "Organization",
      name: post.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: t.common.brand,
    },
    inLanguage: lang === "zh" ? "zh-CN" : "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": siteUrl() + href(lang, `blog/${post.slug}`),
    },
  };

  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[
          { label: t.nav[0].label, to: "" },
          { label: t.blog.breadcrumb, to: "blog" },
          { label: post.title },
        ]}
        title={post.title}
        sub={post.excerpt}
        image={post.featured_image || BLOG_IMAGES[slug] || IMG.pageHero}
      />

      <section className="content-block">
        <div className="container">
          <div style={{ marginBottom: 28 }}>
            <LocalizedLink
              lang={lang}
              to="blog"
              className="blog-card__read"
              style={{ color: "var(--brand-600)" }}
            >
              <Icon
                name="arrow-right"
                style={{ transform: "rotate(180deg)" }}
              />
              {t.blog.backLabel}
            </LocalizedLink>
          </div>

          <div className="article">
            <div className="article__body">
              <div className="article__meta-bar">
                <div className="article__author">
                  <span className="article__author-avatar">
                    <Image
                      src={IMG.author}
                      alt={post.author_name}
                      width={46}
                      height={46}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </span>
                  <span>
                    <strong style={{ color: "var(--brand-900)" }}>
                      {post.author_name}
                    </strong>
                    <br />
                    {post.author_role}
                  </span>
                </div>
                <span>{dateLabel}</span>
                <span>{post.read_time}</span>
                <span>{post.category}</span>
              </div>

              {toc.length >= 3 && (
                <details className="article__toc">
                  <summary className="article__toc-title">
                    {t.blog.tableOfContents}
                  </summary>
                  <ol>
                    {toc.map((h) => (
                      <li
                        key={h.id}
                        className={h.level === 3 ? "is-sub" : undefined}
                      >
                        <a href={`#${h.id}`}>{h.text}</a>
                      </li>
                    ))}
                  </ol>
                </details>
              )}

              <div dangerouslySetInnerHTML={{ __html: body }} />

              <ShareBar
                url={shareUrl}
                title={post.title}
                label={t.blog.sharePost}
                lang={lang}
              />
            </div>

            <aside className="article__sidebar">
              <div className="sidebar-card">
                <h4>{t.blog.writtenBy}</h4>
                <div className="article__author">
                  <span className="article__author-avatar">
                    <Image
                      src={IMG.author}
                      alt={post.author_name}
                      width={46}
                      height={46}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </span>
                  <span>
                    <strong style={{ color: "var(--brand-900)" }}>
                      {post.author_name}
                    </strong>
                    <br />
                    <span style={{ color: "var(--text-muted)" }}>
                      {post.author_role}
                    </span>
                  </span>
                </div>
              </div>

              {related.length > 0 && (
                <div className="sidebar-card">
                  <h4>{t.blog.relatedTitle}</h4>
                  {related.map((r) => (
                    <LocalizedLink
                      key={r.slug}
                      lang={lang}
                      to={`blog/${r.slug}`}
                      className="related-link"
                    >
                      {r.title}
                    </LocalizedLink>
                  ))}
                </div>
              )}

              <div className="sidebar-card sidebar-card--dark">
                <h4>{t.contact.emergencyTitle}</h4>
                <p>{t.contact.emergencyText}</p>
                <Button lang={lang} to="contact" variant="primary" icon="phone">
                  {t.contact.emergencyCta}
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
