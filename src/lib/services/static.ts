// Built-in fallback for the six original service pages. Used when the database
// has no entry yet (or Supabase is not configured) so the public site always
// renders and never breaks. Pulls the nav labels + SEO from the dictionaries
// and the markup/CSS/scripts from the bundled legacy modules.
import { getDict, SERVICE_SLUGS, type Lang } from "@/i18n";
import { LEGACY_BODY_EN } from "@/content/services/legacy-bodies";
import { LEGACY_BODY_ZH } from "@/content/services/legacy-bodies.zh";
import { LEGACY_CSS } from "@/content/services/legacy-css";
import { LEGACY_SCRIPTS } from "@/content/services/legacy-scripts";
import { LEGACY_SCRIPTS_ZH } from "@/content/services/legacy-scripts.zh";
import type { ServiceMeta, ServicePageData } from "./types";

export const STATIC_SLUGS: string[] = [...SERVICE_SLUGS];

function navLabel(lang: Lang, slug: string): string {
  const services = getDict(lang).nav.find(
    (n) => n.to === "services" && n.children,
  );
  const child = services?.children?.find((c) => c.to === `services/${slug}`);
  return child?.label ?? slug;
}

export function getStaticMeta(): ServiceMeta[] {
  const en = getDict("en");
  const zh = getDict("zh");
  return STATIC_SLUGS.map((slug, i) => {
    const se = en.services[slug];
    const sz = zh.services[slug];
    return {
      slug,
      order: i,
      published: true,
      navEn: navLabel("en", slug),
      navZh: navLabel("zh", slug),
      titleEn: se?.metaTitle ?? navLabel("en", slug),
      titleZh: sz?.metaTitle ?? navLabel("zh", slug),
      metaDescEn: se?.metaDescription ?? "",
      metaDescZh: sz?.metaDescription ?? "",
    };
  });
}

export function getStaticPage(slug: string): ServicePageData | null {
  if (!LEGACY_CSS[slug] || !LEGACY_BODY_EN[slug]) return null;
  const meta = getStaticMeta().find((m) => m.slug === slug);
  if (!meta) return null;
  return {
    ...meta,
    css: LEGACY_CSS[slug],
    bodyEn: LEGACY_BODY_EN[slug],
    bodyZh: LEGACY_BODY_ZH[slug] ?? LEGACY_BODY_EN[slug],
    scriptEn: LEGACY_SCRIPTS[slug] ?? "",
    scriptZh: LEGACY_SCRIPTS_ZH[slug] ?? "",
  };
}
