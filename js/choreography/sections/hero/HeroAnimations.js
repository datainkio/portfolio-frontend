/** @format */

import BaseAnimations from '../base-section/BaseAnimations.js';
import { gsap } from '/assets/js/gsap/all.js';
import { SplitText } from '/assets/js/gsap/SplitText.js';

// Register GSAP plugins
gsap.registerPlugin(SplitText);

/**
 * HeroAnimations - Section-specific animations for Hero
 * Extends BaseAnimations to inherit shared timeline structure.
 */
export default class HeroAnimations extends BaseAnimations {
  setDefault() {
    super.setDefault({
      scaleY: 0,
      transformOrigin: '0% 0%',
    });
  }

  borderReveal(tl) {
    // Animate parent container opacity + position to reveal split words
    tl.fromTo(
      this.element,
      { scaleY: 0, transformOrigin: '0% 0%' },
      { scaleY: 1, duration: this.DURATION, ease: 'power3.out' },
      0 // Start at timeline position 0
    );
  }

  /**
   * Directional word animation with SplitText
   * @param {string} direction - "in" to reveal words, "out" to hide words
   * @returns {gsap.core.Timeline} Animation timeline
   */
  lines(direction = 'in') {
    if (!this.element) return null;

    // Split h1 text into words using GSAP SplitText
    const split = new SplitText(this.element, { type: 'words' });
    const tl = gsap.timeline();

    if (direction === 'in') {
      // Reveal border and container first
      this.borderReveal(tl);

      // Animate words with stagger
      tl.fromTo(
        split.words,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: this.DURATION,
          ease: 'power3.out',
          stagger: 0.1,
        }
      );
    } else if (direction === 'out') {
      // Animate words in reverse order (last to first) fading out and moving up
      tl.fromTo(
        split.words,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: -30,
          duration: this.DURATION,
          ease: 'power3.in',
          stagger: {
            amount: 0.1 * split.words.length,
            from: 'end', // Start animation from last word
          },
        }
      );
    }

    return tl;
  }

  roll() {
    if (!this.element) return null;
    // Placeholder: create a minimal tween to ensure timeline exists.
    // Integrate with TextParty.roll when available in runtime.
    const tl = gsap.timeline();
    tl.fromTo(
      this.element,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: this.DURATION, ease: 'power2.out' }
    );
    return tl;
  }

  /**
   * Pinned fade-out outro animation
   * Keeps title fixed at top while fading to transparent
   * @returns {gsap.core.Timeline} Animation timeline
   */
  fadeOut() {
    if (!this.element) return null;

    const tl = gsap.timeline();
    tl.to(this.element, {
      opacity: 0,
      duration: this.DURATION,
      ease: 'power2.inOut',
    });

    return tl;
  }
}
