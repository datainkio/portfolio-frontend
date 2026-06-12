import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { AWARDS_INTRO } from "../../config/ix/motion/motion.js";
import { AWARD_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Award Reduced Motion
 * This defines the reduced motion variant for the awards section.
 * It assumes:
 * - Two gels: a backing sheet and a tint sheet, which together create the reveal effect.
 * - Content elements (context, header, subheading) that ride in on the sheets.
 * The slide-in motion has momentum in and friction out, with overlapping action for a natural feel.
 *
 */

const AWARD_EL_ATTR = AWARD_SELECTORS.elementAttribute;

const selectAwardEl = (view, name) =>
  view?.querySelector(`[${AWARD_EL_ATTR}="${name}"]`) ?? null;

/**
 * Use init to elements (e.g. gels) that won't work without animation
 */
export function init(view, gelManager) {
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const gel_tint = gelManager?.getGel?.("gel_awards_tint") ?? null;
  gsap.set(view, { mixBlendMode: "normal" });
  gsap.set([gel_backing?.view, gel_tint?.view], {
    display: "none",
  });
  return gsap.timeline({ id: TIMELINE_IDS.landing });
}

export function buildIntro(view, gelManager) {
  return gsap.timeline();
}

export function buildOutro(view, gelManager) {
  return gsap.timeline();
}
