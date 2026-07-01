import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_INTRO } from "../../config/ix/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

export function initSplit(view, gelManager) {
  const header = selectBioEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.landing });

  tl.addLabel("landing");
  tl.from(view, { autoAlpha: 0, duration: 5 }, "landing");
  return tl;
}

export function createSplitIn(view, gelManager) {
  console.log("bio split intro reveal");
  const header = selectBioEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

  tl.addLabel("intro");
  tl.to(view, { autoAlpha: 1, duration: 5 }, "intro");
  return tl;
}

// Reset the gel to fill the viewport, then rebuild its mask. The gel is
