import { Atmosphere } from "@/components/fx/Atmosphere";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/fx/Reveal";
import { whatsappHref, enquiryMailto } from "@/lib/company";
import type { Lang } from "@/i18n";
import type { IconName } from "@/components/icons";

interface Action {
  label: string;
  to: string;
  variant?: "primary" | "secondary" | "outline-white" | "outline-brand";
  icon?: IconName;
  iconRight?: IconName;
}

export function CtaStrip({
  lang,
  title,
  text,
  actions,
}: {
  lang: Lang;
  title: string;
  text?: string;
  actions: Action[];
}) {
  return (
    <section className="page-cta-strip">
      <Atmosphere grid={false} />
      <div className="container">
        <Reveal>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
          <div className="cta-btns">
            {(() => {
              // Send the "contact" call-to-actions straight to a person: the
              // first goes to WhatsApp, any others to the enquiry inbox.
              let contactSeen = 0;
              return actions.map((a, i) => {
                let to: string | undefined = a.to;
                let href: string | undefined;
                let external = false;
                if (a.to === "contact") {
                  if (contactSeen === 0) {
                    href = whatsappHref(lang);
                    external = true;
                  } else {
                    href = enquiryMailto(lang);
                  }
                  contactSeen += 1;
                  to = undefined;
                }
                return (
                  <Button
                    key={i}
                    lang={lang}
                    to={to}
                    href={href}
                    external={external}
                    variant={a.variant ?? (i === 0 ? "primary" : "outline-white")}
                    icon={a.icon}
                    iconRight={a.iconRight}
                  >
                    {a.label}
                  </Button>
                );
              });
            })()}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
