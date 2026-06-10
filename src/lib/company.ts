// Central, language-neutral company facts. Addresses, phone numbers, emails,
// the manning licence and map links read the same in every language edition,
// so they live here — the dictionaries only own the translated labels around
// them. Keeping one source of truth avoids the two editions drifting apart.

export const COMPANY = {
  licence: "MLA-0108, MLC 2006",
  address:
    "Kazi Plaza (2nd Floor), 517/A, S.K Mujib Road, Chattogram 4100, Bangladesh",
  phones: ["+880 1626 366030", "+880 1673 441245"],
  landline: "+880 2334 419606",
  fax: "+880 2334 419606",
  emails: ["crewing.cssl@gmail.com", "info@shipcrewagency.com"],
  /** primary number for one-tap "call us" / "speak with a specialist" buttons */
  callTel: "+8801626366030",
  /** WhatsApp number in wa.me form — country code + number, digits only */
  whatsapp: "8801626366030",
};

// Exact office coordinates — Compass Shipping Service Limited, Chattogram.
const MAP_LAT = "22.3358863";
const MAP_LNG = "91.8126155";

/** Keyless Google Maps embed (no API key). Labels follow the page language. */
export function companyMapEmbed(lang: "en" | "zh"): string {
  const hl = lang === "zh" ? "zh-CN" : "en";
  return `https://www.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=16&hl=${hl}&output=embed`;
}

/** Full Google Maps place link (opens the office in a new tab). */
export const COMPANY_MAP_LINK =
  "https://www.google.com/maps/place/Compass+Shipping+Service+Limited/@22.3358863,91.8126155,17z";

/** Pre-filled WhatsApp chat link (wa.me) — the message follows the page language. */
export function whatsappHref(lang: "en" | "zh"): string {
  const text =
    lang === "zh"
      ? "您好，环球船员管理，我想咨询船员配备需求。"
      : "Hello Ship Crew Agency, I'd like to discuss a crew requirement.";
  const num = COMPANY.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

/** Company brochure — hosted on the client's Google Drive. */
export const BROCHURE_URL =
  "https://drive.google.com/file/d/1znu_-mH-EiXCek6uT0lpO43CYxN3kNUP/view?usp=drive_link";
