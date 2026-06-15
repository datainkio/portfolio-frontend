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
  pin: true,
  pinSpacing: true,
  once: false,
  scrub: 1,
  markers: true,
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
    const introTl = this.section?.animations?.getTimeline?.(TIMELINE_IDS.intro);
    super.bind({ ...options, ...(introTl ? { animation: introTl } : {}) });
  }
}
