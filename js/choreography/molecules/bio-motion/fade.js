import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_INTRO } from "../../config/ix/motion/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

export function createFadeIn(view) {
  const header = selectBioEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

  if (header) {
    tl.from(header, {
      autoAlpha: 0,
      y: 40,
      duration: BIO_INTRO.duration,
      ease: BIO_INTRO.ease.out,
    });
  }

  tl.addPause();
  return tl;
}

export function createFadeOut(view) {
  const header = selectBioEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });

  if (header) {
    tl.to(header, { autoAlpha: 0, duration: BIO_INTRO.duration });
  }
  return tl;
}
