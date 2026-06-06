/**
 * ---
 * aix:
 *   id: frontend.js.layouts.work-landing-header
 *   role: Self-init entry point for WorkHeaderManager.
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
 * Integrate with AnimationDirector's WorkHeaderManager to animate the work landing header on scroll.
 */

import WorkHeaderManager from "../choreography/managers/WorkHeaderManager/WorkHeaderManager.js";

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotionHandler = { isReducedMotion: () => mq.matches };

new WorkHeaderManager({ reducedMotionHandler });
