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

  _buildIntro() {
    const factory =
      BIO_VARIANT_FACTORIES[this._variant] ?? BIO_VARIANT_FACTORIES.sweep;
    return factory.buildIntro(this.view, this.gelManager);
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    const factory =
      BIO_VARIANT_FACTORIES[this._variant] ?? BIO_VARIANT_FACTORIES.sweep;
    return factory.buildOutro(this.view, this.gelManager);
  }
}
