import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_INTRO } from "../../config/ix/motion/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

export function createSweepIn(view, gelManager) {
  const gel = gelManager?.getGel?.("gel_bio") ?? null;
  const header = selectBioEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

  if (gel?.view) {
    tl.addLabel("intro");

    // Reset the gel to fill the viewport, then rebuild its mask. The gel is
    // absolute inset-0 inside the fixed inset-0 background, so 0%/0%/100%/100%
    // resolves to the viewport. This runs as a leading timeline callback (not
    // at build time) so it lands the moment the intro plays, and refreshes the
    // polygon while the gel is at full size (scaleY:1) — never mid-scale, since
    // GelGeometry measures the transformed box.
    tl.call(() => {
      gsap.set(gel.view, {
        left: "0%",
        top: "0%",
        width: "100%",
        height: "100%",
      });
      gel.refresh();
    });

    // Grow from the bottom. startAt + immediateRender:false defers the scaleY:0
    // start-state to playback so it cannot stomp the hero arrangement while Bio
    // is off-screen; overwrite:"auto" kills any competing arrangement tween.
    tl.to(
      gel.view,
      {
        startAt: { scaleY: 0, transformOrigin: "bottom center" },
        scaleY: 1,
        transformOrigin: "bottom center",
        duration: BIO_INTRO.duration,
        ease: BIO_INTRO.ease.out,
        overwrite: "auto",
        immediateRender: false,
      },
      ">",
    );
  }

  if (header) {
    tl.addLabel("middle");
    tl.from(
      header,
      {
        autoAlpha: 0,
        y: 40,
        duration: BIO_INTRO.duration,
        ease: BIO_INTRO.ease.out,
      },
      // Overlap the text reveal with the last 20% of the gel wipe
      gel?.view ? `>-=${BIO_INTRO.duration * 0.2}` : 0,
    );
  }

  return tl;
}

export function createSweepOut(view, gelManager) {
  const header = selectBioEl(view, "header");
  const gel = gelManager?.getGel?.("gel_bio") ?? null;
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  tl.addLabel("outro");
  if (header) {
    tl.to(header, { opacity: 0, duration: BIO_INTRO.duration });
  }
  if (gel?.view) {
    tl.to(gel.view, { scaleY: 0, duration: BIO_INTRO.duration });
  }
  return tl;
}
