/**
 * ---
 * aix:
 *   id: frontend.js.choreography.config.index
 *   role: Frontend runtime module: js/choreography/config/index.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - config
 *     - index
 * ---
 */
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

export * from "./contracts/events.js";
export * from "./contracts/paths.js";
export * from "./contracts/selectors.js";
export * from "./contracts/labels.js";
export * from "./contracts/timelines.js";

export * from "./displays/arrangements.js";
export * from "./displays/ruler.js";
export * from "./displays/printermarks.js";
export * from "./displays/leader-lines.js";

export * from "./ix/accessibility.js";
export * from "./ix/motion.js";
export * from "./ix/scrolltriggers.js";
