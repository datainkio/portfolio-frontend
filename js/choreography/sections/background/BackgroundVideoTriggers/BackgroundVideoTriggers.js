/** @format */

import AbstractSectionTriggers from "../../abstract-section/AbstractSectionTriggers/AbstractSectionTriggers.js";
import { BACKGROUND_TRIGGER } from "../../../config/index/index.js";
export default class BackgroundVideoTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }
  // Override to layer section-specific trigger defaults
  _getTriggerDefaults() {
    return BACKGROUND_TRIGGER;
  }
}
