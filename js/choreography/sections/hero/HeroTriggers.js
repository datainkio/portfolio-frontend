/** @format */

import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
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
      start: 'bottom bottom-=50',
      onEnter: () => this.section?.playOutro?.(),
      onLeaveBack: () => this.section?.animations?.outroReverse?.(),
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
