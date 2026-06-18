import { notFound } from "next/navigation";
import { LegacyRuntime } from "@/components/legacy/LegacyRuntime";
import { getServicePage } from "@/lib/services/store";
import type { Lang } from "@/i18n";

// Service pages reproduce the client's own source pages 1:1 — same markup +
// styling, recoloured to the site palette and scoped under .legacy-svc. The
// content is loaded from the database (editable in the admin) and falls back to
// the bundled originals when no DB entry exists.
export async function ServicePage({ lang, slug }: { lang: Lang; slug: string }) {
  const page = await getServicePage(slug);
  if (!page || !page.published) notFound();

  const body = (lang === "en" ? page.bodyEn : page.bodyZh) || page.bodyEn;
  const script = lang === "en" ? page.scriptEn : page.scriptZh;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: page.css }} />
      <div className="legacy-svc" dangerouslySetInnerHTML={{ __html: body }} />
      <LegacyRuntime script={script ?? ""} lang={lang} />
    </>
  );
}
