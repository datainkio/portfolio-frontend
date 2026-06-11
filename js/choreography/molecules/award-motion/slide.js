import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { AWARDS_INTRO } from "../../config/ix/motion/motion.js";
import { AWARD_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const AWARD_EL_ATTR = AWARD_SELECTORS.elementAttribute;

const selectAwardEl = (view, name) =>
  view?.querySelector(`[${AWARD_EL_ATTR}="${name}"]`) ?? null;

export function init(view, gelManager) {
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const gel_tint = gelManager?.getGel?.("gel_awards_tint") ?? null;
  if (gel_backing?.view) {
    // Build the mask polygon once, at full size. GelGeometry.refresh() reads
    // getBoundingClientRect(), so it must run at scaleY:1 to measure correct
    // geometry; we then collapse to scaleY:0 as the reveal's start state. This
    // keeps all geometry work out of the scrubbed intro tween (see createSlideIn).
    gsap.set(gel_backing.view, {
      transformOrigin: "bottom center",
      width: view.getBoundingClientRect().width + "px",
      left: view.getBoundingClientRect().left + "px",
      scaleY: 1,
      mixBlendMode: "normal",
    });
    gel_backing.refresh();
    gsap.set(gel_backing.view, { scaleY: 0 });
  }
}

export function createSlideIn(view, gelManager) {
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const gel_tint = gelManager?.getGel?.("gel_awards_tint") ?? null;
  const context = selectAwardEl(view, "context");
  const header = selectAwardEl(view, "header");
  const subheading = selectAwardEl(view, "subheading");
  const list = selectAwardEl(view, "list");

  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });
  if (gel_backing?.view) {
    tl.addLabel("intro");
    // Reveal the pre-built gel mask bottom-up. The polygon is measured once at
    // full size in init(); this tween only scales it in, so it stays linear
    // (ease: "none") to track the scrubbed ScrollTrigger 1:1, and never refreshes
    // geometry mid-scrub (which would measure the transformed, collapsing box).
    tl.to(gel_backing.view, {
      scaleY: 1,
      duration: AWARDS_INTRO.duration,
      ease: "none",
    });
  }

  return tl;
}

export function createSlideOut(view, gelManager) {
  const header = selectAwardEl(view, "header");
  const gel_backing = gelManager?.getGel?.("gel_awards_backing") ?? null;
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  tl.addLabel("outro");
  if (gel_backing?.view) {
    tl.to(gel_backing.view, { scaleY: 0, duration: AWARDS_INTRO.duration });
  }
  return tl;
}
