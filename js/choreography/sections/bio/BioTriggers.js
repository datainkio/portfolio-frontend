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
import { BIO_REVEAL_TRIGGER } from "../../config.js";
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";

export default class BioTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
  }

  bind(callbacks = {}) {
    super.bind(callbacks);
    if (!this.view) return;

    this._revealTrigger?.kill();

    const header = this.view.querySelector("header");
    const bodyCopy = this.view.querySelector("header + p");
    if (!header || !bodyCopy) return;

    this._revealTrigger = ScrollTrigger.create({
      trigger: header,
      start: BIO_REVEAL_TRIGGER.start,
      end: BIO_REVEAL_TRIGGER.end,
      scrub: BIO_REVEAL_TRIGGER.scrub,
      snap: BIO_REVEAL_TRIGGER.snap,
      pin: BIO_REVEAL_TRIGGER.pin ? this.view : false,
      anticipatePin: BIO_REVEAL_TRIGGER.anticipatePin,
      once: BIO_REVEAL_TRIGGER.once,
      onEnter: () => this.section?.playIntro?.(),
    });
  }

  destroy() {
    this.kill();
    this.section = null;
  }

  kill() {
    super.kill();
    this._revealTrigger?.kill();
    this._revealTrigger = null;
  }
}
