/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.work.work
 *   role: Frontend runtime module: js/choreography/sections/work/Work.js
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
/**
 * Work Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../abstract-section/AbstractSection.js";
import { SELECTORS } from "../../config/index.js";
import WorkAnimations from "./WorkAnimations.js";
import WorkTriggers from "./WorkTriggers.js";

export default class Work extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.work);
    const animations = new WorkAnimations(view);
    const triggers = new WorkTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "work",
      bus,
      reducedMotionHandler,
    });
  }

  _onUpdate(trigger) {
    this.animations?.updateWorkReveal?.(trigger);
  }

  _onRefresh(trigger) {
    this.animations?.updateWorkReveal?.(trigger);
  }

  _applyPostIntroState() {
    super._applyPostIntroState();
    this.animations?.showAllWorkItems?.();
  }
}
