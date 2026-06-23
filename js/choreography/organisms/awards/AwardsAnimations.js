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

  // NOTE: This might be better defined along with the other factory methods in AWARD_VARIANT_FACTORIES
  _buildLanding() {
    const factory =
      AWARD_VARIANT_FACTORIES[this._variant] ?? AWARD_VARIANT_FACTORIES.slide;
    return factory.init(this.view, this.gelManager);
  }

  _buildIntro() {
    const factory =
      AWARD_VARIANT_FACTORIES[this._variant] ?? AWARD_VARIANT_FACTORIES.slide;
    return factory.buildIntro(this.view, this.gelManager);
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    const factory =
      AWARD_VARIANT_FACTORIES[this._variant] ?? AWARD_VARIANT_FACTORIES.slide;
    return factory.buildOutro(this.view, this.gelManager);
  }
}
