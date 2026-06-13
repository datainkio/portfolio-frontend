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

import { createSweepIn, createSweepOut } from "./sweep.js";
import { createFadeIn, createFadeOut } from "./fade.js";
import {
  init as initReduced,
  buildIntro as buildIntroReduced,
  buildOutro as buildOutroReduced,
} from "./reduced.js";

export const BIO_VARIANT_FACTORIES = Object.freeze({
  sweep: {
    buildIntro: createSweepIn,
    buildOutro: createSweepOut,
  },
  fade: {
    buildIntro: createFadeIn,
    buildOutro: createFadeOut,
  },
  reduced: {
    init: initReduced,
    buildIntro: buildIntroReduced,
    buildOutro: buildOutroReduced,
  },
});
