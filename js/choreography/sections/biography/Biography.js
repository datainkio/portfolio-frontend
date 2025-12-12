/** @format */

/**
 * Biography Section Controller
 *
 * Simple intro fade-in that emits standardized events from constants.js.
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import BiographyAnimations from './BiographyAnimations.js';
import BiographyTriggers from './BiographyTriggers.js';

export default class Biography extends AbstractSection {
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
  /**
   * Extends AbstractSectionAnimations, which:
   * - Stores the section root element and ID
   * - Sets up shared GSAP timeline primitives and intro/outro hooks
   * - Provides common utilities (pause/resume/reset) used by sections
   *
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(bus, { reducedMotionHandler } = {}) {
    super(SELECTORS.biography, bus, { reducedMotionHandler });
    if (!this.element) {
      this.logger.warn('element not found - animations disabled');
      return;
    }

    this.container = document.getElementById(SELECTORS.biography);

    if (!this.container) {
      this.logger.warn('container missing - scroll triggers disabled');
    }

    this.events = {
      introStart: EVENTS.biography.introStart,
      introComplete: EVENTS.biography.introComplete,
      outroStart: EVENTS.biography.outroStart,
      outroComplete: EVENTS.biography.outroComplete,
    };

    this.animations = new BiographyAnimations(this.element, this.id, ANIMATION_DEFAULTS.biography);
    this._replaceAnimations(this.animations);

    if (this.container) {
      this.bioTriggers = new BiographyTriggers(this.container, SELECTORS.biography, this);
      this.bioTriggers.watchScrollLifecycle();
    }
  }

  /**
   * Play the biography intro animation via BaseSection helper.
   * Ensures standardized events fire through AnimationBus.
   */
  async playIntro() {
    return super.playIntro();
  }

  /**
   * Play the biography outro animation in parallel with the base timeline reverse.
   */
  async playOutro() {
    return super.playOutro();
  }

  destroy() {
    this.bioTriggers?.destroy();
    this.bioAnimations?.outroTimeline?.kill();
    super.destroy();
  }

  _replaceAnimations(bioAnimations) {
    if (!bioAnimations) return;

    this.setAnimations(bioAnimations);
    this._instrumentBiographyTimeline();
  }

  _instrumentBiographyTimeline() {
    const timeline = this.animations?.timeline;
    if (!timeline) return;

    const hookMap = {
      onStart: EVENTS.biography.introStart,
      onComplete: EVENTS.biography.introComplete,
      onReverse: EVENTS.biography.outroStart,
      onReverseComplete: EVENTS.biography.outroComplete,
    };

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
