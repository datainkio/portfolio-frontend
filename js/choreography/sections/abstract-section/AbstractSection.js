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
   * @param {DOMElement} elem - DOM element for the section
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(elem, anim, triggers, events, bus, { reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: '#007bff',
      enabled: true,
    });

    this.elem = elem;
    this.bus = bus ?? { emit: () => {}, on: () => () => {} };
    this._reducedMotionHandler = reducedMotionHandler;

    if (!this.elem) {
      console.warn(`[${this.constructor.name.toLowerCase()}] element not found - section disabled`);
      return;
    }

    this.events = events || {};
    // Use provided modules; fall back to defaults
    this.triggers = triggers ?? new AbstractSectionTriggers(this.elem);
    this.setAnimations(anim ?? new AbstractSectionAnimations(this.elem));
  }

  onEnterScroll() {
    // console.log(`[BaseSection] ${this.id}: Entered scroll trigger`);
    this.logger.trace('Entered scroll trigger');
  }

  onExitScroll() {
    // console.log(`[BaseSection] ${this.id}: Exited scroll trigger`);
    this.logger.trace('Exited scroll trigger');
  }

  onIntroStart() {
    // console.log(`[BaseSection] ${this.id}: Intro started`);
    this.logger.trace('My intro has started');
  }

  onIntroComplete() {
    // console.log(`[BaseSection] ${this.id}: Intro complete`);
    this.logger.trace('My intro is complete');
  }

  onOutroStart() {
    // console.log(`[BaseSection] ${this.id}: Outro started`);
    this.logger.trace('My outro has started');
  }

  onOutroComplete() {
    // console.log(`[BaseSection] ${this.id}: Outro complete`);
    this.logger.trace('My outro is complete');
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
    if (!this.elem) {
      this.logger.trace(`Cannot play intro - element not found`);
      return;
    }

    if (this.events.introStart) {
      this._emit(this.events.introStart, { element: this.elem });
    }
    const introRunner =
      typeof this.animations?.intro === 'function'
        ? this.animations.intro()
        : this.timeline?.play(0);

    const waitable =
      introRunner && typeof introRunner.then === 'function' ? introRunner : this.timeline;

    return waitable?.then?.(() => {
      this.isIntroComplete = true;
      if (this.events.introComplete) {
        this._emit(this.events.introComplete, { sectionId: this.id, element: this.elem });
      }
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
    if (!this.elem) {
      this.logger.warn(`Cannot play outro - element not found`);
      return;
    } else {
      // this.logger.trace(`I was told to play my outro animation`);
    }

    // Broadcast standardized event for outro start (subclass-provided)
    if (this.events?.outroStart) {
      this._emit(this.events.outroStart, {
        sectionId: this.id,
        element: this.element,
      });
    } else {
      this.logger.trace(`No outroStart event defined`);
    }

    // GSAP lacks an onReverseStart hook, so fire our callback manually when starting the outro
    this.onOutroStart();

    let outroRunner = null;
    if (typeof this.animations?.outro === 'function') {
      outroRunner = this.animations.outro();
    } else if (this.animations?.outroTimeline) {
      outroRunner = this.animations.outroTimeline.restart();
    } else {
      outroRunner = this.timeline.reverse();
    }

    const activeTimeline = this.animations?.outroTimeline ?? this.timeline;
    const waitable =
      outroRunner && typeof outroRunner.then === 'function' ? outroRunner : activeTimeline;

    return waitable.then(() => {
      this.isOutroComplete = true;
      // Broadcast standardized event for outro complete (subclass-provided)
      if (this.events?.outroComplete) {
        this._emit(this.events.outroComplete, {
          sectionId: this.id,
          element: this.element,
        });
      } else {
        this.logger.trace(`No outroComplete event defined`);
      }
    });
  }

  /**
   * Reset section to initial state
   *
   * Resets timeline and state flags for replay or testing.
   */
  reset() {
    this.timeline.pause(0);
    this.isIntroComplete = false;
    this.isOutroComplete = false;
    this.isScrollActive = false;

    this._emit(`section:${this.id}:reset`, {
      sectionId: this.id,
      element: this.element,
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

    // Remove ScrollTriggers for this section
    const triggers = ScrollTrigger.getAll();
    triggers.forEach(trigger => {
      if (trigger.vars.trigger === this.element || trigger.vars.trigger === `#${this.id}`) {
        trigger.kill();
      }
    });

    this._emit(`section:${this.id}:destroy`, {
      sectionId: this.id,
    });

    this.element = null;
    this.timeline = null;
  }

  setAnimations(animations) {
    if (!animations) return;

    if (this.animations && this.animations !== animations) {
      this.animations.timeline?.kill();
    }

    this.animations = animations;
    this.timeline = animations.timeline;
    this._bindTimelineCallbacks();
  }

  // Map GSAP timeline callbacks to standardized AnimationBus events.
  // Note that this assumes a single timeline supplies both intro and outro animations by reversal.
  _bindTimelineCallbacks() {
    if (!this.timeline) return;

    this.timeline.eventCallback('onStart', () => {
      this.onIntroStart();
    });

    this.timeline.eventCallback('onComplete', () => {
      this.onIntroComplete();
    });

    this.timeline.eventCallback('onReverseComplete', () => {
      this.onOutroComplete();
    });
  }

  initialize() {
    // 1) Respect reduced motion: skip intro and apply end state immediately.
    if (this._reducedMotionHandler?.isReducedMotion()) {
      this._applyPostIntroState();
      this._setupScrollAnimations();
      return;
    }

    // 2) Gate intro by sessionStorage (play once per session).
    // const hasPlayed = this._hasIntroPlayed();

    // if (!hasPlayed) {
    //   this._introTl = this._createIntroTimeline();
    //   if (this._introTl) {
    //     this._introTl.eventCallback('onComplete', () => this._markIntroPlayed());
    //     this._introTl.play(0);
    //   } else {
    //     // No intro timeline defined; mark as played to avoid re-running
    //     this._markIntroPlayed();
    //   }
    // } else {
    //   // Apply end state instantly if intro has already played.
    //   this._applyPostIntroState();
    // }

    // 3) Initialize any scroll-based animations/triggers.
    this._setupScrollAnimations();
  }

  _hasIntroPlayed() {
    try {
      return window.sessionStorage.getItem(this._introPlayedKey) === '1';
    } catch {
      return false;
    }
  }

  _markIntroPlayed() {
    try {
      window.sessionStorage.setItem(this._introPlayedKey, '1');
    } catch {
      // ignore
    }
  }

  _createIntroTimeline() {
    // ...existing code...
    // Expected to be implemented in subclasses:
    // return gsap.timeline(...);
  }

  _applyPostIntroState() {
    // ...existing code...
    // Subclasses should set the end state of intro instantly (e.g., gsap.set(...))
  }

  _setupScrollAnimations() {
    // ...existing code...
  }

  // Safe bus emitter
  _emit(eventName, payload) {
    this.logger.trace(`Emitting event: ${eventName}`);
    if (!eventName) return;
    if (this.bus && typeof this.bus.emit === 'function') {
      this.bus.emit(eventName, payload);
    } else {
      // Soft warn once per event to avoid noisy logs
      this.logger.trace(`bus.emit unavailable for "${eventName}"`, { payload }, 'brief', 'headsup');
    }
  }
}
