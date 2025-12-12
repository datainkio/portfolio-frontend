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
  /**
   * Inherited from AbstractSection
   *
   * Properties:
   * - id: Unique section identifier derived from selector
   * - element: Root DOM element for the section
   * - bus: AnimationBus instance for cross-section coordination
   * - logger: Lumberjack logger with section-scoped tagging
   * - animations: Section animation bundle with `timeline` and `outroTimeline`
   * - reducedMotionHandler: Helper to respect user motion preferences
   * - _introPlayedKey: Storage key to track whether intro has played
   * - _introTl: GSAP Timeline for the intro sequence
   *
   * Methods:
   * - setAnimations(bundle): Register animation timelines for the section
   * - playIntro(): Plays intro timeline and emits standardized events
   * - playOutro(): Reverses timeline or plays outro, emitting events
   * - pause(): Pauses active timelines
   * - resume(): Resumes paused timelines
   * - reset(): Resets timelines/state to initial configuration
   * - destroy(): Cleans up triggers/timelines and listeners
   * - _createIntroTimeline(): Hook for subclasses to provide intro timeline
   */
  constructor({ bus = null, reducedMotionHandler } = {}) {
    super(SELECTORS.heroTitle, bus, { reducedMotionHandler });
    if (!this.element) {
      this.logger.warn('element not found - animations disabled');
      return;
    }

    this.container = document.getElementById(SELECTORS.heroTitle);

    if (!this.container) {
      this.logger.warn('scroll triggers disabled');
    }

    this.events = {
      introStart: EVENTS.hero.introStart,
      introComplete: EVENTS.hero.introComplete,
      outroStart: EVENTS.hero.outroStart,
      outroComplete: EVENTS.hero.outroComplete,
    };

    this.animations = new HeroAnimations(this.element, this.id, ANIMATION_DEFAULTS.hero);
    this._replaceAnimations(this.animations);

    if (this.container) {
      this.heroTriggers = new HeroTriggers(this.container, SELECTORS.hero, this);
      this.heroTriggers.watchScrollLifecycle();
    }
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

    super.setAnimations(heroAnimations);
    this._instrumentHeroTimeline();
  }

  // Map GSAP timeline callbacks to standardized AnimationBus events
  // Automagically attaches to the current this.animations.timeline
  _instrumentHeroTimeline() {
    const timeline = this.animations?.timeline;
    if (!timeline) return;

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
