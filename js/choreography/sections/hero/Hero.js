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
import { SELECTORS } from "../../config/index.js";
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
      sectionKey: "hero",
      bus,
      reducedMotionHandler,
      initialInView: true,
    });
  }

  // Super Overrides
  playOutro() {
    // Hero outro playback is driven by ScrollTrigger scrub in HeroTriggers.
    // Do not restart the timeline manually; that would break scroll-linked motion.
    this.logger.trace(
      "Hero outro is scrub-driven; skipping direct timeline play",
    );
    return Promise.resolve();
  }
}
