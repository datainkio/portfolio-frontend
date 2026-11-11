import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_INTRO } from "../../config/ix/presets/hero.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { HEADING_GEL_ID } from "./heading-gel.js";
import { TAGLINE_GEL_ID } from "./tagline-gel.js";

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
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const tl = gsap.timeline({ id: TIMELINE_IDS.landing });
  // Land at the sequence's completed state: both hero gels visible at rest.
  // GelAnimationManager parks every gel at autoAlpha 0. Both are
  // `absolute inset-0` in markup, so they are full-bleed without JS geometry.
  [HEADING_GEL_ID, TAGLINE_GEL_ID].forEach((id) => {
    const gel = gelManager?.getGel?.(id) ?? null;
    if (!gel?.view) return;
    gsap.set(gel.view, { autoAlpha: 1 });
    gel.refresh();
  });
  return tl;
}

export function buildIntro(view, gelManager) {
  return gsap.timeline();
}

export function buildOutro(view, gelManager) {
  return gsap.timeline();
}
