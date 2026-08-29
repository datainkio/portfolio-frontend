/**
 * Standalone init for pages that do not load AnimationDirector.
 * On choreography pages (home), AnimationDirector instantiates GlobalHeaderManager
 * directly with a full ReducedMotionHandler. This module handles all other pages.
 */

import GlobalHeaderManager from "../choreography/managers/GlobalHeaderManager/GlobalHeaderManager.js";

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotionHandler = { isReducedMotion: () => mq.matches };

new GlobalHeaderManager({ reducedMotionHandler });
