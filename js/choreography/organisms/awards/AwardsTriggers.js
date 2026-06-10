import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { AWARDS_TRIGGER } from "../../config/index/index.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";

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
