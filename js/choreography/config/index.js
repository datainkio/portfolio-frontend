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
 * Site-Specific Choreography Runtime Configuration
 *
 * DOM selectors, asset paths, animation timing, and visual settings that are
 * UNIQUE to this project. Change these values when adapting the choreography
 * system to a different site.
 *
 * For event contracts, see events.js
 *
 * USAGE PATTERN:
 * import { SELECTORS, ANIMATION_DEFAULTS } from './index.js';
 *
 * // Find DOM elements
 * this.element = document.querySelector(SELECTORS.hero);
 *
 * // Use consistent animation settings
 * gsap.to(target, { duration: ANIMATION_DEFAULTS.duration });
 *
 * @fileoverview Project-specific runtime configuration values
 */

export * from "./accessibility.js";
export * from "./arrangements.js";
export * from "./events.js";
export * from "./motion.js";
export * from "./paths.js";
export * from "./ruler.js";
export * from "./scrolltriggers.js";
export * from "./selectors.js";
export * from "./labels.js";
