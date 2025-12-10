/** @format */
/**
 * Hero Section Controller
 *
 * Simple intro fade-in that emits standardized events from constants.js.
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import HeroAnimations from './HeroAnimations.js';
import HeroTriggers from './HeroTriggers.js';

export default class Hero extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    // AbstractSection expects a root element selector and optional bus
    super(SELECTORS.heroTitle, bus, { reducedMotionHandler });
    this.container = document.getElementById(SELECTORS.heroTitle);
    if (!this.container) {
      this.logger.warn('[Hero] #hero-title container missing - scroll triggers disabled');
    }
    // Abstract Section initilization:
    // - Sets this.id, this.bus, this.element
    // - Warns and returns early if element not found
    // - Initializes _this.reducedMotionHandler, _introPlayedKey, _introTl

    // Standardized event keys for Hero section lifecycle lets us delegate to AbstractSection
    this.events = {
      introStart: EVENTS.hero.introStart,
      introComplete: EVENTS.hero.introComplete,
      outroStart: EVENTS.hero.outroStart,
      outroComplete: EVENTS.hero.outroComplete,
    };

    this.heroAnimations = new HeroAnimations(this.element, this.id, ANIMATION_DEFAULTS.hero);
    this._replaceAnimations(this.heroAnimations);

    if (this.container) {
      this.heroTriggers = new HeroTriggers(this.container, SELECTORS.hero, this);
      this.heroTriggers.watchScrollLifecycle();
    }
  }

  /**
   * AbstractSection calls this to build the intro timeline.
   * Return a GSAP timeline or null if no intro.
   */
  _createIntroTimeline() {
    // ...existing code...
    // Example:
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.from('#hero-title', { autoAlpha: 0, y: 40, duration: 0.8 }).from(
      '#hero-subtitle',
      { autoAlpha: 0, y: 20, duration: 0.6 },
      '-=0.3'
    );
    return tl;
    // return this.heroAnimations?.timeline ?? null;
  }

  _applyPostIntroState() {
    gsap.set('#hero-title', { autoAlpha: 1, y: 0 });
    gsap.set('#hero-subtitle', { autoAlpha: 1, y: 0 });
    // ...set any other end-state properties...
  }

  destroy() {
    this.heroTriggers?.destroy();
    this.heroAnimations?.outroTimeline?.kill();
    super.destroy();
  }

  _replaceAnimations(heroAnimations) {
    if (!heroAnimations) return;

    this.setAnimations(heroAnimations);
    this._instrumentHeroTimeline();
  }

  _instrumentHeroTimeline() {
    const timeline = this.animations?.timeline;
    if (!timeline) return;

    // Map timeline callbacks to standardized GSAP timeline event keys
    const hookMap = {
      onStart: EVENTS.hero.introStart,
      onComplete: EVENTS.hero.introComplete,
      onReverse: EVENTS.hero.outroStart,
      onReverseComplete: EVENTS.hero.outroComplete,
    };

    // Automagically attach all callbacks in hookMap to the timeline
    Object.entries(hookMap).forEach(([callback, eventKey]) => {
      this._wrapTimelineCallback(timeline, callback, eventKey);
    });
  }

  _wrapTimelineCallback(timeline, callbackName, eventKey) {
    const existing = timeline.eventCallback(callbackName);

    timeline.eventCallback(callbackName, (...args) => {
      if (typeof existing === 'function') {
        existing.apply(timeline, args);
      }
    });
  }

  _setupScrollAnimations() {
    // ...existing code...
  }
}
