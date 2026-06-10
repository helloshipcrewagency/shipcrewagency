import { Atmosphere } from "@/components/fx/Atmosphere";
import { Icon, LogoMark } from "@/components/icons";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { Button } from "@/components/ui/Button";
import { COMPANY } from "@/lib/company";
import type { Lang } from "@/i18n";
import type { Dictionary } from "@/i18n/types";

const LEGAL_SLUGS = ["legal/privacy", "legal/terms", "legal/cookies"];

// Real social profiles (shared across both language editions).
const SOCIALS: { icon: string; label: string; href: string }[] = [
  { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/taslimakhanamsultana/" },
  { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/TaslimaKhanamSultana/" },
  { icon: "users", label: "Facebook Group", href: "https://www.facebook.com/groups/995918854535351/" },
  { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/sultana_cssl/" },
  { icon: "twitter", label: "X (Twitter)", href: "https://x.com/mis_sultana" },
  { icon: "telegram", label: "Telegram", href: "https://t.me/shipcrewagency" },
];

export function Footer({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const f = dict.footer;
  return (
    <footer className="footer">
      <Atmosphere grid={false} blobs />
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <LocalizedLink lang={lang} to="" className="logo">
              <span className="logo__icon">
                <LogoMark />
              </span>
              <span className="logo__text">
                <span className="logo__name">{dict.common.brand}</span>
                <span className="logo__tagline">{dict.common.tagline}</span>
              </span>
            </LocalizedLink>
            <p>{f.blurb}</p>
            <div className="footer__cert-strip">
              {f.certs.map((c) => (
                <span className="footer__cert" key={c}>
                  {c}
                </span>
              ))}
            </div>
            <div className="footer__licence">
              {f.licenseLabel}: {COMPANY.licence}
            </div>
            <div className="footer__socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  className="footer__social"
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="footer__col-title">{f.servicesTitle}</div>
            <div className="footer__links">
              {f.services.map((l) => (
                <LocalizedLink key={l.to} lang={lang} to={l.to} className="footer__link">
                  {l.label}
                </LocalizedLink>
              ))}
            </div>
          </div>

          {/* Crew Categories */}
          <div>
            <div className="footer__col-title">{f.categoriesTitle}</div>
            <div className="footer__links">
              {f.categories.map((l) => (
                <LocalizedLink key={l.to} lang={lang} to={l.to} className="footer__link">
                  {l.label}
                </LocalizedLink>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="footer__col-title">{f.companyTitle}</div>
            <div className="footer__links">
              {f.company.map((l) => (
                <LocalizedLink key={l.to} lang={lang} to={l.to} className="footer__link">
                  {l.label}
                </LocalizedLink>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="footer__col-title">{f.contactTitle}</div>
            <div className="footer__contact-item">
              <Icon name="map-pin" />
              <span>{COMPANY.address}</span>
            </div>
            <div className="footer__contact-item">
              <Icon name="phone" />
              <span className="footer__contact-lines">
                {COMPANY.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`}>
                    {p}
                  </a>
                ))}
              </span>
            </div>
            <div className="footer__contact-item">
              <Icon name="mail" />
              <span className="footer__contact-lines">
                {COMPANY.emails.map((e) => (
                  <a key={e} href={`mailto:${e}`}>
                    {e}
                  </a>
                ))}
              </span>
            </div>
            <div style={{ marginTop: 24 }}>
              <Button lang={lang} to="contact" variant="primary" full>
                {dict.common.requestCrew}
              </Button>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">{f.copyright}</p>
          <div className="footer__bottom-links">
            {f.bottomLinks.map((label, i) =>
              i < 3 ? (
                <LocalizedLink
                  key={label}
                  lang={lang}
                  to={LEGAL_SLUGS[i]}
                  className="footer__bottom-link"
                >
                  {label}
                </LocalizedLink>
              ) : (
                <a key={label} href="/sitemap.xml" className="footer__bottom-link">
                  {label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
