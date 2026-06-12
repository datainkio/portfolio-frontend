/**
 * Award-Motion Molecule
 *
 * Animation variant factories for the award section. Each variant provides
 * buildIntro and buildOutro factory functions that return GSAP timelines.
 * AwardAnimations.js selects the active variant via SECTION_OVERRIDES.award
 * in config/ix/profiles/profiles.js.
 *
 *   sweep  — Gel wipe (scaleX 0→1) followed by header fade+lift. Requires gelManager.
 *   fade   — Simple header fade+lift. No gel dependency.
 */

import { AWARD_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { init, createSlideIn, createSlideOut } from "./slide.js";
import {
  init as initReduced,
  buildIntro as buildIntroReduced,
  buildOutro as buildOutroReduced,
} from "./reduced.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";

const AWARD_EL_ATTR = AWARD_SELECTORS.elementAttribute;

const selectAwardEl = (view, name) =>
  view?.querySelector(`[${AWARD_EL_ATTR}="${name}"]`) ?? null;

const killST = (tl) => {
  tl?.scrollTrigger?.kill(true);
  tl?.kill();
};

export const AWARD_VARIANT_FACTORIES = Object.freeze({
  slide: {
    init: init,
    buildIntro: createSlideIn,
    buildOutro: createSlideOut,
  },
  reduced: {
    init: initReduced,
    buildIntro: buildIntroReduced,
    buildOutro: buildOutroReduced,
  },
});
