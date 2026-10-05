import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { SELECTORS } from "../../config/index/index.js";

/**
 * Organizations Trigger Defaults
 */
export const ORGANIZATIONS_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.organizations,
};

export default class OrganizationsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  _getTriggerDefaults() {
    return ORGANIZATIONS_TRIGGER;
  }
}
