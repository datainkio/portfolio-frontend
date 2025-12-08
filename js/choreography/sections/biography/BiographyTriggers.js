/** @format */

import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class BiographyTriggers extends AbstractSectionTriggers {
  constructor(element, sectionId, section) {
    super(element, sectionId);
    this.section = section;
  }

  /**
   * Watches the hero section and plays the outro when it scrolls past the top of the viewport.
   */
  watchScrollLifecycle() {
    if (!this.element) return;

    // Ensure we only have a single ScrollTrigger watching the hero lifecycle
    this.kill();

    this.register({
      trigger: this.element,
      start: 'top top',
      // Keep the trigger active for a single pixel past the start line so leaving means the hero top is above the viewport
      end: '+=1',
      scrub: false,
      onLeave: self => {
        // Direction 1 indicates scrolling down past the trigger point
        if (self.direction === 1) {
          this.section?.playOutro();
        }
      },
      onEnterBack: () => {
        this.section?.playIntro();
      },
    });
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
