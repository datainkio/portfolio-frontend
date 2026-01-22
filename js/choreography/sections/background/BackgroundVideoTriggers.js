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

import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class BackgroundVideoTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
