/** @format */

import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger';
import AbstractSectionTriggers from '../abstract-section/AbstractSectionTriggers.js';

export default class HeroTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._outroTrigger = null;
  }

  bind(callbacks = {}) {
    // Preserve the base trigger bindings for enter/leave events
    super.bind(callbacks);
    if (!this.view) return;

    // Kill existing custom trigger before re-creating
    this._outroTrigger?.kill();

    this._outroTrigger = ScrollTrigger.create({
      trigger: this.view,
      start: 'center center',
      end: 'center center',
      scrub: true,
      onLeave: () => this.section?.playOutro?.(),
      onEnter: () => this.section?.animations?.outroReverse?.(),
      onEnterBack: () => this.section?.animations?.outroReverse?.(),
    });
  }

  destroy() {
    this.kill();
    this.section = null;
  }

  kill() {
    super.kill();
    this._outroTrigger?.kill();
    this._outroTrigger = null;
  }
}
