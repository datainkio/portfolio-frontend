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

  _buildLanding() {
    const gel = this.gelManager?.getGel?.("gel_bio") ?? null;
    const tl = gsap.timeline({ id: TIMELINE_IDS.landing });
    gsap.set(gel?.view, {
      left: this.view.getBoundingClientRect().left + "px",
      top: this.view.getBoundingClientRect().top + "px",
      width: this.view.getBoundingClientRect().width + "px",
      height: this.view.getBoundingClientRect().height + "px",
      rotation: 15,
    });
    // gsap.set(gel_backing?.view, { transformOrigin: "top left", rotation: 9 });
    gel?.refresh();
    return tl;
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
    // const factory =
    //   BIO_VARIANT_FACTORIES[this._variant] ?? BIO_VARIANT_FACTORIES.sweep;
    // return factory.buildOutro(this.view, this.gelManager);
    return gsap.timeline({ id: TIMELINE_IDS.outro });
  }
}
