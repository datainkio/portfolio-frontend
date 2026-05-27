import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { AWARDS_TRIGGER } from "../../config/index/index.js";

export default class AwardsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  _getTriggerDefaults() {
    return AWARDS_TRIGGER;
  }
}
