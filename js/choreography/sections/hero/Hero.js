/** @format */

/**
 * Hero Section Controller
 *
 * Simple intro fade-in that emits standardized events from constants.js.
 * Extends BaseSection to use shared lifecycle and AnimationBus coordination.
 */

import { BaseSection } from '../base-section/BaseSection.js';
import { gsap } from '/assets/js/gsap/all.js';
import { EVENTS } from '../../constants.js';

// Intro animation settings
const INTRO_DURATION = 0.8;
const INTRO_EASE = 'power2.out';

export default class Hero extends BaseSection {
  /**
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(bus) {
    // Initialize BaseSection with hero section ID
    super('hero', bus);

    if (!this.element) {
      console.warn('[Hero] #hero element not found - animations disabled');
      return;
    }

    // Map standardized events for BaseSection playIntro/playOutro emissions
    this.events = {
      introStart: EVENTS.hero.introStart,
      introComplete: EVENTS.hero.introComplete,
      outroStart: EVENTS.hero.outroStart,
      outroComplete: EVENTS.hero.outroComplete,
    };

    // Build animation sequences
    this.createIntro();
  }

  /**
   * Create a simple fade-in intro for the hero section.
   * Uses BaseSection timeline; events emitted by BaseSection.
   */
  createIntro() {
    if (!this.element) return;

    // Ensure starting state
    gsap.set(this.element, { opacity: 0 });

    // Fade in hero
    this.timeline.to(this.element, {
      opacity: 1,
      duration: INTRO_DURATION,
      ease: INTRO_EASE,
    });
  }
}
