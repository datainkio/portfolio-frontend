/** @format */

import { gsap } from '/assets/js/gsap/all.js';
import BaseAnimations from '../base-section/BaseAnimations.js';

export default class HeroAnimations extends BaseAnimations {
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
    console.log('[HeroAnimations] Playing intro animation');

    super.intro();
  }

  playOutro() {
    console.log('[HeroAnimations] Playing outro animation');
    super.outro();
  }
}
