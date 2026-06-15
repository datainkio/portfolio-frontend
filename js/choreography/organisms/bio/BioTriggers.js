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
  scrub: true,
  pin: true,
  pinSpacing: true,
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
    const introTl = this.section?.animations?.getTimeline?.(TIMELINE_IDS.intro);
    super.bind({ ...options, ...(introTl ? { animation: introTl } : {}) });
  }
}
