import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { BIO_TRIGGER } from "../../config/index/index.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

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
