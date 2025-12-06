/** @format */

/**
 * Hero Section Animation Functions
 *
 * Reusable animation builders for hero title effects.
 *
 * @module Hero/HeroTriggers
 */

import BaseTriggers from '../base-section/BaseTriggers.js';
import { gsap } from '/assets/js/gsap/all.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import { EVENTS } from '../../constants.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const START = 'center center';
const END = 'bottom center';
const SCRUB = 1;
/**
 * HeroTriggers - ScrollTrigger setup for Hero section
 * Extends BaseTriggers to inherit registration and cleanup.
 */
export default class HeroTriggers extends BaseTriggers {
  /**
   * Create standard scroll triggers for hero title.
   * @param {object} options - { start, end, scrub, animation, bus }
   */
  build(options = {}) {
    if (!this.element) return;
    const { start = START, end = END, scrub = SCRUB, animation = null, bus = null } = options;

    this.register({
      trigger: this.element,
      start,
      end,
      scrub,
      animation,
      onEnter: () => {
        if (bus)
          bus.emit(EVENTS.hero.scrollEnter, {
            sectionId: this.id,
            element: this.element,
          });
      },
      onLeave: () => {
        if (bus) {
          bus.emit(EVENTS.hero.scrollExit, { sectionId: this.id, element: this.element });
          bus.emit(EVENTS.hero.outroStart, { sectionId: this.id, element: this.element });
        }
      },
    });
  }

  /**
   * Create pinned outro trigger with animation
   * Pins parent section at top and animates element out during scroll
   * Uses pinSpacing to maintain section height throughout animation
   * @param {object} options - { animation, end }
   */
  buildOutro(options = {}) {
    if (!this.element) return;

    const { animation = null, end = '+=100%' } = options;

    // Pin the parent section to maintain height
    const section = this.element.closest('section');
    if (!section) return;

    this.register({
      trigger: section,
      start: 'top top',
      end,
      pin: section,
      pinSpacing: true,
      scrub: true,
      animation,
      markers: false,
    });
  }
}
