import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import {
  BIO_ANIMATION_DEFAULTS,
  BIO_INTRO,
} from "../../config/ix/motion/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;
const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

export default class BioAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);
    this.gelManager = options.gelManager ?? null;
    this.options = {
      duration: options.duration ?? BIO_ANIMATION_DEFAULTS.duration,
      ease: options.ease ?? BIO_ANIMATION_DEFAULTS.ease,
    };
    this._buildTimeline();
  }

  _buildIntro() {
    const gel1 = this.gelManager?.getGel?.("bg-gel-2") ?? null;
    const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

    if (gel1?.view) {
      // Wipe from left: position gel at bio arrangement coords, then grow scaleX 0 → 1.
      // immediateRender: false prevents the from-state from stomping on the hero
      // arrangement while Bio is off-screen. overwrite: "auto" kills any competing
      // arrangement tween when the intro actually plays.
      tl.fromTo(
        gel1.view,
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
          duration: BIO_INTRO.duration,
          ease: BIO_INTRO.ease.out,
          overwrite: "auto",
          onStart: () => gel1.refresh(),
        },
        0,
      );
    }

    const header = selectBioEl(this.view, "header");
    if (header) {
      tl.from(
        header,
        {
          autoAlpha: 0,
          y: 40,
          duration: BIO_INTRO.duration,
          ease: BIO_INTRO.ease.out,
        },
        // Overlap the text reveal with the last 20% of the gel wipe
        gel1?.view ? `>-=${BIO_INTRO.duration * 0.2}` : 0,
      );
    }

    tl.addPause();
    return tl;
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    const header = selectBioEl(this.view, "header");
    const gel = this.gelManager?.getGel?.("bg-gel-2") ?? null;
    const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
    tl.to(header, { opacity: 0, duration: BIO_INTRO.duration }).to(
      gel?.view ?? {},
      {
        scaleX: 0,
        duration: BIO_INTRO.duration,
      },
    );
    return tl;
  }
}
