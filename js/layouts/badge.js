/**
 * Standalone init for pages that do not load AnimationDirector.
 * Pages that include choreography-script.njk with choreography on (home, work,
 * contact) set `window.__enableChoreography` and load the Director, which
 * instantiates BadgeManager itself — so this module stands down there
 * rather than racing it for the header. It handles all other pages.
 */

import BadgeManager from "../choreography/managers/BadgeManager/BadgeManager.js";

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotionHandler = { isReducedMotion: () => mq.matches };

if (!window.__enableChoreography) {
  new BadgeManager({ reducedMotionHandler });
}
