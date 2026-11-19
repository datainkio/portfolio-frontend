import { gsap } from "/assets/js/choreography/system/gsap.js";
import { HERO_INTRO } from "../../config/ix/presets/hero.js";

/**
 * Hero Tagline Gel
 *
 * `gel_tagline` is a second hero gel, rendered in `#sizzle-background` beside
 * `gel_hero`. It is full-bleed by default (`absolute inset-0`), so it needs no
 * geometry — only an entrance. GelAnimationManager parks every gel at
 * autoAlpha 0, so the fade here is also what makes it visible.
 */

export const TAGLINE_GEL_ID = "gel_tagline";

export const getTaglineGelEl = (gelManager) =>
  gelManager?.getGel?.(TAGLINE_GEL_ID)?.view ?? null;

/**
 * Fade `gel_tagline` from opacity 0 to 1 at `position` on `tl`.
 * `fromTo` renders its start at build time, so the gel is hidden before the
 * intro plays. No-ops when the gel is missing (e.g. a page without the sizzle
 * background).
 *
 * @param {gsap.core.Timeline} tl Timeline to append to.
 * @param {object|null} gelManager GelAnimationManager instance.
 * @param {number|string} [position=0] Timeline position.
 * @returns {boolean} Whether a tween was added.
 */
export function addTaglineGelFade(tl, gelManager, position = 0) {
  const el = getTaglineGelEl(gelManager);
  if (!el) return false;
  tl.fromTo(
    el,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: HERO_INTRO.taglineDuration,
      ease: HERO_INTRO.ease.out,
    },
    position,
  );
  return true;
}
