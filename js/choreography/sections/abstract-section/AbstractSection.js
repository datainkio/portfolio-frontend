/**
 * AbstractSection - Foundation class for section animation controllers
 *
 * Provides standard lifecycle and event coordination for all section controllers.
 * Subclasses override createIntro(), createOutro(), and createScrollTriggers().
 *
 * Lifecycle:
 * 1. Constructor initializes timeline and element
 * 2. createIntro/Outro/ScrollTriggers define animations (override in subclass)
 * 3. playIntro/playOutro execute animations and emit events
 *
 * Dependencies:
 * - AnimationBus for event coordination
 */

import AbstractSectionAnimations from './AbstractSectionAnimations.js';
import AbstractSectionTriggers from './AbstractSectionTriggers.js';
import NullAnimationBus from '../../NullAnimationBus.js';
import lumberjack from '/assets/js/utils/lumberjack/index.js';

export default class AbstractSection {
  /**
   * Initialize section controller
   *
   * Accepts configuration object with all initialization parameters.
   * Subclasses override createIntro(), createOutro(), and createScrollTriggers().
   *
   * @param {Object} options - Configuration object
   * @param {HTMLElement} options.view - DOM element for the section
   * @param {AbstractSectionAnimations} options.animations - Animation module instance
   * @param {AbstractSectionTriggers} options.triggers - Triggers module instance
   * @param {Object} options.events - Event name mapping (e.g., EVENTS.hero)
   * @param {AnimationBus} options.bus - Event bus for coordination (optional)
   * @param {ReducedMotionHandler} options.reducedMotionHandler - Motion preference handler (optional)
   */
  constructor({ view, animations, triggers, events, bus, reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: '#007bff',
      enabled: true,
    });

    this.view = view;
    this.isDisabled = !view;
    this.bus = bus ?? new NullAnimationBus();
    this._reducedMotionHandler = reducedMotionHandler;

    if (this.isDisabled) {
      this.logger.trace('element not found; section disabled');
      return;
    }

    this.events = events || {};
    // Use provided modules; fall back to defaults
    this.triggers = triggers ?? new AbstractSectionTriggers(this.view);
    this.animations = animations ?? new AbstractSectionAnimations(this.view);

    // Respect reduced motion: skip intro and apply end state immediately.
    if (this._reducedMotionHandler?.isReducedMotion()) {
      this._applyPostIntroState();
      return;
    }
    this._bindCallbacks();
  }

  // Generic enter/exit hooks used by ScrollTrigger bindings
  _onEnter() {
    this._emit(this.events.enter, { element: this.view });
  }

  _onLeave() {
    this._emit(this.events.exit, { element: this.view });
  }

  _onEnterBack() {
    this._emit(this.events.enter, { element: this.view });
  }

  _onLeaveBack() {
    this._emit(this.events.exit, { element: this.view });
  }

  _onIntroStart() {
    this.isIntroComplete = true;
    this._emit(this.events.introStart, { element: this.view });
  }

  _onIntroComplete() {
    this.isIntroComplete = true;
    this._emit(this.events.introComplete, { element: this.view });
  }

  _onOutroStart() {
    this.isOutroComplete = false;
    this._emit(this.events.outroStart, { element: this.view });
  }

  _onOutroComplete() {
    this.isOutroComplete = true;
    this._emit(this.events.outroComplete, { element: this.view });
  }

  /**
   * Play intro animation
   *
   * Executes intro timeline and emits coordination events.
   * Emits intro:start immediately, intro:complete when finished.
   *
   * @returns {Promise<void>} Resolves when animation completes
   */
  async playIntro() {
    if (this.isDisabled) return Promise.resolve();

    return new Promise(resolve => {
      const tl = this.animations.timeline;
      if (!tl) return resolve();

      tl.eventCallback('onStart', () => this._onIntroStart());
      tl.eventCallback('onComplete', () => {
        this._onIntroComplete();
        resolve();
      });
      tl.eventCallback('onReverseComplete', null);

      this.animations.intro();
    });
  }

  /**
   * Play outro animation
   *
   * Reverses timeline and emits coordination events.
   * For scroll-based outros, may just emit events while ScrollTrigger handles animation.
   *
   * @returns {Promise<void>} Resolves when animation completes
   */
  async playOutro() {
    if (this.isDisabled) return Promise.resolve();

    return new Promise(resolve => {
      const tl = this.animations.timeline;
      if (!tl) return resolve();

      tl.eventCallback('onStart', () => this._onOutroStart());
      tl.eventCallback('onComplete', () => {
        this._onOutroComplete();
        resolve();
      });
      tl.eventCallback('onReverseComplete', null);

      this.animations.outro();
    });
  }

  // Map GSAP timeline callbacks to standardized AnimationBus events.
  _bindCallbacks() {
    if (!this.triggers) return;

    this.triggers.bind({
      onEnter: () => this._onEnter(),
      onLeave: () => this._onLeave(),
      onEnterBack: () => this._onEnterBack(),
      onLeaveBack: () => this._onLeaveBack(),
    });
  }

  // Safe bus emitter
  _emit(eventName, payload) {
    if (!eventName) return;
    this.bus.emit(eventName, payload);
  }

  /**
   * Apply post-intro state without animation
   *
   * Used when reduced motion is enabled to skip animations and immediately
   * apply the final state. Respects user accessibility preferences.
   */
  _applyPostIntroState() {
    if (!this.animations?.timeline) return;

    // Jump to end of timeline without playing
    this.animations.timeline.progress(1, false);
    this.isIntroComplete = true;

    // Emit completion event so other systems know section is ready
    this._emit(this.events.introComplete, { element: this.view });
  }

  /**
   * Reset section to initial state
   *
   * Resets timeline and state flags for replay or testing.
   */
  reset() {
    this.animations.timeline.pause(0);
    this.isIntroComplete = false;
    this.isOutroComplete = false;
    this.isScrollActive = false;

    this._emit(`section:${this.id}:reset`, {
      sectionId: this.id,
      element: this.view,
    });
  }

  /**
   * Cleanup and remove all animations
   *
   * Kills timeline and ScrollTriggers. Section cannot be reused after destroy().
   */
  destroy() {
    if (this.timeline) {
      this.timeline.kill();
    }

    // Remove ScrollTriggers registered via AbstractSectionTriggers
    this.triggers?.kill?.();

    this._emit(`section:${this.id}:destroy`, {
      sectionId: this.id,
    });

    this.view = null;
    this.timeline = null;
  }
}
