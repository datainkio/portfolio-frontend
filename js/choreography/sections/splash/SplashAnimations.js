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

    // this.timeline.add(gel.play(), 0);
    this.timeline.add(this._fill(), 0);
  }

  _fill() {
    return TextParty.fill(this.element.querySelector('.brand'), {
      duration: 2,
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
    }).pause();
  }

  _gel() {
    return TextParty.gel(this.element.querySelector('.brand'), {
      duration: 2,
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
    }).pause();
  }

  _roll() {
    return TextParty.roll(this.element.querySelector('.brand'), {
      duration: 2,
      stagger: 0.25,
      repeat: -1,
      yoyo: true,
    });
  }

  intro() {
    return this.timeline.play(0);
  }

  outro() {
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }
}
