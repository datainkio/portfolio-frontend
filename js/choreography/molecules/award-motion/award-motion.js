/**
 * Award-Motion Molecule
 *
 * Animation variant factories for the award section. Each variant provides
 * buildIntro and buildOutro factory functions that return GSAP timelines.
 * AwardAnimations.js selects the active variant via SECTION_OVERRIDES.award
 * in config/ix/profiles/profiles.js.
 *
 *   slide  — Gel wipe (scaleX 0→1) followed by header fade+lift. Requires gelManager.
 *   fade   — Simple header fade+lift. No gel dependency.
 */

import { init, createSlideIn, createSlideOut } from "./slide.js";
import {
  init as initReduced,
  buildIntro as buildIntroReduced,
  buildOutro as buildOutroReduced,
} from "./reduced.js";

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
