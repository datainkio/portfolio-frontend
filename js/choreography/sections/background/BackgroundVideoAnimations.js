/** @format */

import { gsap, ScrambleTextPlugin } from '/assets/js/gsap/all.js';
import { SplitText } from '/assets/js/gsap/SplitText.js';
gsap.registerPlugin(ScrambleTextPlugin, SplitText);
import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

const DURATION = 0.75; // Default duration for animations
const STAGGER = 0.5; // Default stagger duration for animations
const REVEAL_DELAY = 0; // Delay before starting reveal animations
const SPEED = 0.2; // Speed of the scramble text effect
const EASE = 'power1.out';

export default class BackgroundVideoAnimations extends AbstractSectionAnimations {
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
    // this.timeline.add(this._scramble());
    this.setDefault({});
  }

  async setDefault(props = {}) {
    super.setDefault(props);
  }

  intro() {
    this.videoEl = this.element.querySelector('video');
    if (this.videoEl) {
      this.videoEl.play();
    }
    var tl = gsap.timeline();
    tl.to(this.element, {
      yPercent: 0,
      rotation: 0,
      duration: 1.5,
      ease: 'power2.out',
    });
    return tl.play(0);
  }

  outro() {
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }
}
