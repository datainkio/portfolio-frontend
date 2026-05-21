/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.organizations.organizationstriggers
 *   role: Frontend runtime module: js/choreography/sections/organizations/OrganizationsTriggers.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
/** @format */

import AbstractSectionTriggers from "../abstract-section/AbstractSectionTriggers.js";
import { ORGANIZATIONS_TRIGGER } from "../../config/index.js";
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
