/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.hero.hero
 *   role: Frontend runtime module: js/choreography/sections/hero/Hero.js
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
 * Hero Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from "../abstract-section/AbstractSection.js";
import { EVENTS } from "../../config/events.js";
import { SELECTORS } from "../../config/index.js";
import HeroAnimations from "./HeroAnimations.js";
import HeroTriggers from "./HeroTriggers.js";

export default class Hero extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.hero.replace("#", ""));
    const animations = new HeroAnimations(view);
    const triggers = new HeroTriggers(view);
    const events = {
      enter: EVENTS.hero.enter,
      exit: EVENTS.hero.exit,
      introStart: EVENTS.hero.introStart,
      introComplete: EVENTS.hero.introComplete,
      outroStart: EVENTS.hero.outroStart,
      outroComplete: EVENTS.hero.outroComplete,
    };
    // Hero starts in view; track that so the first emitted lifecycle event is exit.
    // Subsequent enter events remain intact for re-entry after scrolling back.
    super({
      view,
      animations,
      triggers,
      events,
      bus,
      reducedMotionHandler,
    });

    // Hero starts on-screen at page top.
    // this._isInView = true;

    // Link triggers back to this section for playIntro/playOutro calls
    if (this.triggers) {
      this.triggers.section = this;
    }

    if (!view) {
      this.logger.trace("element not found; skipping initialization.");
      return;
    }
  }

  _onEnter() {
    super._onEnter();
    void this.playIntro();
  }

  _onLeave() {
    super._onLeave();
    void this.playOutro();
  }

  _onEnterBack() {
    this._onEnter();
  }

  _onLeaveBack() {
    // Keep hero logically in-view at the top boundary.
    this._onEnter();
  }
}
