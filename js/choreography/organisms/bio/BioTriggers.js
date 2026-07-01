import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
/**
 * Bio Trigger Defaults
 */
export const BIO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  start: "top top",
  end: "bottom bottom",
  // once: true,
  // scrub disabled — evaluating ScrollTrigger scrub impact on motion complexity
  scrub: false,
  // pin disabled — evaluating ScrollTrigger pin impact on motion complexity
  pin: false,
  pinSpacing: false,
  // markers: true,
};

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    // Pre-reveal hide — paired with the intro reveal (autoAlpha 0→1). Disabled
    // while the reveal is off; otherwise the section stays hidden with nothing
    // to restore it. Re-enable together with the intro timeline.
    // gsap.set(view, { autoAlpha: 0 });
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  _getTriggerDefaults() {
    return BIO_TRIGGER;
  }

  bind(options = {}) {
    // Hand the intro timeline to the ScrollTrigger ONLY when scrubbed; otherwise
    // the lifecycle (playIntro via onEnter) owns the reveal. Passing it while
    // unscrubbed double-drives the same timeline. See AbstractSection.playIntro.
    const scrubbed = Boolean(this._getTriggerDefaults().scrub);
    const introTl = scrubbed
      ? this.section?.animations?.getTimeline?.(TIMELINE_IDS.intro)
      : null;
    super.bind({ ...options, ...(introTl ? { animation: introTl } : {}) });
  }
}
