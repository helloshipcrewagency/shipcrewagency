// Shape of a service page as edited in the admin and rendered on the site.
// Stored in the existing `site_settings` table (one row per page + an index
// row), so no new database table / migration is required.

export interface ServiceMeta {
  slug: string;
  /** position in the Services dropdown / listing */
  order: number;
  /** unpublished pages are hidden from the public site + nav */
  published: boolean;
  /** Services dropdown label */
  navEn: string;
  navZh: string;
  /** <title> / SEO title */
  titleEn: string;
  titleZh: string;
  /** SEO meta description */
  metaDescEn?: string;
  metaDescZh?: string;
}

export interface ServicePageData extends ServiceMeta {
  /** the page markup (recoloured original design), per language */
  bodyEn: string;
  bodyZh: string;
  /** the page stylesheet (language-neutral, scoped under .legacy-svc) */
  css: string;
  /** the page's inline script (FAQ data / accordions / tabs), per language */
  scriptEn: string;
  scriptZh: string;
}
