import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import SplashAnimations from './SplashAnimations.js';
import SplashTriggers from './SplashTriggers.js';
export default class Splash extends AbstractSection {
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
    super(SELECTORS.splash, bus, { reducedMotionHandler });
    if (!this.element) {
      this.logger.warn('element not found - animations disabled');
      return;
    }

    this.container = document.getElementById(SELECTORS.splash);

    if (!this.container) {
      this.logger.warn('scroll triggers disabled');
    }

    this.events = {
      introStart: EVENTS.splash.introStart,
      introComplete: EVENTS.splash.introComplete,
      outroStart: EVENTS.splash.outroStart,
      outroComplete: EVENTS.splash.outroComplete,
    };

    this.animations = new SplashAnimations(this.element, this.id, ANIMATION_DEFAULTS.splash);
    this._replaceAnimations(this.animations);

    if (this.container) {
      this.splashTriggers = new SplashTriggers(this.container, SELECTORS.splash, this);
      // this.splashTriggers.watchScrollLifecycle();
    }
  }

  _replaceAnimations(splashAnimations) {
    if (!splashAnimations) return;

    super.setAnimations(splashAnimations);
    this._instrumentSplashTimeline();
  }

  // Map GSAP timeline callbacks to standardized AnimationBus events
  // Automagically attaches to the current this.animations.timeline
  _instrumentSplashTimeline() {
    const timeline = this.animations?.timeline;
    if (!timeline) return;

    const hookMap = {
      onStart: EVENTS.splash.introStart,
      onComplete: EVENTS.splash.introComplete,
      onReverse: EVENTS.splash.outroStart,
      onReverseComplete: EVENTS.splash.outroComplete,
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
}
