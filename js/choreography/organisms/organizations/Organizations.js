import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS } from "../../config/index/index.js";
import OrganizationsAnimations from "./OrganizationsAnimations.js";
import OrganizationsTriggers from "./OrganizationsTriggers.js";

export default class Organizations extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.organizations);
    const anim = new OrganizationsAnimations(view);
    const triggers = new OrganizationsTriggers(view);

    super({
      view,
      animations: anim,
      triggers,
      sectionKey: "organizations",
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
