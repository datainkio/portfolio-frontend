import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_VARIANT_FACTORIES } from "./../../molecules/bio-motion/bio-motion.js";

export default class BioAnimations extends AbstractSectionAnimations {
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

  /**
   * Force a fresh build of every phase timeline, ignoring setVariant's
   * unchanged-variant short-circuit. Needed after a matchMedia breakpoint
   * change reverts (and kills) the previous context's tweens: the retained
   * timeline references are dead, so the caller must rebuild to replace them.
   */
  rebuild(variant) {
    if (variant) this._variant = variant;
    this._buildTimeline();
  }

  _factory() {
    return BIO_VARIANT_FACTORIES[this._variant] ?? BIO_VARIANT_FACTORIES.sweep;
  }

  // NOTE: This might be better defined along with the other factory methods in BIO_VARIANT_FACTORIES
  _buildLanding() {
    const factory =
      BIO_VARIANT_FACTORIES[this._variant] ?? BIO_VARIANT_FACTORIES.sweep;
    // init is variant-specific (reduced-only): it pre-styles the gel resting
    // state. Variants without it have no landing phase, so return null —
    // _registerTimeline treats a falsy return as "no timeline for this phase".
    return factory.init?.(this.view, this.gelManager) ?? null;
  }

  _buildIntro() {
    const factory =
      BIO_VARIANT_FACTORIES[this._variant] ?? BIO_VARIANT_FACTORIES.sweep;
    return factory.buildIntro?.(this.view, this.gelManager) ?? null;
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    const factory =
      BIO_VARIANT_FACTORIES[this._variant] ?? BIO_VARIANT_FACTORIES.sweep;
    return factory.buildOutro?.(this.view, this.gelManager) ?? null;
  }
}
