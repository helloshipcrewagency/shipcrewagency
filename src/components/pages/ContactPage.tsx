import Image from "next/image";
import { Reveal } from "@/components/fx/Reveal";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon, type IconName } from "@/components/icons";
import { ContactForm } from "@/components/pages/ContactForm";
import { COMPANY, companyMapEmbed } from "@/lib/company";
import { QR_CODES } from "@/lib/media";
import { getDict, type Lang } from "@/i18n";

const INFO_ICONS: IconName[] = ["mail", "phone", "map-pin", "file"];

export function ContactPage({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const c = t.contact;

  // One-tap dial target — the specialists' direct mobile line.
  const emergencyTel = COMPANY.callTel;

  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[
          { label: t.nav[0].label, to: "" },
          { label: c.breadcrumb },
        ]}
        title={c.title}
        sub={c.sub}
      />

      <section className="content-block" style={{ paddingBottom: 0 }}>
        <div className="container">
          <SectionHeader tag={c.qr.tag} title={c.qr.title} text={c.qr.text} />
          <Reveal>
            <div className="qr-grid">
              {QR_CODES.map((src, i) => (
                <div className="qr-card" key={src}>
                  <div className="qr-card__img">
                    <Image src={src} alt={c.qr.items[i]} width={170} height={170} />
                  </div>
                  <span className="qr-card__label">{c.qr.items[i]}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="content-block">
        <div className="container">
          <div className="contact-grid">
            <Reveal>
              <ContactForm lang={lang} />
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="contact-info-card">
                  <h3>{c.infoTitle}</h3>
                  <p>{c.infoText}</p>
                  {c.infoItems.map((item, i) => (
                    <div className="ci-item" key={item.label}>
                      <div className="ci-icon">
                        <Icon name={INFO_ICONS[i]} />
                      </div>
                      <div>
                        <div className="ci-label">{item.label}</div>
                        <div className="ci-val">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dark-card">
                  <h3>{c.emergencyTitle}</h3>
                  <p style={{ marginBottom: 22 }}>{c.emergencyText}</p>
                  <Button
                    lang={lang}
                    href={`tel:${emergencyTel}`}
                    variant="primary"
                    icon="phone"
                  >
                    {c.emergencyCta}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="content-block" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <h2 className="contact-map__title">{c.mapTitle}</h2>
            <div className="contact-map__frame">
              <iframe
                src={companyMapEmbed(lang)}
                title={c.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
