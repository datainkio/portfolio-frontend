/** @format */

/**
 * BaseAnimations - Shared foundation for section animation modules
 *
 * Provides a minimal structure and helpers for building GSAP timelines
 * associated with a specific DOM element and section id.
 */

import { gsap } from '/assets/js/gsap/all.js';
const DURATION = 1.0; // Default duration for animations
const STAGGER = 0.2; // Default stagger duration for animations
export default class AbstractSectionAnimations {
  /**
   * @param {HTMLElement|null} elem - Target element for animations
   * @param {string} sectionId - Section identifier (e.g., 'main-header')
   */
  constructor(elem) {
    this.elem = elem;
    this.timeline = gsap.timeline({ paused: true }); // init timeline instance
    this.DURATION = DURATION; // Default duration for animations
    this.STAGGER = STAGGER; // Default stagger duration for animations
  }

  /**
   * Set the default styles for the element
   * Descendants should override for custom behavior.
   */
  async setDefault(props = {}) {
    gsap.set(this.elem, props);
  }

  /**
   * Intro animation sequence. Descendants should override for custom behavior.
   * @returns {Promise<void>} Resolves when intro animation completes.
   */
  intro() {
    if (!this.elem) {
      return this.timeline;
    }

    this.timeline.clear();
    this.timeline.fromTo(
      this.elem,
      { opacity: 0 },
      { opacity: 1, duration: this.DURATION, ease: 'power1.out' }
    );
    return this.timeline.play(0);
  }

  /**
   * Outro animation sequence. Descendants should override for custom behavior.
   * @returns {Promise<void>} Resolves when outro animation completes.
   */
  outro() {
    if (!this.elem) {
      return this.timeline;
    }

    this.timeline.time(this.timeline.duration());
    return this.timeline.reverse();
  }
}
