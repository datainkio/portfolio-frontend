/** @format */

/**
 * Biography Section Controller
 *
 * Simple intro fade-in that emits standardized events from constants.js.
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import { AbstractSection } from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import BiographyAnimations from './BiographyAnimations.js';
import BiographyTriggers from './BiographyTriggers.js';

export default class Biography extends AbstractSection {
  /**
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(bus) {
    super(SELECTORS.biography, bus);

    if (!this.element) {
      console.warn('[Biography] #main-title element not found - animations disabled');
      return;
    }

    this.container = document.getElementById(SELECTORS.biography);
    if (!this.container) {
      console.warn('[Biography] #main-header container missing - scroll triggers disabled');
    }

    this.events = {
      introStart: EVENTS.biography.introStart,
      introComplete: EVENTS.biography.introComplete,
      outroStart: EVENTS.biography.outroStart,
      outroComplete: EVENTS.biography.outroComplete,
    };

    this.bioAnimations = new BiographyAnimations(
      this.element,
      this.id,
      ANIMATION_DEFAULTS.biography
    );
    this._replaceAnimations(this.bioAnimations);

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
