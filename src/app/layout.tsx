import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { siteUrl } from "@/lib/seo";
import "./globals.css";
import "./sections.css";
import "./theme.css";

const SITE_URL = siteUrl();

// Self-hosted, optimized fonts (no render-blocking external CSS).
// Headings: Plus Jakarta Sans (modern, confident). Body: Inter (clean, readable).
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-src",
  display: "swap",
  preload: true,
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-src",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ship Crew Agency — Global Ship Crew Manning Agency",
    template: "%s",
  },
  description:
    "Ship Crew Agency is a trusted global ship crew manning agency with 17 years experience supplying STCW-certified seafarers worldwide.",
  applicationName: "Ship Crew Agency",
  authors: [{ name: "Ship Crew Agency" }],
  creator: "Ship Crew Agency",
  publisher: "Ship Crew Agency",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "UWn8WTsfedY4ZlIqyT1P54SBIpvwAalQO0GuPEcvh0E",
  },
  openGraph: { type: "website", siteName: "Ship Crew Agency" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e6e78",
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const lang = h.get("x-lang") === "zh" ? "zh-CN" : "en";
  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Ship Crew Agency — Maritime Knowledge Hub"
          href="/feed.xml"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('scma-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
