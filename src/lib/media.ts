// Central image manifest — real maritime photography stored locally in
// /public/images (all WebP). Swap any value here to re-assign a picture.
// Editorial author portrait (author.webp): Royal Navy photograph via Wikimedia
// Commons, Open Government Licence v3.0 (UK MOD / Crown copyright).

export const IMG = {
  hero: "/images/m-08.webp",
  who: "/images/crew-05.webp",
  about: "/images/m-02.webp",
  contact: "/images/m-07.webp",
  process: "/images/m-05.webp",
  cta: "/images/m-01.webp",
  author: "/images/author.webp",
  // inner-page hero backdrops (subtle, behind the teal overlay)
  pageHero: "/images/m-04.webp",
  // crew category cards
  cat: {
    "deck-crew": "/images/m-03.webp",
    "engine-crew": "/images/crew-02.webp",
    "hospitality-crew": "/images/crew-04.webp",
    "offshore-crew": "/images/m-06.webp",
  } as Record<string, string>,
  // blog covers, by normalized category key
  blog: {
    guide: "/images/m-01.webp",
    compliance: "/images/m-09.webp",
    operations: "/images/crew-01.webp",
    industry: "/images/m-10.webp",
    checklist: "/images/crew-03.webp",
    welfare: "/images/crew-06.webp",
    default: "/images/m-02.webp",
  } as Record<string, string>,
};

export function catImage(slug: string): string {
  return IMG.cat[slug] ?? IMG.pageHero;
}

// A DISTINCT cover per blog article (keyed by slug) so no two posts share an
// image. Admin-created posts use their uploaded featured_image; anything not
// listed here falls back to the category image, then the default.
export const BLOG_IMAGES: Record<string, string> = {
  "how-ship-crew-manning-works": "/images/m-01.webp",
  "stcw-certification-explained": "/images/m-09.webp",
  "emergency-crew-replacement": "/images/crew-01.webp",
  "mlc-2006-seafarer-rights": "/images/crew-04.webp",
  "global-seafarer-supply": "/images/m-10.webp",
  "maritime-hiring-checklist": "/images/crew-03.webp",
  "seafarer-welfare-mental-health": "/images/crew-06.webp",
  "future-fuels-crew-training": "/images/m-03.webp",
};

// Leadership team — photo + name. Names are proper nouns (identical in every
// language); the designation/role is translated in the dictionary, same order.
export const TEAM = [
  { img: "/images/team-salahuddin-ahmed.webp", name: "Captain Salahuddin Ahmed" },
  { img: "/images/team-atikur-rahman.webp", name: "Atikur Rahman" },
  { img: "/images/team-taslima-sultana.webp", name: "Taslima Khanam Sultana" },
  { img: "/images/team-shamimul-hoque.webp", name: "Md. Shamimul Hoque" },
  { img: "/images/team-mizanur-rahman.webp", name: "Mizanur Rahman" },
];

// Contact QR codes — scan to message our specialists. Order matches contact.qr.items.
export const QR_CODES = [
  "/images/qr-whatsapp.webp",
  "/images/qr-wechat.webp",
  "/images/qr-dingtalk.webp",
];

// Compliance page — scanned licence + certificate (kept in /images/compliance).
export const COMPLIANCE_DOCS = [
  "/images/compliance/mla-0108-license.webp",
  "/images/compliance/mlc-2006-certificate.webp",
];
