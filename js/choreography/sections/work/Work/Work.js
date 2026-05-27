/** @format */
/**
 * Work Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../../abstract-section/AbstractSection/AbstractSection.js";
import { SELECTORS } from "../../../config/index/index.js";
import WorkAnimations from "../WorkAnimations/WorkAnimations.js";
import WorkTriggers from "../WorkTriggers/WorkTriggers.js";

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
