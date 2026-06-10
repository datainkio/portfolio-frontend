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
    // Wipe from left: position gel at bio arrangement coords, then grow scaleX 0 → 1.
    // immediateRender: false prevents the from-state from stomping on the hero
    // arrangement while Bio is off-screen. overwrite: "auto" kills any competing
    // arrangement tween when the intro actually plays.
    gsap.set(gel.view, {
      left: "0%",
      top: "0%",
      width: "100%",
      height: "100%",
      scaleX: 0,
      transformOrigin: "left center",
      immediateRender: false,
    });
    tl.addLabel("intro");
    tl.to(
      gel.view,
      {
        scaleX: 1,
        duration: BIO_INTRO.duration,
        ease: BIO_INTRO.ease.out,
        overwrite: "auto",
        onStart: () => gel.refresh(),
      },
      0,
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
    tl.to(gel.view, { scaleX: 0, duration: BIO_INTRO.duration });
  }
  return tl;
}
