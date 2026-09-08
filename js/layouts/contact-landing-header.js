/**
 * Integrate with AnimationDirector's ContactHeaderManager to animate the contact landing header on scroll.
 */

import ContactHeaderManager from "../choreography/managers/ContactHeaderManager/ContactHeaderManager.js";

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotionHandler = { isReducedMotion: () => mq.matches };

new ContactHeaderManager({ reducedMotionHandler });
