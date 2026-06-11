// Slug -> extracted English service-page body (HTML string).
import { body as b0 } from "./crew-manning";
import { body as b1 } from "./seafarer-recruitment";
import { body as b2 } from "./crew-replacement";
import { body as b3 } from "./crew-change";
import { body as b4 } from "./offshore-manning";
import { body as b5 } from "./emergency-crew";

export const SERVICE_BODIES: Record<string, string> = {
  "crew-manning": b0,
  "seafarer-recruitment": b1,
  "crew-replacement": b2,
  "crew-change": b3,
  "offshore-manning": b4,
  "emergency-crew": b5,
};
