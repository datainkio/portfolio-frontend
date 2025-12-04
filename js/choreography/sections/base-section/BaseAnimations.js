/** @format */

/**
 * BaseAnimations - Shared foundation for section animation modules
 *
 * Provides a minimal structure and helpers for building GSAP timelines
 * associated with a specific DOM element and section id.
 */

import { gsap } from '/assets/js/gsap/all.js';
const DURATION = 1.0; // Default duration for animations
export default class BaseAnimations {
  /**
   * @param {HTMLElement|null} element - Target element for animations
   * @param {string} sectionId - Section identifier (e.g., 'main-header')
   */
  constructor(element, sectionId) {
    this.element = element;
    this.id = sectionId;
    this.timeline = gsap.timeline({ paused: true });
    this.DURATION = DURATION; // Default duration for animations
  }

  /**
   * Set the default styles for the element
   * Descendants should override for custom behavior.
   */
  async setDefault(props = {}) {
    gsap.set(this.element, props);
  }

  /**
   * Intro animation sequence. Descendants should override for custom behavior.
   * @returns {Promise<void>} Resolves when intro animation completes.
   */
  async intro() {
    // Default: no-op. Override in subclass.
    return Promise.resolve();
  }

  /**
   * Outro animation sequence. Descendants should override for custom behavior.
   * @returns {Promise<void>} Resolves when outro animation completes.
   */
  async outro() {
    // Default: no-op. Override in subclass.
    return Promise.resolve();
  }
}
