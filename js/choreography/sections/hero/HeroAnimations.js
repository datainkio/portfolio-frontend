/** @format */
import lumberjack from '@datainkio/lumberjack';
import { ANIMATION_DEFAULTS } from '../../config.js';
import { gsap, SplitText } from '/assets/js/choreography/vendor/gsap.js';
import ScrambleText from 'https://cdn.skypack.dev/gsap@3.13.0/ScrambleTextPlugin';
gsap.registerPlugin(ScrambleText);
import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

// const Y_OFFSET = 35; // Default Y offset for animations
// const DURATION = 0.5; // Default duration for animations
// const STAGGER = 0.25; // Default stagger duration for animations
// const REVEAL_DELAY = 0; // Delay before starting reveal animations
// const SPEED = 0.2; // Speed of the scramble text effect
// const EASE = 'power1.out';

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
    // this.gelSelector = options.gelSelector || '#bg-gel-0';
    // this.gelEl = document.querySelector(this.gelSelector);

    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: '#007bff',
      enabled: true,
    });

    this.Y_OFFSET = ANIMATION_DEFAULTS.translateY;
    // Build animations directly on this.timeline instead of nesting
    //  this._buildScrambleAnimation('intro');
    // this._buildWordByWordAnimation('intro');
    // this._buildOutroThrow('outro');
    // super.setDefault(this.options);
  }

  // Override AbstractSectionAnimations
  intro() {
    // Return the play promise so AbstractSection can await completion
    return this.timeline.play('intro');
  }

  outro() {
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return this.timeline.play('outro');
  }

  outroReverse() {
    return this.timeline.reverse('outro:end');
  }

  _buildWordByWordAnimation(label) {
    const introLabel = label;
    const introEndLabel = `${label}:end`;

    this.timeline.addLabel(introLabel, 0);
    this.timeline.set(this.view, { autoAlpha: 1 }, introLabel);
    const split = new SplitText(this.view, { type: 'words' });

    split.words.forEach((word, index) => {
      word.classList.add('w-full');
      this.timeline.fromTo(
        word,
        { autoAlpha: 0, yPercent: this.Y_OFFSET },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: this.DURATION,
          ease: this.EASE,
        },
        `${introLabel}+=${index * this.STAGGER}`
      );
    });
    // Pause after intro completes to prevent running into outro automatically
    this.timeline.addLabel(introEndLabel, this.timeline.duration());
    this.timeline.addPause(introEndLabel);
  }

  _buildScrambleAnimation(label) {
    const introLabel = label;
    const introEndLabel = `${label}:end`;

    this.timeline.addLabel(introLabel, 0);
    const split = new SplitText(this.view, { type: 'words' });

    split.words.forEach((word, index) => {
      word.classList.add('w-full');
      const finalText = word.textContent;
      word.textContent = '';

      this.timeline.to(
        word,
        {
          duration: this.DURATION,
          scrambleText: {
            text: finalText,
            revealDelay: 0,
            speed: 1,
          },
          ease: this.EASE,
        },
        `${introLabel}+=${index * this.STAGGER}`
      );
    });

    // Pause after intro completes to prevent running into outro automatically
    this.timeline.addLabel(introEndLabel, this.timeline.duration());
    this.timeline.addPause(introEndLabel);
  }

  _buildOutroThrow(label) {
    const outroLabel = label;
    const outroEndLabel = `${label}:end`;
    const outroTargets = [this.view];

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
