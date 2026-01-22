/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.organizations.organizationstriggers
 *   role: Frontend runtime module: js/choreography/sections/organizations/OrganizationsTriggers.js
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

import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class OrganizationsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
