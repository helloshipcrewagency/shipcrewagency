"use client";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Icon } from "@/components/icons";
import { COMPANY } from "@/lib/company";
import type { Lang } from "@/i18n";

export function FloatingActions({ lang = "en" }: { lang?: Lang }) {
  const [show, setShow] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const number = COMPANY.whatsapp.replace(/[^0-9]/g, "");
  const text =
    lang === "zh"
      ? "您好，环球船员管理，我想咨询船员配备需求。"
      : "Hello Ship Crew Agency, I'd like to discuss a crew requirement.";
  const waHref = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return (
    <>
      <a
        className="fab fab--whatsapp"
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <Icon name="whatsapp" />
      </a>

      <button
        className={`scroll-top ${show ? "show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        type="button"
      >
        <svg className="scroll-top__ring" viewBox="0 0 54 54">
          <circle className="scroll-top__track" cx="27" cy="27" r="24" />
          <motion.circle
            className="scroll-top__bar"
            cx="27"
            cy="27"
            r="24"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
        <span className="scroll-top__btn">
          <Icon name="arrow-up" />
        </span>
      </button>
    </>
  );
}
