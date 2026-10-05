/** @format */

/**
 * Choreography Config Barrel
 *
 * Re-exports everything in config/ for convenience. Most modules deep-import
 * the specific file instead (e.g. ix/motion.js, ix/presets/hero.js); either
 * works.
 *
 * - contracts/: shared names — EVENTS, SELECTORS (+ *_SELECTORS), TIMELINE_IDS
 * - ix/: breakpoints, motion tokens/defaults, section presets (ix/presets/),
 *   SCROLL_DEFAULTS, motion profiles
 * - displays/: decorative display defaults (ruler)
 *
 * Section ScrollTrigger configs live in each organism's *Triggers.js, not here.
 * See README.config.md for placement rules.
 *
 * Usage pattern:
 * import { EVENTS, motion, RULER_DEFAULTS } from "./index.js";
 *
 * @fileoverview Project-specific choreography runtime configuration exports.
 */

export * from "../displays/displays.js";
export * from "../contracts/contracts.js";
export * from "../ix/ix.js";
