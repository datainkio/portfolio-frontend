import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { PROCESS_VARIANT_FACTORIES } from "../../molecules/process-motion/process-motion.js";

export default class ProcessAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);
    this.gelManager = options.gelManager ?? null;
    this._variant = options.variant ?? "blockframes";
  }

  setVariant(variant) {
    if (variant === this._variant && this._timelines[TIMELINE_IDS.intro])
      return;
    this._variant = variant;
    this._buildTimeline();
  }

  rebuild(variant) {
    if (variant) this._variant = variant;
    this._buildTimeline();
  }

  _factory() {
    return (
      PROCESS_VARIANT_FACTORIES[this._variant] ??
      PROCESS_VARIANT_FACTORIES.blockframes
    );
  }

  _buildIntro() {
    return (
      this._factory().buildIntro?.(this.view, this.gelManager) ??
      super._buildIntro()
    );
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    return this._factory().buildOutro?.(this.view) ?? super._buildOutro();
  }
}
