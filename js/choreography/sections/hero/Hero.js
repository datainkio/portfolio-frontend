/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.hero.hero
 *   role: Frontend runtime module: js/choreography/sections/hero/Hero.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
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
    // Hero starts in view; track that so the first emitted lifecycle event is exit.
    // Subsequent enter events remain intact for re-entry after scrolling back.
    super({
      view,
      animations,
      triggers,
      events,
      bus,
      reducedMotionHandler,
    });

    this._suppressInitialEnter = true;
    this._hasExitedOnce = false;
    this._initiallyInView = this._isInViewport(view);
    this._suppressEnterUntilExit = this._initiallyInView;
    this.isIntroComplete = false;
    this._introPlaying = false;

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

    this._introPlaying = true;
    this.isIntroComplete = false;

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

  _onIntroStart() {
    // Do not mark intro complete here; wait for completion callback.
    this._introPlaying = true;
    this.isIntroComplete = false;
    this._emit(this.events.introStart, { element: this.view });
  }

  _onIntroComplete() {
    this._introPlaying = false;
    this.isIntroComplete = true;
    this._emit(this.events.introComplete, { element: this.view });
  }

  // Treat the hero as already on screen at load; only emit enter after the first exit.
  _onEnter() {
    if (this._introPlaying || !this.isIntroComplete) return;
    if (this._suppressEnterUntilExit) return;
    this._suppressInitialEnter = false;
    super._onEnter();
  }

  _onEnterBack() {
    if (this._introPlaying || !this.isIntroComplete) return;
    if (this._suppressEnterUntilExit) return;

    super._onEnterBack();
  }

  _onLeave() {
    // Ignore early leave callbacks (e.g., initial layout when hero is already visible)
    if (this._isInViewport(this.view)) return;

    this._suppressEnterUntilExit = false;
    this._hasExitedOnce = true;
    super._onLeave();
  }

  _onLeaveBack() {
    if (this._isInViewport(this.view)) return;

    this._suppressEnterUntilExit = false;
    this._hasExitedOnce = true;
    super._onLeaveBack();
  }

  _isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0
    );
  }
}
