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
import { siteUrl } from "@/lib/seo";

const SITE = siteUrl();

export function SiteChrome({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const dict = getDict(lang);
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
