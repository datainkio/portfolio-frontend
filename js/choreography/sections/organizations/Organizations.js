/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.organizations.organizations
 *   role: Frontend runtime module: js/choreography/sections/organizations/Organizations.js
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
