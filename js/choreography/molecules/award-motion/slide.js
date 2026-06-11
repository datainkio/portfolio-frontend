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
    gsap.set(gel_backing.view, { transformOrigin: "bottom center", scaleY: 0 });
    tl.addLabel("intro");
    // Reset the gel to fill the viewport, then rebuild its mask. The gel is
    // absolute inset-0 inside the fixed inset-0 background, so 0%/0%/100%/100%
    // resolves to the viewport. This runs as a leading timeline callback (not
    // at build time) so it lands the moment the intro plays, and refreshes the
    // polygon while the gel is at full size (scaleY:1) — never mid-scale, since
    // GelGeometry measures the transformed box.

    console.log(view.getBoundingClientRect());

    tl.call(() => {
      gsap.set([gel_backing.view, gel_tint.view], {
        left: view.getBoundingClientRect().left + "px",
        top: view.getBoundingClientRect().top + "px",
        width: view.getBoundingClientRect().width + "px",
        height: view.getBoundingClientRect().height + "px",
        mixBlendMode: "normal",
      });
      gel_backing.refresh();
    });

    // Grow from the bottom. startAt + immediateRender:false defers the scaleY:0
    // start-state to playback so it cannot stomp the hero arrangement while Bio
    // is off-screen; overwrite:"auto" kills any competing arrangement tween.
    tl.to(
      gel_backing.view,
      {
        startAt: { scaleY: 0, transformOrigin: "bottom center" },
        scaleY: 1,
        transformOrigin: "bottom center",
        duration: AWARDS_INTRO.duration,
        ease: AWARDS_INTRO.ease.out,
        overwrite: "auto",
        immediateRender: false,
      },
      ">",
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
    tl.to(gel_backing.view, { scaleY: 0, duration: AWARDS_INTRO.duration });
  }
  return tl;
}
