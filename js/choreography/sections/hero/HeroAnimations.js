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
  lines() {
    console.log('HeroAnimations.lines() called');
    if (!this.element) return null;

    // Split h1 text into words using GSAP SplitText
    const split = new SplitText(this.element, { type: 'words' });

    const tl = gsap.timeline();

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
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      }
    );

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
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
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
      duration: 1,
      ease: 'power2.inOut',
    });

    return tl;
  }
}
