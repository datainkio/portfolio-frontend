/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.bio.bio
 *   role: Frontend runtime module: js/choreography/sections/bio/Bio.js
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
 * Organizations Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../abstract-section/AbstractSection.js";
import { SELECTORS } from "../../config/index.js";
import BioAnimations from "./BioAnimations.js";
import BioTriggers from "./BioTriggers.js";

export default class Bio extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.bio);
    const animations = new BioAnimations(view);
    const triggers = new BioTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "bio",
      bus,
      reducedMotionHandler,
    });
  }

  _onUpdate(trigger) {
    this.animations?.updateSubSectionReveal?.(trigger);
  }

  _onRefresh(trigger) {
    this.animations?.updateSubSectionReveal?.(trigger);
  }

  _applyPostIntroState() {
    super._applyPostIntroState();
    this.animations?.showAllSubSections?.();
  }
}
