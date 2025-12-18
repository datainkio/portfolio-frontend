import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import BackgroundVideoAnimations from './BackgroundVideoAnimations.js';
import BackgroundVideoTriggers from './BackgroundVideoTriggers.js';
export default class BackgroundVideo extends AbstractSection {
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
    super(SELECTORS.video, bus, { reducedMotionHandler });
    if (!this.element) {
      this.logger.warn('element not found - animations disabled');
      return;
    }

    this.container = document.getElementById(SELECTORS.video);
    this.videoEl = this.element.querySelector('video');
    if (this.videoEl) {
      this.videoEl.pause(); // Ensure video is paused initially
    }

    if (!this.container) {
      this.logger.warn('scroll triggers disabled');
    }

    // Set initial state
    gsap.set(this.element, {
      yPercent: 100,
      rotation: 20,
      transformOrigin: 'center center',
    });

    // Map standardized events for this section
    this.events = {
      introStart: EVENTS.video.introStart,
      introComplete: EVENTS.video.introComplete,
      outroStart: EVENTS.video.outroStart,
      outroComplete: EVENTS.video.outroComplete,
    };

    // Initialize animations
    this.animations = new BackgroundVideoAnimations(
      this.element,
      this.id,
      ANIMATION_DEFAULTS.video
    );
    this._replaceAnimations(this.animations);

    if (this.container) {
      this.videoTriggers = new BackgroundVideoTriggers(this.container, SELECTORS.video, this);
      // this.videoTriggers.watchScrollLifecycle();
    }
  }

  _replaceAnimations(videoAnimations) {
    if (!videoAnimations) return;

    super.setAnimations(videoAnimations);
    this._instrumentVideoTimeline();
  }

  // Map GSAP timeline callbacks to standardized AnimationBus events
  // Automagically attaches to the current this.animations.timeline
  _instrumentVideoTimeline() {
    const timeline = this.animations?.timeline;
    if (!timeline) return;

    const hookMap = {
      onStart: EVENTS.video.introStart,
      onComplete: EVENTS.video.introComplete,
      onReverse: EVENTS.video.outroStart,
      onReverseComplete: EVENTS.video.outroComplete,
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
