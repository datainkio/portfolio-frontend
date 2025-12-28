/** @format */

import { gsap, ScrambleTextPlugin } from '/assets/js/gsap/all.js';
import { SplitText } from '/assets/js/gsap/SplitText.js';
gsap.registerPlugin(ScrambleTextPlugin, SplitText);
import AbstractSectionAnimations from '../abstract-section/AbstractSectionAnimations.js';

export default class BackgroundVideoAnimations extends AbstractSectionAnimations {
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

    // Prefer site-wide defaults from config with sensible fallbacks
    this.duration = options.duration ?? 1.5;
    this.easeOut = options.ease?.out ?? options.ease ?? 'power1.out';

    this.setDefault();
    // Here's where we tell the timeline what to do
    this._reveal();
  }

  async setDefault(props = {}) {
    const collapsedClip = 'inset(50% 0 50% 0)'; // zero-height strip

    super.setDefault({
      clipPath: collapsedClip,
      webkitClipPath: collapsedClip,
      ...props,
    });
  }

  // Override AbstractSectionAnimations
  intro() {
    // Return the play promise so AbstractSection can await completion
    return this.timeline.play(0);
  }

  _reveal() {
    this.videoEl = this.view.querySelector('video');

    if (this.videoEl) {
      this.videoEl.play();
    }

    const collapsedClip = 'inset(50% 0 50% 0)';
    const targetClip = 'inset(0% 0% 0% 0%)'; // full element width/height

    this.timeline.fromTo(
      this.view,
      {
        clipPath: collapsedClip,
        webkitClipPath: collapsedClip,
      },
      {
        clipPath: targetClip,
        webkitClipPath: targetClip,
        duration: this.duration,
        ease: this.easeOut,
      }
    );
  }

  outro() {
    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }
}
