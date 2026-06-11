import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { AWARD_VARIANT_FACTORIES } from "./../../molecules/award-motion/award-motion.js";

const AWARDS_EL_ATTR = "data-awards-el";

const selectAwardsEl = (view, name) =>
  view?.querySelector(`[${AWARDS_EL_ATTR}="${name}"]`) ?? null;

export default class AwardsAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);
    this.gelManager = options.gelManager ?? null;
    this._variant = options.variant ?? "sweep";
  }

  setVariant(variant) {
    if (variant === this._variant && this._timelines[TIMELINE_IDS.intro])
      return;
    this._variant = variant;
    this._buildTimeline();
  }

  _buildLanding() {
    // const gel_backing = this.gelManager?.getGel?.("gel_awards_backing") ?? null;
    // const gel_tint = this.gelManager?.getGel?.("gel_awards_tint") ?? null;
    // if (gel_backing?.view) {
    //   gsap.set(gel_backing.view, {
    //     left: "0%",
    //     top: "0%",
    //     width: "100%",
    //     height: "100%",
    //     scaleX: 0,
    //     transformOrigin: "left center",
    //     immediateRender: false,
    //     opacity: 1,
    //     mixBlendMode: "normal",
    //   });
    // }
    // if (gel_tint?.view) {
    //   gsap.set(gel_tint.view, {
    //     left: "0%",
    //     top: "0%",
    //     width: "100%",
    //     height: "100%",
    //     scaleX: 0,
    //     transformOrigin: "left center",
    //     immediateRender: false,
    //     mixBlendMode: "multiply",
    //   });
    // }
    const tl = gsap.timeline({ id: TIMELINE_IDS.landing });
    return tl;
  }

  _buildIntro() {
    const factory =
      AWARD_VARIANT_FACTORIES[this._variant] ?? AWARD_VARIANT_FACTORIES.sweep;
    return factory.buildIntro(this.view, this.gelManager);
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    const factory =
      AWARD_VARIANT_FACTORIES[this._variant] ?? AWARD_VARIANT_FACTORIES.sweep;
    return factory.buildOutro(this.view, this.gelManager);
  }
}
