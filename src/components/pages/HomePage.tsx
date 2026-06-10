import { Atmosphere } from "@/components/fx/Atmosphere";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { Typewriter } from "@/components/fx/Typewriter";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { Icon, type IconName } from "@/components/icons";
import { SERVICE_SLUGS, CATEGORY_SLUGS, type Lang } from "@/i18n";
import { getDict } from "@/i18n";
import Image from "next/image";
import { IMG, catImage } from "@/lib/media";
import { COMPANY } from "@/lib/company";

const SVC_ICONS: IconName[] = [
  "users",
  "search",
  "refresh",
  "briefcase",
  "layers",
  "zap",
];
const CAT_ICONS: IconName[] = ["trending", "settings", "coffee", "layers"];
const CAT_BG = ["deck", "engine", "hosp", "off"];
const WHY_ICONS: IconName[] = [
  "clock",
  "shield",
  "check-circle",
  "file",
  "globe",
  "zap",
];
const TRUST_ICONS: IconName[] = ["clock", "globe", "users", "zap", "shield"];
const GLOBAL_ICONS: IconName[] = ["globe", "users", "zap", "shield"];
const KNOW_LINKS = [
  "blog/how-ship-crew-manning-works",
  "blog/stcw-certification-explained",
  "blog/emergency-crew-replacement",
];

