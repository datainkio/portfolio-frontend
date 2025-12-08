/** @format */

import { gsap } from '/assets/js/gsap/all.js';
import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

export default class BiographyAnimations extends AbstractSectionAnimations {
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
    console.log('[BiographyAnimations] Playing intro animation');
    super.intro();
  }

  playOutro() {
    console.log('[BiographyAnimations] Playing outro animation');
    super.outro();
  }
}
