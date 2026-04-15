/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.awards.awards
 *   role: Frontend runtime module: js/choreography/sections/awards/Awards.js
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
 * Awards Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../abstract-section/AbstractSection.js";
import { SELECTORS } from "../../config/index.js";
import AwardsAnimations from "./AwardsAnimations.js";
import AwardsTriggers from "./AwardsTriggers.js";

export default class Awards extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.awards);
    const animations = new AwardsAnimations(view);
    const triggers = new AwardsTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "awards",
      bus,
      reducedMotionHandler,
    });

    // Keep parity with other sections for trigger/section coordination.
    if (this.triggers) {
      this.triggers.section = this;
    }

    if (!view) {
      this.logger.trace("element not found; skipping initialization.");
      return;
    }
  }
}
