/**
 * ---
 * aix:
 *   id: frontend.js.layouts.global-header
 *   role: Self-init entry point for GlobalHeaderManager on non-choreography pages.
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - header
 *     - scroll
 *     - gsap
 *     - layouts
 * ---
 */

/**
 * Standalone init for pages that do not load AnimationDirector.
 * On choreography pages (home), AnimationDirector instantiates GlobalHeaderManager
 * directly with a full ReducedMotionHandler. This module handles all other pages.
 */

import GlobalHeaderManager from "../choreography/system/GlobalHeaderManager.js";

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotionHandler = { isReducedMotion: () => mq.matches };

new GlobalHeaderManager({ reducedMotionHandler });
