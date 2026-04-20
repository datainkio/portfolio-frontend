/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.bio.biotriggers
 *   role: Frontend runtime module: js/choreography/sections/bio/BioTriggers.js
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
import { BIO_TRIGGER } from "../../config/index.js";

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }
  // Override to layer section-specific trigger defaults
  _getTriggerDefaults() {
    return BIO_TRIGGER;
  }
}
