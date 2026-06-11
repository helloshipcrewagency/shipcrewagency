// Slug -> extracted service-page body (HTML string), per language.
import { body as b0 } from "./crew-manning";
import { body as b1 } from "./seafarer-recruitment";
import { body as b2 } from "./crew-replacement";
import { body as b3 } from "./crew-change";
import { body as b4 } from "./offshore-manning";
import { body as b5 } from "./emergency-crew";

import { body as z0 } from "./crew-manning.zh";
import { body as z1 } from "./seafarer-recruitment.zh";
import { body as z2 } from "./crew-replacement.zh";
import { body as z3 } from "./crew-change.zh";
import { body as z4 } from "./offshore-manning.zh";
import { body as z5 } from "./emergency-crew.zh";

export const SERVICE_BODIES: Record<string, string> = {
  "crew-manning": b0,
  "seafarer-recruitment": b1,
  "crew-replacement": b2,
  "crew-change": b3,
  "offshore-manning": b4,
  "emergency-crew": b5,
};

export const SERVICE_BODIES_ZH: Record<string, string> = {
  "crew-manning": z0,
  "seafarer-recruitment": z1,
  "crew-replacement": z2,
  "crew-change": z3,
  "offshore-manning": z4,
  "emergency-crew": z5,
};
