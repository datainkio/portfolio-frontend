/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.awards.awardstriggers
 *   role: Frontend runtime module: js/choreography/sections/awards/AwardsTriggers.js
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
import { SCROLL_DEFAULTS } from "../../config/runtime.js";
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";

export default class AwardsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
  }

  bind(callbacks = {}) {
    const { onEnter, onLeave, onEnterBack, onLeaveBack } = callbacks;

    if (!this.view) return;

    const header = this.view.querySelector("header");
    const triggerElement = header || this.view;

    this._trigger?.kill();

    this._trigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: SCROLL_DEFAULTS.start,
      end: "bottom top",
      onEnter: () => {
        this.section?.playIntro?.();
        onEnter?.();
      },
      onLeave: () => {
        this.section?.playOutro?.();
        onLeave?.();
      },
      onEnterBack: () => {
        this.section?.playIntro?.();
        onEnterBack?.();
      },
      onLeaveBack: () => {
        this.section?.playOutro?.();
        onLeaveBack?.();
      },
    });
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
