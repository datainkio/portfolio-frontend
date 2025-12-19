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
  constructor(element, options = {}) {
    super(element);
    this.options = options;
    this.originalText = this.element?.textContent || '';

    // Build animations directly on this.timeline instead of nesting
    this._buildScrambleAnimation();
    super.setDefault(options);
  }

  // Override AbstractSectionAnimations
  intro() {
    // Return the play promise so AbstractSection can await completion
    return this.timeline.play(0);
  }

  outro() {
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }

  _buildScrambleAnimation() {
    const split = new SplitText(this.elem, { type: 'words' });

    split.words.forEach((word, index) => {
      word.classList.add('w-full');
      const finalText = word.textContent;
      word.textContent = '';

      this.timeline.to(
        word,
        {
          duration: DURATION,
          scrambleText: {
            text: finalText,
            revealDelay: REVEAL_DELAY,
            speed: SPEED,
          },
          ease: EASE,
        },
        index * STAGGER
      );
    });
  }
}
