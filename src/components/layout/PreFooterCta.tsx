import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/icons";
import { BROCHURE_URL } from "@/lib/company";
import { getDict, type Lang } from "@/i18n";

/** Two-panel call-to-action band rendered on every page, just above the
 *  footer: left panel invites contact, right panel offers the brochure. */
export function PreFooterCta({ lang }: { lang: Lang }) {
  const p = getDict(lang).preFooter;
  return (
    <section className="pre-cta" aria-label={p.leftTitle}>
      <div className="pre-cta__panel pre-cta__panel--contact">
        <Reveal className="pre-cta__inner">
          <div className="pre-cta__text">
            <h2>{p.leftTitle}</h2>
            <p>{p.leftText}</p>
          </div>
          <Button lang={lang} to="contact" variant="primary" icon="mail">
            {p.leftCta}
          </Button>
        </Reveal>
      </div>
      <div className="pre-cta__panel pre-cta__panel--brochure">
        <Reveal className="pre-cta__inner">
          <div className="pre-cta__text">
            <h2>{p.rightTitle}</h2>
            <p>{p.rightText}</p>
          </div>
          <a
            className="btn btn--secondary"
            href={BROCHURE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="file" />
            <span>{p.rightCta}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
