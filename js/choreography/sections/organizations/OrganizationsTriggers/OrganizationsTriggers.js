/** @format */

import AbstractSectionTriggers from "../../abstract-section/AbstractSectionTriggers/AbstractSectionTriggers.js";
import { ORGANIZATIONS_TRIGGER } from "../../../config/index/index.js";
export default class OrganizationsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }
  // Override to layer section-specific trigger defaults
  _getTriggerDefaults() {
    return ORGANIZATIONS_TRIGGER;
  }
}
