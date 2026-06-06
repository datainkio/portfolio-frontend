import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS } from "../../config/index/index.js";
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
  }

  _onUpdate(trigger) {
    this.animations?.revealGroup?.update?.();
  }

  _onRefresh(trigger) {
    this.animations?.revealGroup?.update?.();
  }

  _applyPostIntroState() {
    super._applyPostIntroState();
    this.animations?.revealGroup?.showAll?.();
  }
}
