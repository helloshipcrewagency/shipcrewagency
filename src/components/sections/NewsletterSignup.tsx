"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { Reveal } from "@/components/fx/Reveal";
import { getDict, type Lang } from "@/i18n";

type Status = "idle" | "submitting" | "success" | "error";

const PILL_ICONS: IconName[] = ["trending", "users", "shield"];

export function NewsletterSignup({ lang }: { lang: Lang }) {
  const n = getDict(lang).newsletter;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language: lang }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="newsletter section-pad">
      <div className="container container--sm">
        <Reveal>
          <div className="newsletter__inner">
            <div className="newsletter__badge">
              <Icon name="send" />
              {n.badge}
            </div>
            <h2 className="newsletter__title">
              {n.titleLead} <em className="shimmer">{n.titleEmphasis}</em>
            </h2>
            <p className="newsletter__sub">{n.sub}</p>

            {status === "success" ? (
              <div className="newsletter__success">
                <Icon name="check-circle" />
                <span>{n.success}</span>
              </div>
            ) : (
              <form className="newsletter__form" onSubmit={onSubmit}>
                <div className="newsletter__field">
                  <Icon name="mail" />
                  <input
                    type="email"
                    required
                    placeholder={n.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label={n.placeholder}
                  />
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={status === "submitting"}
                  >
                    <span>{status === "submitting" ? n.submitting : n.cta}</span>
                    <Icon name="send" />
                  </button>
                </div>
              </form>
            )}

            <div className="newsletter__pills">
              {n.pills.map((p, i) => (
                <span className="newsletter__pill" key={p}>
                  <Icon name={PILL_ICONS[i]} />
                  {p}
                </span>
              ))}
            </div>

            {status === "error" && <p className="newsletter__err">{n.error}</p>}
            <p className="newsletter__fine">{n.fine}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
