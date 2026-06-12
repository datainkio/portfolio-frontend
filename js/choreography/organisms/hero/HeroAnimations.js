import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_VARIANT_FACTORIES } from "../../molecules/hero-motion/hero-motion.js";

const HERO_EL_ATTR = "data-hero-el";

export default class HeroAnimations extends AbstractSectionAnimations {
  constructor(view, options = {}) {
    super(view);
    this.gelManager = options.gelManager ?? null;
    this._variant = options.variant ?? "shutter";
  }

  setVariant(variant) {
    if (variant === this._variant && this._timelines[TIMELINE_IDS.intro])
      return;
    this._variant = variant;
    this._buildTimeline();
  }

  _factory() {
    return (
      HERO_VARIANT_FACTORIES[this._variant] ?? HERO_VARIANT_FACTORIES.shutter
    );
  }

  _buildLanding() {
    return this._factory().init(this.view, this.gelManager);
  }

  _buildIntro() {
    return this._factory().buildIntro(this.view, this.gelManager);
  }

  _buildIdle() {
    return gsap.timeline({ id: TIMELINE_IDS.idle });
  }

  _buildOutro() {
    return this._factory().buildOutro(this.view, this.gelManager);
  }

  // Variant-independent: HeroTriggers._getTriggerDefaults().end reads this to
  // size the pinned scrub range to the rendered heading. Measures the heading
  // element directly, not the SplitText words, so it survives variant swaps.
  getLastWordBottom() {
    const el = document.getElementById("hero-heading");
    const rect = el?.getBoundingClientRect();
    const bottom = rect?.top;
    return Number.isFinite(bottom) && bottom > 0 ? bottom : null;
  }
}
