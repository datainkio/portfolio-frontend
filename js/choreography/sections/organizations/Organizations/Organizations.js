/** @format */
/**
 * Organizations Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../../abstract-section/AbstractSection/AbstractSection.js";
import { SELECTORS } from "../../../config/index/index.js";
import OrganizationsAnimations from "../OrganizationsAnimations/OrganizationsAnimations.js";
import OrganizationsTriggers from "../OrganizationsTriggers/OrganizationsTriggers.js";

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
    this.animations?.updateOrganizationsReveal?.(trigger);
  }

  _onRefresh(trigger) {
    this.animations?.updateOrganizationsReveal?.(trigger);
  }

  _applyPostIntroState() {
    super._applyPostIntroState();
    this.animations?.showAllOrganizations?.();
  }
}
