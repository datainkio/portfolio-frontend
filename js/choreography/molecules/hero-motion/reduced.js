import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_INTRO } from "../../config/ix/presets/hero.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Hero Reduced Motion
 * This defines the reduced motion variant for the hero section.
 */

const HERO_EL_ATTR = HERO_SELECTORS.elementAttribute;

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

/**
 * Use init to style elements that won't work without animation (e.g. gels)
 */
export function init(view, gelManager) {
  const gel = gelManager?.getGel?.("gel_hero") ?? null;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const tl = gsap.timeline({ id: TIMELINE_IDS.landing });
  if (gel?.view) {
    gsap.set(gel.view, {
      autoAlpha: 0,
      // width: view.getBoundingClientRect().width + "px",
      // left: view.getBoundingClientRect().left + "px",
      // transformOrigin: "bottom center",
      // scaleY: 0,
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
