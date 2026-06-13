import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_INTRO } from "../../config/ix/motion/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Bio Reduced Motion
 * This defines the reduced motion variant for the bio section.
 */

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

/**
 * Use init to style elements that won't work without animation (e.g. gels)
 */
export function init(view, gelManager) {
  const gel = gelManager?.getGel?.("gel_bio") ?? null;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });
  if (gel?.view) {
    gsap.set(gel.view, {
      width: view.getBoundingClientRect().width + "px",
      left: view.getBoundingClientRect().left + "px",
    });
    gel.refresh();
  }
  return tl;
}

export function buildIntro(view, gelManager) {
  return gsap.timeline();
}

export function buildOutro(view, gelManager) {
  return gsap.timeline();
}
