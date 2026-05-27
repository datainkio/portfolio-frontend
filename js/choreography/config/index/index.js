/** @format */

/**
 * Choreography Config Barrel
 *
 * Single import surface for choreography configuration.
 *
 * Folder taxonomy:
 * - contracts/: Canonical shared terms used across modules (events, labels,
 *   selectors, paths, timeline ids). These define the project-wide vocabulary.
 * - ix/: Interaction design constants that tune behavior and motion
 *   (accessibility, motion tokens/defaults, scroll trigger defaults).
 * - displays/: Decorative display configuration and defaults used by visual
 *   ornamentation systems (arrangements, ruler, printer marks).
 *
 * Why this structure exists:
 * - Improves findability: engineers can locate config by intent quickly.
 * - Improves discoverability: folder names communicate purpose at a glance.
 * - Improves safety: contracts stay stable while IX/display tuning can evolve
 *   without changing shared terminology.
 *
 * Usage pattern:
 * import { EVENTS, motion, RULER_DEFAULTS } from "./index.js";
 *
 * @fileoverview Project-specific choreography runtime configuration exports.
 */

export * from "../contracts/events/events.js";
export * from "../contracts/paths/paths.js";
export * from "../contracts/selectors/selectors.js";
export * from "../contracts/labels/labels.js";
export * from "../contracts/timelines/timelines.js";

export * from "../displays/arrangements/arrangements.js";
export * from "../displays/ruler/ruler.js";
export * from "../displays/printermarks/printermarks.js";
export * from "../displays/leader-lines/leader-lines.js";

export * from "../ix/accessibility/accessibility.js";
export * from "../ix/breakpoints/breakpoints.js";
export * from "../ix/motion/motion.js";
export * from "../ix/scrolltriggers/scrolltriggers.js";
