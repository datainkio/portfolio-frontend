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
import { SELECTORS, TIMELINE_IDS } from "../../config/index.js";
import HeroAnimations from "./HeroAnimations.js";
import HeroTriggers from "./HeroTriggers.js";

export default class Hero extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler, gelManager = null } = {}) {
    const view = document.getElementById(SELECTORS.hero);
    const animations = new HeroAnimations(view, { gelManager });
    const triggers = new HeroTriggers(view);
    // Hero starts in view; track that so the first emitted lifecycle event is exit.
    // Subsequent enter events remain intact for re-entry after scrolling back.
    super({
      view,
      animations,
      triggers,
      sectionKey: SELECTORS.hero,
      bus,
      reducedMotionHandler,
      initialInView: true,
    });
  }

  // Super Overrides
  playOutro() {
    // For the hero section, we want to play the outro immediately on exit trigger
    // without waiting for the scroll trigger to complete. This allows the hero
    // animations to start as soon as the user scrolls past the hero, creating a
    // more responsive and engaging experience.
    this.logger.trace("Playing outro immediately on exit trigger");
    this.animations.play(TIMELINE_IDS.outro);
  }
}
