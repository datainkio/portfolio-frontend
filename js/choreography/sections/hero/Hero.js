/** @format */

/**
 * Hero Section Controller
 *
 * Simple intro fade-in that emits standardized events from constants.js.
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import { AbstractSection } from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import HeroAnimations from './HeroAnimations.js';
import HeroTriggers from './HeroTriggers.js';

export default class Hero extends AbstractSection {
  /**
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(bus) {
    super(SELECTORS.heroTitle, bus);

    if (!this.element) {
      console.warn('[Hero] #main-title element not found - animations disabled');
      return;
    }

    this.container = document.getElementById(SELECTORS.hero);
    if (!this.container) {
      console.warn('[Hero] #main-header container missing - scroll triggers disabled');
    }

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
   * Play the hero intro animation via BaseSection helper.
   * Ensures standardized events fire through AnimationBus.
   */
  async playIntro() {
    return super.playIntro();
  }

  /**
   * Play the hero outro animation in parallel with the base timeline reverse.
   */
  async playOutro() {
    return super.playOutro();
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

    const hookMap = {
      onStart: EVENTS.hero.introStart,
      onComplete: EVENTS.hero.introComplete,
      onReverse: EVENTS.hero.outroStart,
      onReverseComplete: EVENTS.hero.outroComplete,
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
