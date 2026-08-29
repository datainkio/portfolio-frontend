/**
 * Integrate with AnimationDirector's WorkHeaderManager to animate the work landing header on scroll.
 */

import WorkHeaderManager from "../choreography/managers/WorkHeaderManager/WorkHeaderManager.js";

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotionHandler = { isReducedMotion: () => mq.matches };

new WorkHeaderManager({ reducedMotionHandler });
