/**
 * Bio-Motion Molecule
 *
 * Animation variant factories for the bio section. Each variant provides
 * buildIntro and buildOutro factory functions that return GSAP timelines.
 * BioAnimations.js selects the active variant via SECTION_OVERRIDES.bio
 * in config/ix/profiles/profiles.js.
 *
 *   sweep  — Gel wipe (scaleX 0→1) followed by header fade+lift. Requires gelManager.
 *   fade   — Simple header fade+lift. No gel dependency.
 */

import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { createSweepIn, createSweepOut } from "./sweep.js";
import { createFadeIn, createFadeOut } from "./fade.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

const killST = (tl) => {
  tl?.scrollTrigger?.kill(true);
  tl?.kill();
};

export const BIO_VARIANT_FACTORIES = Object.freeze({
  sweep: {
    buildIntro: createSweepIn,
    buildOutro: createSweepOut,
  },
  fade: {
    buildIntro: createFadeIn,
    buildOutro: createFadeOut,
  },
});
