/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.bio.biotriggers
 *   role: Frontend runtime module: js/choreography/sections/bio/BioTriggers.js
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
import { BIO_HIDE_TRIGGER, BIO_TRIGGER } from "../../config/runtime.js";
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }
  getTriggerDefaults() {
    return {
      ...super.getTriggerDefaults(),
      ...BIO_TRIGGER,
    };
  }

  bind(callbacks = {}) {
    const { onEnter, onLeave, onEnterBack, onLeaveBack } = callbacks;

    if (!this.view) {
      this.logger.trace("No view available to bind triggers");
      return;
    }

    this.kill();

    // Reveal trigger: enter the section and bring content in.
    this._revealTrigger = ScrollTrigger.create({
      trigger: this.view,
      ...this.getTriggerDefaults(),
      onEnter: () => {
        this.section?.playIntro?.();
        onEnter?.();
      },
      onEnterBack: () => {
        this.section?.playIntro?.();
        onEnterBack?.();
      },
    });

    // Hide trigger: when crossing the lower boundary, transition content out.
    this._hideTrigger = ScrollTrigger.create({
      trigger: this.view,
      ...BIO_HIDE_TRIGGER,
      onEnter: () => {
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

  kill() {
    this._revealTrigger?.kill();
    this._revealTrigger = null;

    this._hideTrigger?.kill();
    this._hideTrigger = null;

    super.kill();
  }
}
