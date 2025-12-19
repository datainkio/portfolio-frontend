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
import lumberjack from '/assets/js/utils/lumberjack/index.js';

export default class AbstractSection {
  /**
   * Initialize section controller
   *
   * Subclasses must call super(id, bus, smoother) in constructor,
   * then call createIntro(), createOutro(), and createScrollTriggers().
   *
   * @param {DOMElement} view - DOM element for the section
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(view, anim, triggers, events, bus, { reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: '#007bff',
      enabled: true,
    });

    this.view = view;
    this.bus = bus ?? { emit: () => {}, on: () => () => {} };
    this._reducedMotionHandler = reducedMotionHandler;

    if (!this.view) {
      console.warn(`[${this.constructor.name.toLowerCase()}] element not found - section disabled`);
      return;
    }

    this.events = events || {};
    // Use provided modules; fall back to defaults
    this.triggers = triggers ?? new AbstractSectionTriggers(this.view);
    this.animations = anim ?? new AbstractSectionAnimations(this.view);

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
    this.animations.intro();
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
    this.animations.outro();
  }

  // Map GSAP timeline callbacks to standardized AnimationBus events.
  _bindCallbacks() {
    if (!this.animations.timeline) return;

    this.animations.timeline.eventCallback('onStart', () => {
      this._onIntroStart();
    });

    this.animations.timeline.eventCallback('onComplete', () => {
      this._onIntroComplete();
    });

    this.animations.timeline.eventCallback('onReverseComplete', () => {
      this._onOutroComplete();
    });

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
    if (this.bus && typeof this.bus.emit === 'function') {
      this.bus.emit(eventName, payload);
    } else {
      // Soft warn once per event to avoid noisy logs
      this.logger.trace(`bus.emit unavailable for "${eventName}"`, { payload }, 'brief', 'headsup');
    }
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
