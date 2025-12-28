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
   * @param {HTMLElement} view
   * @param {Object} options
   */
  constructor(view, options = {}) {
    super(view);
    this.options = options;
    this.originalText = this.view?.textContent || '';
    this.gelSelector = options.gelSelector || '#bg-gel-0';
    this.gelEl = document.querySelector(this.gelSelector);

    // Build animations directly on this.timeline instead of nesting
    this._buildScrambleAnimation();
    this._buildOutroThrow();
    super.setDefault(this.options);
  }

  // Override AbstractSectionAnimations
  intro() {
    // Return the play promise so AbstractSection can await completion
    return this.timeline.play('intro');
  }

  outro() {
    this.logger?.trace('outro started');
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return this.timeline.play('outro');
  }

  outroReverse() {
    this.logger?.trace('outro reverse');
    return this.timeline.reverse('outro:end');
  }

  _buildScrambleAnimation() {
    const introLabel = 'intro';
    const introEndLabel = 'intro:end';

    this.timeline.addLabel(introLabel, 0);
    const split = new SplitText(this.view, { type: 'words' });

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
        `${introLabel}+=${index * STAGGER}`
      );
    });

    // Pause after intro completes to prevent running into outro automatically
    this.timeline.addLabel(introEndLabel, this.timeline.duration());
    this.timeline.addPause(introEndLabel);
  }

  _buildOutroThrow() {
    const outroLabel = 'outro';
    const outroEndLabel = 'outro:end';
    const outroTargets = [this.view, this.gelEl].filter(Boolean);

    // Position outro at the end of existing intro animations / pause
    this.timeline.addLabel(outroLabel, this.timeline.duration());

    if (outroTargets.length) {
      this.timeline.to(
        outroTargets,
        {
          duration: 0.6,
          xPercent: -30,
          yPercent: -30,
          rotationZ: -10,
          transformOrigin: '50% 50%',
          ease: 'power2.in',
        },
        outroLabel
      );
    }

    // Pause after outro completes
    this.timeline.addLabel(outroEndLabel, this.timeline.duration());
    this.timeline.addPause(outroEndLabel);
  }
}
