/** @format */

import BaseTriggers from '../base-section/BaseTriggers.js';

export default class HeroTriggers extends BaseTriggers {
  constructor(element, sectionId, section) {
    super(element, sectionId);
    this.section = section;
  }

  /**
   * Watches the hero section and plays the outro when it scrolls past the top of the viewport.
   */
  watchScrollLifecycle() {
    if (!this.element) return;

    this.register({
      trigger: this.element,
      start: 'top top',
      end: 'bottom top',
      scrub: false,
      onLeave: () => this.section?.playOutro(),
      onEnterBack: () => this.section?.playIntro(),
    });
  }

  destroy() {
    this.kill();
    this.section = null;
  }
}
