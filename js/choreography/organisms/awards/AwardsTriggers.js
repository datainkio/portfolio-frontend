import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { SELECTORS } from "../../config/index/index.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

/**
 * Awards Trigger Defaults
 */
export const AWARDS_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.awards,
  start: "top top",
  end: "+=1500px",
  // pin disabled — evaluating ScrollTrigger pin impact on motion complexity
  pin: false,
  pinSpacing: false,
  once: false,
  // scrub disabled — evaluating ScrollTrigger scrub impact on motion complexity
  scrub: false,
};

export default class AwardsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  _getTriggerDefaults() {
    return AWARDS_TRIGGER;
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
