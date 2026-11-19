/**
 * Standalone init for pages that do not load AnimationDirector.
 * Pages that include choreography-script.njk with choreography on (home, work,
 * contact) set `window.__enableChoreography` and load the Director, which
 * instantiates BadgeManager and BuildInfoManager itself — so this module stands
 * down there rather than racing it for the badge. It handles all other pages.
 */

import BadgeManager from "../choreography/managers/BadgeManager/BadgeManager.js";
import BuildInfoManager from "../choreography/managers/BuildInfoManager/BuildInfoManager.js";

const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotionHandler = { isReducedMotion: () => mq.matches };

if (!window.__enableChoreography) {
  new BadgeManager({ reducedMotionHandler });
  // The build info lives in the badge's dialog on every page.
  new BuildInfoManager({ reducedMotionHandler });
}
