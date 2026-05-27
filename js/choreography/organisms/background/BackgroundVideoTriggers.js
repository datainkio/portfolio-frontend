import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { BACKGROUND_TRIGGER } from "../../config/index/index.js";

export default class BackgroundVideoTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  _getTriggerDefaults() {
    return BACKGROUND_TRIGGER;
  }
}