export function HomePage({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const h = t.home;

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="media-layer">
          <Image
            src={IMG.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <Atmosphere />
        <div className="wave-line" />
        <div className="hero__content container">
          <Reveal>
            <div className="hero__eyebrow">{h.hero.eyebrow}</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="hero__headline">
              {h.hero.headlineLead}{" "}
              <em className="shimmer">{h.hero.headlineEmphasis}</em>{" "}
              {h.hero.headlineTail}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="hero__rotator">
              <Typewriter words={h.hero.rotating} />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="hero__sub">{h.hero.sub}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="hero__ctas">
              <Button lang={lang} to="contact" variant="primary" icon="arrow-right">
                {h.hero.ctaPrimary}
              </Button>
              <Button href={`tel:${COMPANY.callTel}`} variant="outline-white" icon="phone">
                {h.hero.ctaSecondary}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== TRUST BAR ===================== */}
      <section className="trust-bar">
        <RevealGroup className="trust-bar__grid container">
          {h.trustbar.map((item, i) => (
            <RevealItem className="trust-bar__item" key={item.label}>
              <div className="trust-bar__icon">
                <Icon name={TRUST_ICONS[i]} />
              </div>
              <div className="trust-bar__val">{item.value}</div>
              <div className="trust-bar__label">{item.label}</div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ===================== WHO WE ARE ===================== */}
      <section className="who section-pad">
        <div className="container">
          <div className="who__grid">
            <Reveal>
              <div
                className="who__card"
                style={{
                  backgroundImage: `linear-gradient(150deg, rgba(14,110,120,.9), rgba(7,52,58,.95)), url(${IMG.who})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="who__badge">
                  <Icon name="anchor" style={{ width: 12, height: 12 }} />
                  {h.who.badge}
                </div>
                <h3>{h.who.cardTitle}</h3>
                <p>{h.who.cardText}</p>
                <ul className="who__list">
                  {h.who.cardList.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
                <div className="who__stat-float">
                  <span className="who__stat-num">{h.who.floatNum}</span>
                  <span className="who__stat-lab">{h.who.floatLabel}</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="who__content">
                <div className="tag">{h.who.tag}</div>
                <h2>{h.who.title}</h2>
                {h.who.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <div className="who__pillars">
                  {h.who.pillars.map((pillar) => (
                    <div className="who__pillar" key={pillar.title}>
                      <div className="who__pillar-dot" />
                      <h4>{pillar.title}</h4>
                      <p>{pillar.text}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 32 }}>
                  <Button lang={lang} to="about" variant="secondary">
                    {h.who.cta}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="section-pad surface-section">
        <div className="container">
          <SectionHeader tag={h.services.tag} title={h.services.title} text={h.services.text} />
          <Reveal>
            <div className="services__grid">
              {h.services.cards.map((card, i) => (
                <LocalizedLink
                  key={card.title}
                  lang={lang}
                  to={`services/${SERVICE_SLUGS[i]}`}
                  className="svc-card"
                >
                  <div className="svc-card__icon">
                    <Icon name={SVC_ICONS[i]} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className="svc-card__link">
                    {t.common.exploreService}
                    <Icon name="arrow-right" />
                  </span>
                </LocalizedLink>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHY US ===================== */}
      <section className="why section-pad">
        <Atmosphere blobs={false} />
        <div className="container">
          <SectionHeader dark tag={h.why.tag} title={h.why.title} text={h.why.text} />
          <RevealGroup className="why__grid">
            {h.why.cards.map((card, i) => (
              <RevealItem className="why-card" key={card.title}>
                <div className="why-card__ico">
                  <Icon name={WHY_ICONS[i]} />
                </div>
                <div>
                  <div className="why-card__pain">{card.pain}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===================== PROCESS ===================== */}
      <section className="process section-pad">
        <div className="container">
          <SectionHeader tag={h.process.tag} title={h.process.title} text={h.process.text} />
          <RevealGroup className="process__steps">
            {h.process.steps.map((step, i) => (
              <RevealItem className="proc-step" key={step.title}>
                <div className="proc-step__num">{String(i + 1).padStart(2, "0")}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===================== CREW CATEGORIES ===================== */}
      <section className="section-pad surface-section">
        <div className="container">
          <SectionHeader tag={h.crewCats.tag} title={h.crewCats.title} text={h.crewCats.text} />
          <Reveal>
            <div className="crew-cats__grid">
              {h.crewCats.cards.map((card, i) => (
                <LocalizedLink
                  key={card.title}
                  lang={lang}
                  to={`crew/${CATEGORY_SLUGS[i]}`}
                  className="cat-card"
                >
                  <Image
                    className="cat-card__photo"
                    src={catImage(CATEGORY_SLUGS[i])}
                    alt={card.title}
                    fill
                    sizes="(max-width: 820px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="cat-card__overlay" />
                  <div className="cat-card__content">
                    <div className="cat-card__icon-wrap">
                      <Icon name={CAT_ICONS[i]} className="cat-card__icon" />
                    </div>
                    <div>
                      <h3>{card.title}</h3>
                      <ul className="cat-card__roles">
                        {card.roles.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                      <span className="cat-card__link">
                        {card.link}
                        <Icon name="arrow-right" />
                      </span>
                    </div>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== COMPLIANCE ===================== */}
      <section className="compliance section-pad">
        <Atmosphere grid={false} />
        <div className="container">
          <div className="comp__inner">
            <Reveal>
              <div className="comp__content">
                <div className="tag">{h.compliance.tag}</div>
                <h2>{h.compliance.title}</h2>
                {h.compliance.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <div className="comp__checks">
                  {h.compliance.checks.map((c) => (
                    <div className="comp__check" key={c}>
                      <div className="comp__tick">
                        <Icon name="check" />
                      </div>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <Button lang={lang} to="compliance" variant="primary">
                    {h.compliance.cta}
                  </Button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="cert-cards">
                {h.compliance.certCards.map((c) => (
                  <div className="cert-card" key={c.abbr}>
                    <span className="cert-card__abbr">{c.abbr}</span>
                    <span className="cert-card__name">{c.name}</span>
                    <p className="cert-card__desc">{c.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== GLOBAL ===================== */}
      <section className="global section-pad">
        <div className="container">
          <SectionHeader tag={h.global.tag} title={h.global.title} text={h.global.text} />
          <RevealGroup className="global__feats">
            {h.global.feats.map((f, i) => (
              <RevealItem className="gfeat" key={f.title}>
                <div className="gfeat__ico">
                  <Icon name={GLOBAL_ICONS[i]} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal>
            <div className="global__map-block">
              <div className="global__map-text">
                <h3>{h.global.mapTitle}</h3>
                <p>{h.global.mapText}</p>
              </div>
              <div className="global__regions">
                {h.global.regions.map((r) => (
                  <div className="region" key={r}>
                    <div className="region__dot" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="faq section-pad">
        <div className="container container--sm">
          <SectionHeader tag={h.faq.tag} title={h.faq.title} text={h.faq.text} />
          <Reveal>
            <FaqAccordion items={h.faq.items} />
          </Reveal>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Button lang={lang} to="faq" variant="outline-brand">
              {h.faq.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== KNOWLEDGE HUB ===================== */}
      <section className="know section-pad">
        <div className="container">
          <SectionHeader tag={h.knowledge.tag} title={h.knowledge.title} text={h.knowledge.text} />
          <Reveal>
            <div className="know__grid">
              <LocalizedLink lang={lang} to={KNOW_LINKS[0]} className="know-card">
                <div className="know-card__top">
                  <div className="know-card__tag">{h.knowledge.featured.tag}</div>
                  <h3>{h.knowledge.featured.title}</h3>
                </div>
                <div className="know-card__body">
                  <p>{h.knowledge.featured.text}</p>
                  <span className="know-card__read">
                    {t.common.readGuide}
                    <Icon name="arrow-right" />
                  </span>
                </div>
              </LocalizedLink>
              {h.knowledge.cards.map((card, i) => (
                <LocalizedLink
                  key={card.title}
                  lang={lang}
                  to={KNOW_LINKS[i + 1]}
                  className="know-card"
                >
                  <div className="know-card__body" style={{ padding: 32 }}>
                    <span className="tag2">{card.tag}</span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    <span className="know-card__read">
                      {t.common.readArticle}
                      <Icon name="arrow-right" />
                    </span>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </Reveal>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Button lang={lang} to="blog" variant="outline-brand">
              {h.knowledge.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="final-cta">
        <Atmosphere grid={false} />
        <div className="wave-line" style={{ top: 0, bottom: "auto" }} />
        <div className="final-cta__inner">
          <Reveal>
            <div className="final-cta__eye">{h.finalCta.eyebrow}</div>
            <h2>{h.finalCta.title}</h2>
            <p className="final-cta__sub">{h.finalCta.sub}</p>
            <div className="final-cta__actions">
              <Button lang={lang} to="contact" variant="primary" icon="arrow-right">
                {h.finalCta.ctaPrimary}
              </Button>
              <Button lang={lang} to="about" variant="outline-white">
                {h.finalCta.ctaSecondary}
              </Button>
            </div>
            <div className="final-cta__contact">
              {h.finalCta.contact.map((c) => (
                <div className="final-cta__ci" key={c.label}>
                  <span className="final-cta__ci-lab">{c.label}</span>
                  <span className="final-cta__ci-val">{c.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
