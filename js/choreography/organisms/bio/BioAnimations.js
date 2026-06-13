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

  _applyResponsiveLifecycle(conditions = {}) {
    const profile = resolveSectionMotionProfile("awards", conditions);
    this.animations?.setVariant?.(profile.animation?.variant ?? "sweep");
    super._applyResponsiveLifecycle(conditions);
  }
}
