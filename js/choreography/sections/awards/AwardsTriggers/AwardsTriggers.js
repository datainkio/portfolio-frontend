/** @format */

import AbstractSectionTriggers from "../../abstract-section/AbstractSectionTriggers/AbstractSectionTriggers.js";
import { AWARDS_TRIGGER } from "../../../config/index/index.js";
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap/gsap.js";

export default class AwardsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }
  // Override to layer section-specific trigger defaults
  _getTriggerDefaults() {
    return AWARDS_TRIGGER;
  }
}
