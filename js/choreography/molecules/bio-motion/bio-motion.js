/**
 * Bio-Motion Molecule
 *
 * Animation variant factories for the bio section. Each variant provides
 * buildIntro and buildOutro factory functions that return GSAP timelines.
 * BioAnimations.js selects the active variant via SECTION_OVERRIDES.bio
 * in config/ix/profiles/profiles.js.
 *
 *   split  - Gel band fly-in (landing), then GSAP SplitText on the header and
 *            subheader (intro). Requires SplitText plugin and gelManager.
 *   reduced - Nothing fancy.
 *   sweep  — Gel wipe (scaleX 0→1) followed by header fade+lift. Requires gelManager.
 *   fade   — Simple header fade+lift. No gel dependency.
 */

import { intro as introSplit } from "./split.js";
import { buildHeadingGelEntrance } from "./heading-gel.js";
import { createSweepIn, createSweepOut } from "./sweep.js";
import { initFade, createFadeIn, createFadeOut } from "./fade.js";
import {
  init as initReduced,
  buildIntro as buildIntroReduced,
  buildOutro as buildOutroReduced,
} from "./reduced.js";

export const BIO_VARIANT_FACTORIES = Object.freeze({
  split: {
    // Landing phase: the gel band's offscreen fly-in. LandingSequence awaits it
    // before playing the intro, so this beat gates the reveal.
    init: buildHeadingGelEntrance,
    buildIntro: introSplit,
    // Outro disabled — omitting buildOutro makes BioAnimations._buildOutro fall
    // back to the base class's empty timeline, which BioTriggers._bindOutroPin
    // reads as "no motion" and skips the bio-outro-pin entirely (no pin, no
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
