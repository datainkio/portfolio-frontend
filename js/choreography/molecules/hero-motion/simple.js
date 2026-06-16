import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_LANDING, HERO_INTRO } from "../../config/ix/motion/motion.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Simple Hero Choreography
 *
 */

const HERO_EL_ATTR = HERO_SELECTORS.elementAttribute;

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

export function init(view) {
  const tl = gsap.timeline({ id: TIMELINE_IDS.landing });
  return tl;
}

export function createIntro(view) {
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });
  return tl;
}

export function createOutro(view) {
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  return tl;
}
