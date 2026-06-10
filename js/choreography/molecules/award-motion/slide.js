import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { AWARDS_INTRO } from "../../config/ix/motion/motion.js";
import { AWARD_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const AWARD_EL_ATTR = AWARD_SELECTORS.elementAttribute;

const selectAwardEl = (view, name) =>
  view?.querySelector(`[${AWARD_EL_ATTR}="${name}"]`) ?? null;

export function createSlideIn(view, gelManager) {
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const gel_tint = gelManager?.getGel?.("gel_awards_tint") ?? null;
  const header = selectAwardEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });
  if (gel_backing?.view) {
    gsap.set(gel_backing.view, {
      border: "4px dashed white", // DEBUG
      mixBlendMode: "normal", // DEBUG
    });
    tl.addLabel("intro");
    tl.fromTo(
      gel_backing.view,
      {
        left: "0%",
        top: "0%",
        width: "100%",
        height: "100%",
        scaleX: 0,
        transformOrigin: "left center",
        immediateRender: false,
      },
      {
        scaleX: 1,
        duration: AWARDS_INTRO.duration,
        ease: AWARDS_INTRO.ease.out,
        overwrite: "auto",
        onStart: () => gel_backing.refresh(),
      },
      0,
    );
  }

  return tl;
}

export function createSlideOut(view, gelManager) {
  const header = selectAwardEl(view, "header");
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  tl.addLabel("outro");
  if (gel_backing?.view) {
    tl.to(gel_backing.view, { scaleX: 0, duration: AWARDS_INTRO.duration });
  }
  return tl;
}
