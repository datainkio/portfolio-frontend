/**
 * Hero-Motion Molecule
 *
 * Animation variant factories for the hero section. Each variant provides
 * buildIntro and buildOutro factory functions that return GSAP timelines.
 * HeroAnimations.js selects the active variant via SECTION_OVERRIDES.hero
 * in config/ix/profiles/profiles.js.
 *
 *   split  - Intro fades gel_tagline in, then GSAP SplitText on the header and
 *            subheader. No landing phase. Requires SplitText plugin and gelManager.
 *   reduced - Nothing fancy.
 *   sweep  — Header fade+lift (its gel wipe was retired on 2026-11-24).
 *   fade   — Simple header fade+lift. No gel dependency.
 */

import { intro as introSplit } from "./split.js";
import { createSweepIn, createSweepOut } from "./sweep.js";
import { initFade, createFadeIn, createFadeOut } from "./fade.js";
import {
  init as initReduced,
  buildIntro as buildIntroReduced,
  buildOutro as buildOutroReduced,
} from "./reduced.js";

export const HERO_VARIANT_FACTORIES = Object.freeze({
  split: {
    buildIntro: introSplit,
    // Outro disabled — omitting buildOutro makes HeroAnimations._buildOutro fall
    // back to the base class's empty timeline, which HeroTriggers._bindOutroPin
    // reads as "no motion" and skips the hero-outro-pin entirely (no pin, no
    // scrub). split.js `outro()` is left intact.
    // To re-enable: restore the `outro as outroSplit` import and
    // `buildOutro: outroSplit,` here.
  },
  sweep: {
    buildIntro: createSweepIn,
    buildOutro: createSweepOut,
  },
  fade: {
    init: initFade,
    buildIntro: createFadeIn,
    buildOutro: createFadeOut,
  },
  reduced: {
    init: initReduced,
    buildIntro: buildIntroReduced,
    buildOutro: buildOutroReduced,
  },
});
