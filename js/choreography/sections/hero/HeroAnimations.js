/** @format */

import { gsap } from '/assets/js/gsap/all.js';
import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

export default class HeroAnimations extends AbstractSectionAnimations {
  /**
   * Extends AbstractSectionAnimations, which:
   * - Stores the section root element and ID
   * - Sets up shared GSAP timeline primitives and intro/outro hooks
   * - Provides common utilities (pause/resume/reset) used by sections
   */
  /**
   * @param {HTMLElement} element
   * @param {string} sectionId
   * @param {Object} options
   */
  constructor(element, sectionId, options = {}) {
    super(element, sectionId);
    this.options = options;
  }

  playIntro() {
    this.logger.trace('playing my intro', this.timeline);
    // Delegates base intro behavior (e.g., timeline setup, shared sequencing) to the abstract class
    return super.intro();
  }

  playOutro() {
    this.logger.trace('playing my outro', this.timeline);
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }
}
