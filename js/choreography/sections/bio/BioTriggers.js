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
import { BIO_REVEAL_TRIGGER, BIO_HIDE_TRIGGER } from "../../config.js";
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
  }

  bind(callbacks = {}) {
    super.bind(callbacks);
    if (!this.view) return;

    this._revealTrigger?.kill();
    this._hideTrigger?.kill();
    const header = this.view.querySelector("h2");
    const bodyCopy = this.view.querySelector("p");
    if (!header || !bodyCopy) return;

    this._revealTrigger = ScrollTrigger.create({
      ...BIO_REVEAL_TRIGGER,
      trigger: header,
      // convert pin from config boolean to the required element/false value
      pin: BIO_REVEAL_TRIGGER.pin ? this.view : false,
      onEnter: () => this.section?.playIntro?.(),
    });

    // this._hideTrigger = ScrollTrigger.create({
    //   ...BIO_HIDE_TRIGGER,
    //   trigger: header,
    //   // convert pin from config boolean to the required element/false value
    //   pin: BIO_HIDE_TRIGGER.pin ? this.view : false,
    //   onExit: () => this.section?.playOutro?.(),
    // });
  }

  destroy() {
    this.kill();
    this.section = null;
  }

  kill() {
    super.kill();
    this._revealTrigger?.kill();
    this._revealTrigger = null;
    this._hideTrigger?.kill();
    this._hideTrigger = null;
  }
}
