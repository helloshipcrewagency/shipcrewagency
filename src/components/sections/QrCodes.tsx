"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { QR_CODES } from "@/lib/media";
import { BrandMark } from "@/components/ui/BrandMarks";

const BRANDS = ["whatsapp", "wechat", "dingtalk"];

export function QrCodes({ items }: { items: string[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="qr-grid">
        {QR_CODES.map((src, i) => (
          <button
            type="button"
            className="qr-card"
            key={src}
            onClick={() => setOpen(i)}
            aria-label={`Enlarge ${items[i]} QR code`}
          >
            <div className="qr-card__img">
              <Image src={src} alt={items[i]} width={170} height={170} />
            </div>
            <span className="qr-card__label">
              <BrandMark name={BRANDS[i]} />
              {items[i]}
            </span>
          </button>
        ))}
      </div>

      {open !== null &&
        createPortal(
          <div
            className="qr-lightbox"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(null)}
          >
            <div
              className="qr-lightbox__inner"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="qr-lightbox__close"
                onClick={() => setOpen(null)}
                aria-label="Close"
              >
                ×
              </button>
              <span className="qr-lightbox__label">
                <BrandMark name={BRANDS[open]} size={22} />
                {items[open]}
              </span>
              <Image
                src={QR_CODES[open]}
                alt={items[open]}
                width={440}
                height={440}
                className="qr-lightbox__img"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
