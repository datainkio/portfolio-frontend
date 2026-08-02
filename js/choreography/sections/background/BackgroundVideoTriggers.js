/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.background.backgroundvideotriggers
 *   role: Frontend runtime module: js/choreography/sections/background/BackgroundVideoTriggers.js
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
import { BACKGROUND_TRIGGER } from "../../config/index.js";
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
