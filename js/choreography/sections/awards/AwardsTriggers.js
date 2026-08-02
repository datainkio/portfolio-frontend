/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.awards.awardstriggers
 *   role: Frontend runtime module: js/choreography/sections/awards/AwardsTriggers.js
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
import { AWARDS_TRIGGER } from "../../config/index.js";
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";

export default class AwardsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }
  // Override to layer section-specific trigger defaults
  _getTriggerDefaults() {
    return AWARDS_TRIGGER;
  }
}
