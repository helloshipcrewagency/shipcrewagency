"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Anchor,
  Lock,
  Mail,
  Menu as MenuIcon,
  PanelsTopLeft,
  Code2,
  LogOut,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/icons";
import { logoutAction } from "../taslima/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Service Pages", icon: Anchor },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/vault", label: "Vault", icon: Lock },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/menus", label: "Menus", icon: MenuIcon },
  { href: "/admin/footer", label: "Footer & Social", icon: PanelsTopLeft },
  { href: "/admin/scripts", label: "Scripts", icon: Code2 },
] as const;

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initial = userEmail?.[0]?.toUpperCase() ?? "A";

  const nav = (onNavigate?: () => void) =>
    NAV.map(({ href, label, icon: Icon }) => {
      const active = isActive(href);
      return (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={`a-nav__link${active ? " is-active" : ""}`}
        >
          <Icon />
          {label}
          {active && <ChevronRight className="a-nav__chev" />}
        </Link>
      );
    });

  return (
    <div className={`a-root${open ? " is-open" : ""}`}>
      {/* Mobile topbar */}
      <header className="a-topbar">
        <div className="a-topbar__brand">
          <span className="a-topbar__logo">
            <LogoMark />
          </span>
          <span className="a-topbar__title">Admin</span>
        </div>
        <button
          type="button"
          className="a-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <MenuIcon />}
        </button>
      </header>

      <div className="a-scrim" onClick={() => setOpen(false)} />

      {/* Sidebar */}
      <aside className="a-sidebar">
        <div className="a-sidebar__brand">
          <Link href="/admin" className="a-sidebar__logo">
            <LogoMark />
          </Link>
          <div className="a-sidebar__brand-text">
            <span className="a-sidebar__brand-name">Ship Crew Agency</span>
            <span className="a-sidebar__brand-sub">Admin</span>
          </div>
        </div>

        <nav className="a-nav">
          <p className="a-nav__label">Menu</p>
          {nav(() => setOpen(false))}
        </nav>

        <div className="a-sidebar__foot">
          <div className="a-sidebar__user">
            <span className="a-sidebar__avatar">{initial}</span>
            <div className="a-sidebar__user-meta">
              <div className="a-sidebar__user-email">{userEmail}</div>
              <div className="a-sidebar__user-role">Administrator</div>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="a-sidebar__foot-btn"
          >
            <ExternalLink />
            View site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="a-sidebar__foot-btn a-sidebar__foot-btn--danger"
            >
              <LogOut />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="a-main">
        <div className="a-main__inner">{children}</div>
      </main>
    </div>
  );
}
