/** @format */

import { gsap, ScrambleTextPlugin } from '/assets/js/gsap/all.js';
gsap.registerPlugin(ScrambleTextPlugin);
import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

const DURATION = 5; // Default duration for animations
const STAGGER = 5; // Default stagger duration for animations
const REVEAL_DELAY = 0; // Delay before starting reveal animations
const SPEED = 0.1; // Speed of the scramble text effect
const EASE = 'power1.out';

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
    this.originalText = this.element?.textContent || '';

    // Here's where we tell the timeline what to do
    this.timeline.add(this._scramble());
    this.setDefault({});
  }

  async setDefault(props = {}) {
    this.element.textContent = '';
    console.log(this.element.textContent);
    super.setDefault(props);
  }

  intro() {
    return this.timeline.play(0);
  }

  outro() {
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }

  _scramble() {
    return gsap.to(this.element, {
      duration: DURATION,
      scrambleText: {
        text: this.originalText,
        revealDelay: REVEAL_DELAY,
        speed: SPEED,
      },
    });
  }
}
