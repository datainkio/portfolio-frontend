import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

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
