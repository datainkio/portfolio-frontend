import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_INTRO } from "../../config/ix/motion.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const HERO_EL_ATTR = HERO_SELECTORS.elementAttribute;

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

export function initFade(view) {
  // gsap.set(view, { autoAlpha: 0 });
}

export function createFadeIn(view) {
  const header = selectHeroEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

  // if (header) {
  //   tl.from(header, {
  //     autoAlpha: 0,
  //     y: 40,
  //     duration: HERO_INTRO.duration,
  //     ease: HERO_INTRO.ease.out,
  //   });
  // }

  // tl.addPause();
  return tl;
}

export function createFadeOut(view) {
  const header = selectHeroEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });

  // if (header) {
  //   tl.to(header, { autoAlpha: 0, duration: HERO_INTRO.duration });
  // }
  return tl;
}
