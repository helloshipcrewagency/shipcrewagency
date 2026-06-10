"use client";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Icon } from "@/components/icons";
import { whatsappHref } from "@/lib/company";
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

  const waHref = whatsappHref(lang);

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
