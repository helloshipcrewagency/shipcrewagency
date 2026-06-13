import Link from "next/link";
import type { ReactNode } from "react";
import { href as buildHref, type Lang } from "@/i18n";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline-white" | "outline-brand";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  lang?: Lang;
  /** internal path-key (uses language routing) */
  to?: string;
  /** explicit href (external or absolute) */
  href?: string;
  /** open href in a new tab (adds target/rel) */
  external?: boolean;
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
  full?: boolean;
}

export function Button({
  children,
  variant = "primary",
  lang = "en",
  to,
  href,
  external,
  icon,
  iconRight,
  className,
  full,
}: ButtonProps) {
  const classes = cn(
    "btn",
    `btn--${variant}`,
    full && "btn--full",
    className,
  );
  const inner = (
    <>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} />}
    </>
  );
  const style = full
    ? { width: "100%", justifyContent: "center" as const }
    : undefined;

  if (to !== undefined) {
    return (
      <Link href={buildHref(lang, to)} className={classes} style={style}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <span className={classes} style={style}>
      {inner}
    </span>
  );
}
