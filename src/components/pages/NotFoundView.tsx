import { Atmosphere } from "@/components/fx/Atmosphere";
import { Reveal } from "@/components/fx/Reveal";
import { Button } from "@/components/ui/Button";
import { getDict, type Lang } from "@/i18n";

/** The 404 section only (no chrome). The root 404 wraps this in <SiteChrome>;
 *  the /zh 404 inherits chrome from the zh layout. */
export function NotFoundView({ lang }: { lang: Lang }) {
  const nf = getDict(lang).notFound;
  return (
    <section
      className="page-hero"
      style={{
        minHeight: "64vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Atmosphere />
      <div className="wave-line" />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <Reveal>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4.5rem, 14vw, 8rem)",
              fontWeight: 700,
              color: "var(--cyan-300)",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            404
          </div>
          <h1 style={{ color: "var(--white)", marginBottom: 14 }}>{nf.title}</h1>
          <p
            style={{
              color: "var(--steel-light)",
              fontSize: "1.05rem",
              fontWeight: 300,
              maxWidth: 520,
              margin: "0 auto 36px",
            }}
          >
            {nf.text}
          </p>
          <Button lang={lang} to="" variant="primary" icon="arrow-right">
            {nf.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
