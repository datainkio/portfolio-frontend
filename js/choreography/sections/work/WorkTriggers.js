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
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";
import { WORK_TRIGGER } from "../../config/index.js";

const WORK_EL_ATTR = "data-projects-el";

export default class WorkTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
    this._headerPin = null;
  }

  // Override to layer section-specific trigger defaults
  _getTriggerDefaults() {
    return WORK_TRIGGER;
  }

  bind(callbacks = {}) {
    super.bind(callbacks);
    this._bindHeaderPin();
  }

  _bindHeaderPin() {
    this._headerPin?.kill();
    this._headerPin = null;

    const header = this.view?.querySelector(`[${WORK_EL_ATTR}="header"]`);
    if (!header || !this.view) return;

    this._headerPin = ScrollTrigger.create({
      id: "work-header-pin",
      trigger: this.view,
      start: "top top",
      end: "bottom top",
      pin: header,
      pinSpacing: false,
      invalidateOnRefresh: true,
      markers: false,
    });
  }

  kill() {
    this._headerPin?.kill();
    this._headerPin = null;
    super.kill();
  }
}
