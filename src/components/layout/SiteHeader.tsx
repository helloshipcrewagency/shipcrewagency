"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, LogoMark } from "@/components/icons";
import { LocalizedLink } from "@/components/ui/LocalizedLink";
import { ThemeToggle } from "@/components/fx/ThemeToggle";
import { href as buildHref, type Lang } from "@/i18n";
import type { Dictionary, NavChild } from "@/i18n/types";
import { COMPANY, whatsappHref } from "@/lib/company";
import { cn } from "@/lib/utils";

// Recursive dropdown items — nested children render indented beneath their
// parent, so a custom menu can be as deep as it likes.
function DropdownItems({
  items,
  lang,
  depth = 0,
}: {
  items: NavChild[];
  lang: Lang;
  depth?: number;
}) {
  return (
    <>
      {items.map((c, i) => {
        const style =
          depth > 0 ? { paddingLeft: 16 + depth * 15 } : undefined;
        const inner = (
          <>
            <Icon name="arrow-right" />
            {c.label}
          </>
        );
        return (
          <span key={`${c.to}-${i}`} style={{ display: "contents" }}>
            {c.external ? (
              <a
                href={c.to}
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown__item"
                style={style}
              >
                {inner}
              </a>
            ) : (
              <Link
                href={buildHref(lang, c.to)}
                className="dropdown__item"
                style={style}
              >
                {inner}
              </Link>
            )}
            {c.children?.length ? (
              <DropdownItems items={c.children} lang={lang} depth={depth + 1} />
            ) : null}
          </span>
        );
      })}
    </>
  );
}

// Recursive mobile sub-items.
function MobileItems({
  items,
  lang,
  depth = 0,
}: {
  items: NavChild[];
  lang: Lang;
  depth?: number;
}) {
  return (
    <>
      {items.map((c, i) => (
        <span key={`${c.to}-${i}`} style={{ display: "contents" }}>
          {c.external ? (
            <a
              href={c.to}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav__sub-link"
              style={depth > 0 ? { paddingLeft: 16 + depth * 14 } : undefined}
            >
              {c.label}
            </a>
          ) : (
            <Link
              href={buildHref(lang, c.to)}
              className="mobile-nav__sub-link"
              style={depth > 0 ? { paddingLeft: 16 + depth * 14 } : undefined}
            >
              {c.label}
            </Link>
          )}
          {c.children?.length ? (
            <MobileItems items={c.children} lang={lang} depth={depth + 1} />
          ) : null}
        </span>
      ))}
    </>
  );
}

function LangToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname() || "/";
  const isZh = pathname === "/zh" || pathname.startsWith("/zh/");
  const enPath = isZh ? pathname.slice(3) || "/" : pathname;
  const zhPath = isZh ? pathname : pathname === "/" ? "/zh" : `/zh${pathname}`;
  return (
    <div className="topbar__right">
      <Link
        href={enPath}
        className={cn("topbar__lang", lang === "en" && "active")}
        hrefLang="en"
      >
        EN
      </Link>
      <span className="topbar__divider" />
      <Link
        href={zhPath}
        className={cn("topbar__lang", lang === "zh" && "active")}
        hrefLang="zh"
      >
        中文
      </Link>
      <span className="topbar__divider" />
      <ThemeToggle />
    </div>
  );
}

export function SiteHeader({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setOpenSub(null);
  }, [pathname]);

  const { nav, common, topbar } = dict;

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar__inner">
          <div className="topbar__left">
            <a className="topbar__item" href={`mailto:${topbar.email}`}>
              <Icon name="mail" />
              {topbar.email}
            </a>
            <a className="topbar__item" href={`tel:${COMPANY.callTel}`}>
              <Icon name="phone" />
              {topbar.emergency}
            </a>
          </div>
          <LangToggle lang={lang} />
        </div>
      </div>

      {/* HEADER */}
      <header className={cn("header", scrolled && "header--scrolled")}>
        <div className="header__inner">
          <LocalizedLink lang={lang} to="" className="logo" aria-label={common.brand}>
            <span className="logo__icon">
              <LogoMark />
            </span>
            <span className="logo__text">
              <span className="logo__name">{common.brand}</span>
              <span className="logo__tagline">{common.tagline}</span>
            </span>
          </LocalizedLink>

          <nav className="nav" aria-label="Primary">
            {nav.map((item) => (
              <div className="nav__item" key={item.label}>
                {item.children ? (
                  <>
                    <span className="nav__link" role="button" tabIndex={0}>
                      {item.label}
                      <Icon name="chevron-down" />
                    </span>
                    <div
                      className={cn("dropdown", item.wide && "dropdown--wide")}
                    >
                      {item.wide && (
                        <div className="dropdown__col-head">{item.label}</div>
                      )}
                      <DropdownItems items={item.children} lang={lang} />
                    </div>
                  </>
                ) : (
                  <LocalizedLink lang={lang} to={item.to ?? ""} className="nav__link">
                    {item.label}
                  </LocalizedLink>
                )}
              </div>
            ))}
            <div className="nav__item nav__cta">
              <a
                href={whatsappHref(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                <Icon name="arrow-right" />
                <span>{common.requestCrew}</span>
              </a>
            </div>
          </nav>

          <button
            className={cn("hamburger", mobileOpen && "open")}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* MOBILE NAV */}
      <div className={cn("mobile-nav", mobileOpen && "open")}>
        {nav.map((item) =>
          item.children ? (
            <div className="mobile-nav__item" key={item.label}>
              <button
                className="mobile-nav__link"
                onClick={() =>
                  setOpenSub((s) => (s === item.label ? null : item.label))
                }
              >
                {item.label}
                <span>{openSub === item.label ? "−" : "+"}</span>
              </button>
              <div
                className={cn(
                  "mobile-nav__sub",
                  openSub === item.label && "open",
                )}
              >
                <MobileItems items={item.children} lang={lang} />
              </div>
            </div>
          ) : (
            <div className="mobile-nav__item" key={item.label}>
              <Link
                href={buildHref(lang, item.to ?? "")}
                className="mobile-nav__link"
              >
                {item.label}
              </Link>
            </div>
          ),
        )}
        <div className="mobile-nav__cta">
          <a
            href={whatsappHref(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {common.requestCrew}
          </a>
        </div>
      </div>
    </>
  );
}
