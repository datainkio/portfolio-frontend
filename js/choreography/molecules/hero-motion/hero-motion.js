/**
 * Hero-Motion Molecule
 *
 * Animation variant factories for the hero section, mirroring the award-motion
 * pattern. Each variant provides init (landing), buildIntro, and buildOutro
 * factory functions that return GSAP timelines. HeroAnimations selects the
 * active variant via SECTION_OVERRIDES.hero in config/ix/profiles/profiles.js.
 *
 *   reveal  — Tagline word split-reveal (lifecycle landing) + gel transform
 *             driven by the pinned scrub trigger. The full-motion default.
 *   reduced — Low-vestibular: gentle tagline fade only, gel left at its CSS
 *             rest state, no pin / scrub / large transforms. Intro and outro
 *             are empty because the `reduced` profile disables the triggers
 *             that would drive them. Selected by the `reduced` motion profile.
 */

import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_LANDING, HERO_INTRO } from "../../config/ix/motion/motion.js";
import { ACCESSIBILITY_SETTINGS } from "../../config/ix/accessibility/accessibility.js";
import { init, createRaiseShutter, createLowerShutter } from "./shutter.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";

const HERO_EL_ATTR = "data-hero-el";

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

/* ------------------------------------------------------------------ reveal */

/* ----------------------------------------------------------------- reduced */

export const HERO_VARIANT_FACTORIES = Object.freeze({
  shutter: {
    init: init,
    buildIntro: createRaiseShutter,
    buildOutro: createLowerShutter,
  },
  reduced: {
    init: init,
    buildIntro: createRaiseShutter,
    buildOutro: createLowerShutter,
  },
});
