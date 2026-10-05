import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { SELECTORS } from "../../config/index/index.js";

/**
 * Background Trigger Defaults
 */
export const BACKGROUND_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.video,
};

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
