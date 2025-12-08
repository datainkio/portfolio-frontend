/** @format */

/**
 * BaseTriggers - Shared foundation for scroll/GSAP triggers per section
 *
 * Manages a collection of triggers and provides lifecycle helpers.
 */

import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';

export default class AbstractSectionTriggers {
  /**
   * @param {HTMLElement|null} element - Target element for triggers
   * @param {string} sectionId - Section identifier
   */
  constructor(element, sectionId) {
    this.element = element;
    this.id = sectionId;
    this._triggers = [];
  }

  /**
   * Register and track a ScrollTrigger (or compatible trigger).
   * @param {object} vars - ScrollTrigger vars
   * @returns {ScrollTrigger}
   */
  register(vars) {
    const trigger = ScrollTrigger.create(vars);
    this._triggers.push(trigger);
    return trigger;
  }

  /** Kill all registered triggers. */
  kill() {
    this._triggers.forEach(t => t.kill());
    this._triggers = [];
  }
}
