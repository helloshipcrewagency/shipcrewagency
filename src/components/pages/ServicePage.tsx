import { notFound } from "next/navigation";
import { LegacyRuntime } from "@/components/legacy/LegacyRuntime";
import { getServicePage } from "@/lib/services/store";
import { SERVICE_PROSE_CSS } from "@/lib/services/prose";
import type { Lang } from "@/i18n";

// Service pages render in one of two ways:
//   • Bespoke pages (the 6 originals) ship their own custom CSS and full markup,
//     reproduced 1:1 and recoloured, scoped under .legacy-svc.
//   • Pages written in the visual editor have no custom CSS — they get the
//     site's branded "prose" stylesheet automatically (under .legacy-svc.svc-prose)
//     so a non-technical author gets an on-brand page without writing any code.
// Content is loaded from the database (editable in the admin) and falls back to
// the bundled originals when no DB entry exists.
export async function ServicePage({ lang, slug }: { lang: Lang; slug: string }) {
  const page = await getServicePage(slug);
  if (!page || !page.published) notFound();

  const body = (lang === "en" ? page.bodyEn : page.bodyZh) || page.bodyEn;
  const script = lang === "en" ? page.scriptEn : page.scriptZh;
  const hasCustomCss = Boolean(page.css && page.css.trim());

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: hasCustomCss ? page.css : SERVICE_PROSE_CSS,
        }}
      />
      <div
        className={hasCustomCss ? "legacy-svc" : "legacy-svc svc-prose"}
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <LegacyRuntime script={script ?? ""} lang={lang} />
    </>
  );
}
