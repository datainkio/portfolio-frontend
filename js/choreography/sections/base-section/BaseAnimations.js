/** @format */

/**
 * BaseAnimations - Shared foundation for section animation modules
 *
 * Provides a minimal structure and helpers for building GSAP timelines
 * associated with a specific DOM element and section id.
 */

import { gsap } from '/assets/js/gsap/all.js';

export default class BaseAnimations {
  /**
   * @param {HTMLElement|null} element - Target element for animations
   * @param {string} sectionId - Section identifier (e.g., 'main-header')
   */
  constructor(element, sectionId) {
    this.element = element;
    this.id = sectionId;
    this.timeline = gsap.timeline({ paused: true });
  }
}
