/** @format */
/**
 * Hero Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import HeroAnimations from './HeroAnimations.js';
import HeroTriggers from './HeroTriggers.js';

export default class Hero extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.hero);
    const animations = new HeroAnimations(view, ANIMATION_DEFAULTS);
    const triggers = new HeroTriggers(view);
    const events = EVENTS.hero;

    super({
      view,
      animations,
      triggers,
      events,
      bus,
      reducedMotionHandler,
    });

    // Link triggers back to this section for playIntro/playOutro calls
    if (this.triggers) {
      this.triggers.section = this;
    }

    if (!view) {
      this.logger.trace('element not found; skipping initialization.');
      return;
    }
  }

  /**
   * Play hero intro and emit intro completion reliably.
   *
   * Hero's timeline uses `addPause('intro:end')`, so GSAP's `onComplete` won't
   * fire when playing the timeline normally. Using `tweenTo('intro:end')`
   * ensures we still emit `EVENTS.hero.introComplete` at the intended moment.
   */
  async playIntro() {
    if (this.isDisabled) return Promise.resolve();
    if (this._reducedMotionHandler?.isReducedMotion()) return Promise.resolve();

    return new Promise(resolve => {
      const tl = this.animations?.timeline;
      if (!tl) return resolve();

      this._onIntroStart();

      tl.tweenTo('intro:end', {
        overwrite: true,
        onComplete: () => {
          this._onIntroComplete();
          resolve();
        },
      });
    });
  }
}
