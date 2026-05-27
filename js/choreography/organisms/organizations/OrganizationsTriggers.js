import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { ORGANIZATIONS_TRIGGER } from "../../config/index/index.js";

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
