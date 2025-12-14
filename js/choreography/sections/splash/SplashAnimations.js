/** @format */

import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';
import * as TextParty from '../../../effects/TextParty.js';

export default class SplashAnimations extends AbstractSectionAnimations {
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
    //console.log(this._threedee());
    this.timeline.add(this._threedee());
  }

  intro() {
    return this.timeline.play(0);
  }

  outro() {
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }

  _threedee() {
    const element = this.element.querySelector('.brand');
    const tl = TextParty.gel(element, ['text-primary-500', 'text-secondary-600']);
    // Add animation steps to the timeline here
    return tl;
  }
}
