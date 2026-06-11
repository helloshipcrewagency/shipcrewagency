import { notFound } from "next/navigation";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/ui/PageHero";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { Icon } from "@/components/icons";
import { SERVICE_BODIES } from "@/content/services";
import { getDict, type Lang } from "@/i18n";

export function ServicePage({ lang, slug }: { lang: Lang; slug: string }) {
  const t = getDict(lang);
  const s = t.services[slug];
  if (!s) notFound();

  // Full service content extracted from the client's source pages, rendered in
  // OUR design (typography, colour, spacing). The Chinese edition keeps its own
  // structured copy until that content is translated.
  const body = lang === "en" ? SERVICE_BODIES[slug] : undefined;

  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[
          { label: t.nav[0].label, to: "" },
          { label: t.servicesIndex.breadcrumb, to: "services" },
          { label: s.breadcrumb },
        ]}
        title={s.title}
        sub={s.sub}
      />

      {body ? (
        <section className="content-block">
          <div className="container">
            <Reveal>
              <div
                className="service-prose"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </Reveal>
          </div>
        </section>
      ) : (
        <>
          {/* ===================== INTRO ===================== */}
          <section className="content-block">
            <div className="container">
              <div className="two-col" style={{ alignItems: "start" }}>
                <Reveal>
                  <div>
                    <div className="tag">{s.introTag}</div>
                    <h2 style={{ color: "var(--brand-900)", marginBottom: 20 }}>
                      {s.introTitle}
                    </h2>
                    {s.introParagraphs.map((p, i) => (
                      <p key={i} style={{ marginBottom: 18 }}>
                        {p}
                      </p>
                    ))}
                    <div style={{ marginTop: 28 }}>
                      <Button lang={lang} to="contact" variant="primary" icon="arrow-right">
                        {s.introCta}
                      </Button>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="dark-card">
                    <h3>{s.listTitle}</h3>
                    <div className="role-list">
                      {s.listItems.map((li) => (
                        <div className="role-item" key={li}>
                          <Icon name="check" />
                          <span>{li}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ===================== WHAT WE PROVIDE ===================== */}
          {s.provideCards && (
            <section className="content-block content-block--alt">
              <div className="container">
                <SectionHeader tag={s.provideTag} title={s.provideTitle ?? ""} />
                <RevealGroup className="three-col">
                  {s.provideCards.map((card) => (
                    <RevealItem className="content-card" key={card.title}>
                      <h3>{card.title}</h3>
                      <p>{card.text}</p>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </section>
          )}

          {/* ===================== HIGHLIGHT ===================== */}
          {s.highlightTitle && (
            <section className="content-block">
              <div className="container">
                <Reveal>
                  <div className="highlight-box">
                    <h2>{s.highlightTitle}</h2>
                    <p>{s.highlightText}</p>
                    <Button lang={lang} to="contact" variant="primary" icon="phone">
                      {s.introCta}
                    </Button>
                  </div>
                </Reveal>
              </div>
            </section>
          )}
        </>
      )}

      <CtaStrip
        lang={lang}
        title={s.ctaTitle}
        text={s.ctaText}
        actions={[
          { label: s.ctaPrimary, to: "contact", icon: "arrow-right" },
          { label: t.common.getInTouch, to: "contact", variant: "outline-white" },
        ]}
      />
    </>
  );
}
