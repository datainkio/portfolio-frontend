/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.hero.herotriggers
 *   role: Frontend runtime module: js/choreography/sections/hero/HeroTriggers.js
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

import AbstractSectionTriggers from "../abstract-section/AbstractSectionTriggers.js";
import { HERO_TRIGGER } from "../../config/index.js";

export default class HeroTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
  }

  getTriggerDefaults() {
    return {
      ...super.getTriggerDefaults(),
      ...HERO_TRIGGER,
    };
  }
}
