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
import { EVENTS } from "../../config/events.js";
import { SELECTORS } from "../../config/index.js";
import OrganizationsAnimations from "./OrganizationsAnimations.js";
import OrganizationsTriggers from "./OrganizationsTriggers.js";

export default class Organizations extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.organizations);
    const anim = new OrganizationsAnimations(view);
    const triggers = new OrganizationsTriggers(view);
    const events = EVENTS.organizations;

    super(view, anim, triggers, events, bus, { reducedMotionHandler });
  }
}
