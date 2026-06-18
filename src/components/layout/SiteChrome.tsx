import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { SiteHeader } from "./SiteHeader";
import { PreFooterCta } from "./PreFooterCta";
import { Footer } from "./Footer";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { FloatingActions } from "./FloatingActions";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import { getDict, type Lang } from "@/i18n";
import type { Dictionary } from "@/i18n/types";
import { getNavServices } from "@/lib/services/store";
import type { ServiceMeta } from "@/lib/services/types";
import { siteUrl } from "@/lib/seo";

const SITE = siteUrl();

// Replace the Services dropdown (and footer services list) with the live,
// admin-managed set of service pages, so newly added pages show up in the nav.
function withServiceNav(
  dict: Dictionary,
  lang: Lang,
  services: ServiceMeta[],
): Dictionary {
  if (!services.length) return dict;
  const children = services.map((m) => ({
    label: lang === "en" ? m.navEn : m.navZh,
    to: `services/${m.slug}`,
  }));
  const nav = dict.nav.map((item) =>
    item.to === "services" && item.children ? { ...item, children } : item,
  );
  const footer = Array.isArray(dict.footer?.services)
    ? { ...dict.footer, services: children }
    : dict.footer;
  return { ...dict, nav, footer };
}

export async function SiteChrome({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const services = await getNavServices();
  const dict = withServiceNav(getDict(lang), lang, services);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: dict.common.brand,
      url: SITE,
      logo: `${SITE}/icon.svg`,
      description: dict.footer.blurb,
      email: dict.footer.contactEmail,
      foundingDate: "2007",
      areaServed: "Worldwide",
      knowsLanguage: ["en", "zh"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: dict.common.brand,
      url: lang === "zh" ? `${SITE}/zh` : SITE,
      inLanguage: lang === "zh" ? "zh-CN" : "en",
    },
  ];
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <SiteHeader lang={lang} dict={dict} />
      <main id="main-content">{children}</main>
      <NewsletterSignup lang={lang} />
      <PreFooterCta lang={lang} />
      <Footer lang={lang} dict={dict} />
      <FloatingActions lang={lang} />
      <ServiceWorkerRegister />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
