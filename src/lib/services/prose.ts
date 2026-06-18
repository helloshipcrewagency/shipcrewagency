// Branded "prose" stylesheet applied automatically to service pages written in
// the visual editor (pages with no custom CSS). It styles plain semantic HTML +
// a few .svc-* helpers so a non-technical author gets an on-brand page without
// writing any code. Scoped under .legacy-svc.svc-prose so it never touches the
// 6 existing bespoke pages (which carry their own CSS).

export const SERVICE_PROSE_CSS = `/* ============================================================
   Ship Crew Agency — "svc-prose" stylesheet
   Scope: <div class="legacy-svc svc-prose"> … </div>
   Light theme. Barlow Condensed (headings) + Inter (body).
   Every selector prefixed with .legacy-svc.svc-prose
   ============================================================ */

/* ---- Reading column & base rhythm ---- */
.legacy-svc.svc-prose {
  max-width: 860px;
  margin: 0 auto;
  padding: 72px 28px 96px;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 17px;
  line-height: 1.7;
  color: #0b2a2e;
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  word-wrap: break-word;
}

.legacy-svc.svc-prose *,
.legacy-svc.svc-prose *::before,
.legacy-svc.svc-prose *::after {
  box-sizing: border-box;
}

.legacy-svc.svc-prose > *:first-child {
  margin-top: 0;
}

.legacy-svc.svc-prose > *:last-child {
  margin-bottom: 0;
}

/* ---- H1: confident hero heading with gold accent bar ---- */
.legacy-svc.svc-prose h1 {
  font-family: "Barlow Condensed", "Inter", sans-serif;
  font-weight: 700;
  font-size: clamp(2.6rem, 6vw, 3.75rem);
  line-height: 1.04;
  letter-spacing: -0.01em;
  color: #07343a;
  margin: 0 0 0.5em;
  padding-bottom: 0.32em;
  position: relative;
  text-wrap: balance;
}

.legacy-svc.svc-prose h1::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 76px;
  height: 5px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0a93b 0%, #d68a1c 100%);
}

/* ---- Lead / subtitle paragraph straight after the H1 ---- */
.legacy-svc.svc-prose .svc-lead,
.legacy-svc.svc-prose h1 + p {
  font-size: clamp(1.18rem, 2.4vw, 1.4rem);
  line-height: 1.55;
  font-weight: 400;
  color: #0b5c66;
  margin: 0 0 1.9em;
  max-width: 70ch;
}

/* ---- H2: teal, Barlow Condensed, small gold underline ---- */
.legacy-svc.svc-prose h2 {
  font-family: "Barlow Condensed", "Inter", sans-serif;
  font-weight: 700;
  font-size: clamp(1.9rem, 4vw, 2.35rem);
  line-height: 1.12;
  letter-spacing: -0.005em;
  color: #0e6e78;
  margin: 2.2em 0 0.7em;
  padding-bottom: 0.28em;
  position: relative;
}

.legacy-svc.svc-prose h2::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 48px;
  height: 4px;
  border-radius: 4px;
  background: #f0a93b;
}

/* ---- H3: slightly smaller teal heading ---- */
.legacy-svc.svc-prose h3 {
  font-family: "Barlow Condensed", "Inter", sans-serif;
  font-weight: 600;
  font-size: clamp(1.45rem, 3vw, 1.7rem);
  line-height: 1.2;
  color: #0b5c66;
  margin: 1.8em 0 0.55em;
}

.legacy-svc.svc-prose h2 + h3,
.legacy-svc.svc-prose h1 + h2 {
  margin-top: 1.1em;
}

/* ---- Body paragraphs ---- */
.legacy-svc.svc-prose p {
  margin: 0 0 1.25em;
}

.legacy-svc.svc-prose strong,
.legacy-svc.svc-prose b {
  font-weight: 700;
  color: #07343a;
}

.legacy-svc.svc-prose em,
.legacy-svc.svc-prose i {
  font-style: italic;
}

.legacy-svc.svc-prose small {
  font-size: 0.85em;
  color: #4a6a6e;
}

/* ---- Links ---- */
.legacy-svc.svc-prose a {
  color: #138a93;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid rgba(19, 138, 147, 0.32);
  transition: color 0.18s ease, border-color 0.18s ease;
}

.legacy-svc.svc-prose a:hover,
.legacy-svc.svc-prose a:focus-visible {
  color: #0b5c66;
  border-bottom-color: #0b5c66;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ---- Lists ---- */
.legacy-svc.svc-prose ul,
.legacy-svc.svc-prose ol {
  margin: 0 0 1.4em;
  padding: 0;
  list-style: none;
}

.legacy-svc.svc-prose li {
  position: relative;
  padding-left: 1.85em;
  margin: 0 0 0.6em;
  line-height: 1.62;
}

.legacy-svc.svc-prose li:last-child {
  margin-bottom: 0;
}

/* Unordered: gold check mark in a soft teal-tinted disc */
.legacy-svc.svc-prose ul > li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.28em;
  width: 1.15em;
  height: 1.15em;
  border-radius: 50%;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3.5 8.5l2.6 2.6L12.5 5' stroke='%23d68a1c' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
    center / 0.78em 0.78em no-repeat,
    #fbeacb;
}

/* Ordered: teal counter numbers */
.legacy-svc.svc-prose ol {
  counter-reset: svc-ol;
}

.legacy-svc.svc-prose ol > li {
  counter-increment: svc-ol;
}

.legacy-svc.svc-prose ol > li::before {
  content: counter(svc-ol);
  position: absolute;
  left: 0;
  top: 0.05em;
  width: 1.45em;
  height: 1.45em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Barlow Condensed", "Inter", sans-serif;
  font-weight: 700;
  font-size: 0.92em;
  line-height: 1;
  color: #0e6e78;
  background: #e3eeed;
  border-radius: 50%;
}

/* Nested lists */
.legacy-svc.svc-prose li > ul,
.legacy-svc.svc-prose li > ol {
  margin: 0.55em 0 0.2em;
}

/* ---- Blockquote ---- */
.legacy-svc.svc-prose blockquote {
  margin: 1.8em 0;
  padding: 1.1em 1.5em;
  border-left: 5px solid #f0a93b;
  border-radius: 0 12px 12px 0;
  background: #f2f7f6;
  color: #0b3b41;
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.6;
}

.legacy-svc.svc-prose blockquote p:last-child {
  margin-bottom: 0;
}

.legacy-svc.svc-prose blockquote cite {
  display: block;
  margin-top: 0.7em;
  font-style: normal;
  font-weight: 600;
  font-size: 0.92rem;
  color: #0e6e78;
}

/* ---- Images ---- */
.legacy-svc.svc-prose img {
  display: block;
  width: 100%;
  height: auto;
  margin: 2em 0;
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(7, 52, 58, 0.14);
}

/* ---- Horizontal rule ---- */
.legacy-svc.svc-prose hr {
  border: 0;
  height: 1px;
  margin: 2.8em 0;
  background: linear-gradient(90deg, rgba(14, 110, 120, 0) 0%, rgba(14, 110, 120, 0.35) 50%, rgba(14, 110, 120, 0) 100%);
}

/* ---- Tables ---- */
.legacy-svc.svc-prose table {
  width: 100%;
  margin: 2em 0;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.96rem;
  border: 1px solid #d9e6e4;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(7, 52, 58, 0.06);
}

.legacy-svc.svc-prose thead th {
  background: #0e6e78;
  color: #ffffff;
  font-family: "Barlow Condensed", "Inter", sans-serif;
  font-weight: 600;
  font-size: 1.04rem;
  letter-spacing: 0.01em;
  text-align: left;
}

.legacy-svc.svc-prose th,
.legacy-svc.svc-prose td {
  padding: 0.82em 1.05em;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid #e4eeec;
}

.legacy-svc.svc-prose tbody tr:nth-child(even) {
  background: #f2f7f6;
}

.legacy-svc.svc-prose tbody tr:last-child td {
  border-bottom: 0;
}

.legacy-svc.svc-prose tbody td strong {
  color: #0b5c66;
}

/* Responsive table scroll on narrow screens */
.legacy-svc.svc-prose .svc-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 2em 0;
}

.legacy-svc.svc-prose .svc-table-wrap table {
  margin: 0;
  min-width: 480px;
}

/* ---- Call-to-action buttons ---- */
.legacy-svc.svc-prose .svc-btn {
  display: inline-block;
  margin: 0.4em 0.5em 0.4em 0;
  padding: 0.85em 1.9em;
  font-family: "Barlow Condensed", "Inter", sans-serif;
  font-weight: 700;
  font-size: 1.12rem;
  letter-spacing: 0.02em;
  line-height: 1.1;
  text-align: center;
  text-decoration: none;
  color: #07343a;
  background: #f0a93b;
  border: 2px solid #f0a93b;
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(240, 169, 59, 0.32);
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease;
}

.legacy-svc.svc-prose .svc-btn:hover,
.legacy-svc.svc-prose .svc-btn:focus-visible {
  background: #d68a1c;
  border-color: #d68a1c;
  color: #07343a;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(214, 138, 28, 0.38);
}

.legacy-svc.svc-prose .svc-btn:active {
  transform: translateY(0);
  box-shadow: 0 5px 14px rgba(214, 138, 28, 0.32);
}

/* Outline variant */
.legacy-svc.svc-prose .svc-btn--outline {
  color: #0e6e78;
  background: transparent;
  border-color: #0e6e78;
  box-shadow: none;
}

.legacy-svc.svc-prose .svc-btn--outline:hover,
.legacy-svc.svc-prose .svc-btn--outline:focus-visible {
  color: #ffffff;
  background: #0e6e78;
  border-color: #0e6e78;
  box-shadow: 0 8px 20px rgba(14, 110, 120, 0.28);
}

/* ---- Feature grid + cards ---- */
.legacy-svc.svc-prose .svc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin: 2.2em 0;
}

.legacy-svc.svc-prose .svc-card {
  padding: 1.6rem 1.5rem;
  background: #ffffff;
  border: 1px solid #dfeae8;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(7, 52, 58, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.legacy-svc.svc-prose .svc-card:hover {
  transform: translateY(-3px);
  border-color: #b9d8d6;
  box-shadow: 0 16px 34px rgba(7, 52, 58, 0.12);
}

.legacy-svc.svc-prose .svc-card > *:first-child {
  margin-top: 0;
}

.legacy-svc.svc-prose .svc-card > *:last-child {
  margin-bottom: 0;
}

.legacy-svc.svc-prose .svc-card h3 {
  margin: 0 0 0.5em;
  font-size: 1.32rem;
  color: #0e6e78;
}

.legacy-svc.svc-prose .svc-card p {
  font-size: 0.97rem;
  line-height: 1.6;
  color: #2c4a4e;
}

.legacy-svc.svc-prose .svc-card p:last-child {
  margin-bottom: 0;
}

/* ---- Focus visibility (accessibility) ---- */
.legacy-svc.svc-prose a:focus-visible,
.legacy-svc.svc-prose .svc-btn:focus-visible {
  outline: 3px solid rgba(56, 179, 186, 0.55);
  outline-offset: 3px;
}

/* ---- Responsive: tablet ---- */
@media (max-width: 768px) {
  .legacy-svc.svc-prose {
    padding: 56px 22px 72px;
  }

  .legacy-svc.svc-prose h2 {
    margin-top: 1.9em;
  }
}

/* ---- Responsive: phone ---- */
@media (max-width: 640px) {
  .legacy-svc.svc-prose {
    padding: 44px 18px 60px;
    font-size: 16px;
    line-height: 1.65;
  }

  .legacy-svc.svc-prose h1 {
    font-size: 2.3rem;
  }

  .legacy-svc.svc-prose h1::after {
    width: 60px;
    height: 4px;
  }

  .legacy-svc.svc-prose .svc-lead,
  .legacy-svc.svc-prose h1 + p {
    font-size: 1.12rem;
  }

  .legacy-svc.svc-prose h2 {
    font-size: 1.75rem;
  }

  .legacy-svc.svc-prose h3 {
    font-size: 1.35rem;
  }

  .legacy-svc.svc-prose blockquote {
    padding: 0.9em 1.15em;
    font-size: 1.02rem;
  }

  .legacy-svc.svc-prose img {
    border-radius: 12px;
    margin: 1.5em 0;
  }

  .legacy-svc.svc-prose table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }

  .legacy-svc.svc-prose .svc-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .legacy-svc.svc-prose .svc-btn {
    display: block;
    width: 100%;
    margin: 0.5em 0;
  }
}

/* ---- Reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  .legacy-svc.svc-prose * {
    transition: none !important;
  }
}`;
