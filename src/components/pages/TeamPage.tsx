import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/ui/PageHero";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { getDict, type Lang } from "@/i18n";
import { TEAM } from "@/lib/media";

export function TeamPage({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const m = t.team;

  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: t.nav[0].label, to: "" }, { label: m.breadcrumb }]}
        title={m.title}
        sub={m.sub}
      />

      <section className="content-block">
        <div className="container">
          <SectionHeader tag={m.tag} title={m.sectionTitle} text={m.sectionText} />
          <RevealGroup className="team-grid">
            {TEAM.map((member, i) => (
              <RevealItem className="team-card" key={member.name}>
                <div className="team-card__photo">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    sizes="(max-width: 700px) 50vw, (max-width: 1080px) 33vw, 250px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="team-card__body">
                  <h3 className="team-card__name">{member.name}</h3>
                  <span className="team-card__role">{m.roles[i]}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaStrip
        lang={lang}
        title={m.ctaTitle}
        text={m.ctaText}
        actions={[
          { label: t.common.requestCrew, to: "contact", icon: "arrow-right" },
          { label: t.common.getInTouch, to: "contact", variant: "outline-white" },
        ]}
      />
    </>
  );
}
