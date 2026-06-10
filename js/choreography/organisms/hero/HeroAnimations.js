import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import {
  ANIMATION_DEFAULTS,
  HERO_LANDING,
  HERO_INTRO,
} from "../../config/ix/motion/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

const HERO_EL_ATTR = "data-hero-el";

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

export default class HeroAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);

    this.gelManager = options.gelManager ?? null;

    this.options = {
      duration: options.duration ?? ANIMATION_DEFAULTS.duration,
      translateY: options.translateY ?? ANIMATION_DEFAULTS.translateY,
      translateX: options.translateX ?? ANIMATION_DEFAULTS.translateX,
      stagger: options.stagger ?? ANIMATION_DEFAULTS.stagger,
      ease: {
        in: options.ease?.in ?? ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? ANIMATION_DEFAULTS.ease.out,
      },
    };

    this.elements = {
      tagline: selectHeroEl(this.view, "tagline") ?? this.view,
    };

    this._split = null;
    this._buildTimeline();
  }

  _buildLanding() {
    this._resetSplit();
    this._split = new SplitText(this.elements.tagline, {
      type: "words",
      wordsClass: "block w-full",
    });

    const tl = gsap.timeline({ id: TIMELINE_IDS.landing });
    tl.fromTo(
      this._split.words,
      { ...HERO_LANDING.from },
      { ...HERO_LANDING.to },
    ).addPause();
    return tl;
  }

  _buildIntro() {
    const gel = this.gelManager?.getGel?.("gel_hero") ?? null;
    const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

    if (gel?.view) {
      tl.to(gel.view, { ...HERO_INTRO }, 0).addPause();
    }

    return tl;
  }

  _buildOutro() {
    const gel = this.gelManager?.getGel?.("gel_hero") ?? null;
    const tl = gsap.timeline({ id: TIMELINE_IDS.outro });

    if (!gel?.view) return tl;

    tl.to(
      gel.view,
      { scaleY: 0, ease: "none", transformOrigin: "top center" },
      0,
    );

    return tl;
  }

  getLastWordBottom() {
    const el = document.getElementById("hero-heading");
    const rect = el?.getBoundingClientRect();
    const bottom = rect?.top;
    return Number.isFinite(bottom) && bottom > 0 ? bottom : null;
  }

  _resetSplit() {
    if (this._split?.revert) {
      this._split.revert();
    }
    this._split = null;
  }
}
