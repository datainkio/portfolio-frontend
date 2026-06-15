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
 * TODO: The complexity of the choreography has grown past what a simple
 * barrel can effectively manage. Consider breaking this into more focused
 * barrels or reorganizing the configuration structure to maintain clarity and
 * ease of use.
 *
 * Usage pattern:
 * import { EVENTS, motion, RULER_DEFAULTS } from "./index.js";
 *
 * @fileoverview Project-specific choreography runtime configuration exports.
 */

export * from "../displays/displays.js";
export * from "../contracts/contracts.js";
export * from "../ix/ix.js";
