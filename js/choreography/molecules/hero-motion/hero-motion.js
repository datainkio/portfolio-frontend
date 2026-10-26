/**
 * Hero-Motion Molecule
 *
 * Animation variant factories for the hero section. Each variant provides
 * buildIntro and buildOutro factory functions that return GSAP timelines.
 * HeroAnimations.js selects the active variant via SECTION_OVERRIDES.hero
 * in config/ix/profiles/profiles.js.
 *
 *   split  - Gel band at rest, full-bleed (landing); intro wipes the title gel
 *            across the h1, then GSAP SplitText on the header and
 *            subheader (intro). Requires SplitText plugin and gelManager.
 *   reduced - Nothing fancy.
 *   sweep  — Gel wipe (scaleX 0→1) followed by header fade+lift. Requires gelManager.
 *   fade   — Simple header fade+lift. No gel dependency.
 */

import { intro as introSplit } from "./split.js";
import { buildHeadingGelRest } from "./heading-gel.js";
import { attachTitleGel } from "./title-gel.js";
import { createSweepIn, createSweepOut } from "./sweep.js";
import { initFade, createFadeIn, createFadeOut } from "./fade.js";
import {
  init as initReduced,
  buildIntro as buildIntroReduced,
  buildOutro as buildOutroReduced,
} from "./reduced.js";

export const HERO_VARIANT_FACTORIES = Object.freeze({
  split: {
    // Landing phase: the heading gel parked full-bleed at rest (no entrance),
    // plus the title gel parked collapsed on the h1 for the intro's wipe.
    init: (view, gelManager) => {
      attachTitleGel(view, gelManager);
      return buildHeadingGelRest(view, gelManager);
    },
    buildIntro: introSplit,
    // Outro disabled — omitting buildOutro makes HeroAnimations._buildOutro fall
    // back to the base class's empty timeline, which HeroTriggers._bindOutroPin
    // reads as "no motion" and skips the hero-outro-pin entirely (no pin, no
    // scrub, no heading-gel-sync suspend). split.js `outro()` is left intact.
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
