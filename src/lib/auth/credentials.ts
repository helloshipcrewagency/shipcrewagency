import "server-only";
import crypto from "node:crypto";

// Admin accounts for the private portal at /taslima.
// The primary account is overridable in production via env vars
// (ADMIN_EMAIL / ADMIN_PASSWORD_HASH); extra accounts are listed below.
//   1) admin@shipcrewagency.com  /  ShipCrew@2026
//   2) info@shipcrewagency.com   /  info@shipcrewagency@786#
// Generate a new salted hash with:  npm run hash-password "YourPassword"
const DEFAULT_EMAIL = "admin@shipcrewagency.com";
const DEFAULT_PASSWORD_HASH =
  "988b63cab9ae38cb3475f0aedc8c804d:09c6a181c5066b1a5345f74c51e813efcbe83230a790a40f1b15a77dd8f907a772ca0f7e7c71f318f9829f808b6e99d2f0b7fab90bc4e2aebfa946ae3d9c6f14";

interface Admin {
  email: string;
  passwordHash: string;
}

function admins(): Admin[] {
  return [
    {
      email: (process.env.ADMIN_EMAIL || DEFAULT_EMAIL).toLowerCase().trim(),
      passwordHash: process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH,
    },
    {
      email: "info@shipcrewagency.com",
      passwordHash:
        "6fde38ad5a4b7b03acf2654f8a136504:2f469b23b72386d4d251e4c842438b84680ca69e77c63e38f092aa092eaef44c5d223f0e1adbeeea5d11e6cddcaf94574af89b1b9e0c22ee12bd1c2fff82d4e0",
    },
  ];
}

/** The primary admin email (kept for backward compatibility). */
export function getAdminEmail(): string {
  return admins()[0].email;
}

function hashMatches(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  try {
    const derived = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hashHex, "hex");
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** True when the email/password pair matches ANY configured admin account. */
export function verifyCredentials(email: string, password: string): boolean {
  const normalized = email.toLowerCase().trim();
  const admin = admins().find((a) => a.email === normalized);
  if (!admin) return false;
  return hashMatches(password, admin.passwordHash);
}
