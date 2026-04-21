/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.work.worktriggers
 *   role: Frontend runtime module: js/choreography/sections/work/WorkTriggers.js
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
import { WORK_TRIGGER } from "../../config/index.js";

export default class WorkTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  // Override to layer section-specific trigger defaults
  _getTriggerDefaults() {
    return WORK_TRIGGER;
  }
}
