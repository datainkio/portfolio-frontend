/** @format */
/**
 * Awards Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../../abstract-section/AbstractSection/AbstractSection.js";
import { SELECTORS } from "../../../config/index/index.js";
import AwardsAnimations from "../AwardsAnimations/AwardsAnimations.js";
import AwardsTriggers from "../AwardsTriggers/AwardsTriggers.js";

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
  }

  _onUpdate(trigger) {
    this.animations?.updateAwardsReveal?.(trigger);
  }

  _onRefresh(trigger) {
    this.animations?.updateAwardsReveal?.(trigger);
  }

  _applyPostIntroState() {
    super._applyPostIntroState();
    this.animations?.showAllAwards?.();
  }
}
