/** @format */

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
    this.duration = 5; // options.duration ?? 1.5;
    this.easeOut = options.ease?.out ?? options.ease ?? 'power1.out';

    this.setDefault(options);
    // Here's where we tell the timeline what to do
    this._reveal();
  }

  async setDefault(options = {}) {
    const collapsedClip = 'inset(50% 0 50% 0)'; // zero-height strip

    super.setDefault({
      clipPath: collapsedClip,
      webkitClipPath: collapsedClip,
      ...options,
    });
  }

  /**
   * Load video src from data-defer-video attribute
   * Called before intro animation starts
   */
  async _loadVideo() {
    this.videoEl = this.view.querySelector('video');

    if (!this.videoEl) return;

    // If video has data-src (deferred loading), set src and load
    if (this.videoEl.dataset.deferVideo && this.videoEl.dataset.src) {
      this.videoEl.src = this.videoEl.dataset.src;
      this.videoEl.load();
    }

    // Return promise that resolves when video can play
    return new Promise(resolve => {
      if (this.videoEl.readyState >= 2) {
        // Video already has enough data to play
        resolve();
      } else {
        // Wait for canplay event
        const handleCanPlay = () => {
          this.videoEl.removeEventListener('canplay', handleCanPlay);
          resolve();
        };
        this.videoEl.addEventListener('canplay', handleCanPlay);
      }
    });
  }

  // Override AbstractSectionAnimations
  async intro() {
    // Load video before animation starts
    await this._loadVideo();

    // Play video and return the timeline play promise
    if (this.videoEl) {
      this.videoEl.play();
    }

    return this.timeline.play(0);
  }

  _reveal() {
    const collapsedClip = 'inset(50% 0 50% 0)';
    const targetClip = 'inset(0% 0% 0% 0%)'; // full element width/height

    this.timeline
      .fromTo(
        this.view,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: this.duration * 0.5, ease: 'power1.out' }
      )
      .fromTo(
        this.view,
        {
          clipPath: collapsedClip,
          webkitClipPath: collapsedClip,
        },
        {
          clipPath: targetClip,
          webkitClipPath: targetClip,
          ease: this.easeOut,
          duration: this.duration,
        }
      );
  }

  outro() {
    // Pause video on outro
    if (this.videoEl) {
      this.videoEl.pause();
    }

    // Delegates base outro behavior (cleanup and exit sequencing) to the abstract class
    return super.outro();
  }
}
