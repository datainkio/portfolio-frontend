import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_LANDING, HERO_INTRO } from "../../config/ix/motion/motion.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

/**
 * Hero Shutter Motion
 * This defines the "sheet of paper sliding across a surface" motion for the hero section.
 * It assumes:
 * - Two gels: a backing sheet and a tint sheet, which together create the reveal effect.
 * - Content elements (context, header, subheading) that ride in on the sheets.
 * The slide-in motion has momentum in and friction out, with overlapping action for a natural feel.
 *
 */

const HERO_EL_ATTR = HERO_SELECTORS.elementAttribute;

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

export function init(view) {
  const split = splitTagline(view);
  const tl = gsap.timeline({ id: TIMELINE_IDS.landing });
  tl.fromTo(
    split.words,
    { ...HERO_LANDING.from },
    { ...HERO_LANDING.to },
  ).addPause();
  return tl;
}

const splitByView = new WeakMap();

const revertSplit = (view) => {
  const prev = splitByView.get(view);
  if (prev?.revert) prev.revert();
  splitByView.delete(view);
};

const splitTagline = (view) => {
  revertSplit(view);
  const tagline = selectHeroEl(view, "tagline") ?? view;
  const split = new SplitText(tagline, {
    type: "words",
    wordsClass: "block w-full",
  });
  splitByView.set(view, split);
  return split;
};

export function createRaiseShutter(view, gelManager) {
  const gel = gelManager?.getGel?.("gel_hero") ?? null;
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });
  if (gel?.view) {
    tl.to(gel.view, { ...HERO_INTRO }, 0).addPause();
  }
  return tl;
}

export function createLowerShutter(view, gelManager) {
  const gel = gelManager?.getGel?.("gel_hero") ?? null;
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  if (!gel?.view) return tl;
  tl.to(
    gel.view,
    { scaleY: 0, ease: "none", transformOrigin: "top center" },
    0,
  );
  return tl;
}
