/** @format */

// Every motion-token ease must reach GSAP as an ease GSAP can parse.
// GSAP silently falls back to power1.out on an unparseable ease (e.g. a CSS
// cubic-bezier() string), so a missing mapping would never throw at runtime.

import assert from "node:assert/strict";
import gsap from "gsap";
import {
  motionTokens,
  motion,
  GSAP_EASE,
  ANIMATION_DEFAULTS,
} from "../../js/choreography/config/ix/motion.js";

const parses = (name) => typeof gsap.parseEase(name) === "function";

for (const token of Object.keys(motionTokens.ease)) {
  assert.ok(token in GSAP_EASE, `GSAP_EASE has no entry for token "${token}"`);
  assert.ok(
    parses(motion.ease(token)),
    `motion.ease("${token}") → "${motion.ease(token)}" doesn't parse in GSAP`,
  );
}

for (const [key, name] of Object.entries(ANIMATION_DEFAULTS.ease)) {
  assert.ok(
    parses(name),
    `ANIMATION_DEFAULTS.ease.${key} → "${name}" doesn't parse`,
  );
}

assert.equal(
  motion.ease("missing"),
  GSAP_EASE.standard,
  "unknown token falls back to standard",
);

console.log(
  `motion-eases: ${Object.keys(motionTokens.ease).length} tokens map to GSAP eases ✓`,
);
