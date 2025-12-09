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

import lumberjack from '/assets/js/utils/lumberjack/index.js';
import AbstractSectionAnimations from './AbstractSectionAnimations.js';
import AbstractSectionTriggers from './AbstractSectionTriggers.js';

export default class AbstractSection {
  /**
   * Initialize section controller
   *
   * Subclasses must call super(id, bus, smoother) in constructor,
   * then call createIntro(), createOutro(), and createScrollTriggers().
   *
   * @param {string} sectionId - DOM element ID (e.g., 'main-header')
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(sectionId, bus, { reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      prefix: '📁',
      color: '#CCCCCC',
    });
    try {
      this.id = sectionId; // the section element identifier
      // Provide a null-safe bus fallback
      this.bus = bus ?? { emit: () => {} }; // prevents TypeError when bus is missing
      this.element = document.getElementById(sectionId); // the target DOM element
      this._reducedMotionHandler = reducedMotionHandler;
      this._introPlayedKey = `${this.constructor.name.toLowerCase()}:introPlayed`;
      this._introTl = null;

      if (!this.element) {
        console.warn(
          `[${this.constructor.name.toLowerCase()}] ${sectionId} not found - section disabled`
        );
        return;
      }
      // Initialize animation and trigger modules
      this.animations = new AbstractSectionAnimations(this.element, this.id);
      this.triggers = new AbstractSectionTriggers(this.element, this.id);

      // Expose primary timeline for playIntro/playOutro controls
      this.timeline = this.animations.timeline;
      this._bindTimelineCallbacks();
      this.logger.trace(
        `${this.constructor.name.toLowerCase()}: initialized`,
        null,
        'brief',
        'standard'
      );
    } catch (error) {
      this.logger.error(`Error initializing ${this.constructor.name.toLowerCase()}:`, error);
    }
  }

  onEnterScroll() {
    // console.log(`[BaseSection] ${this.id}: Entered scroll trigger`);
  }

  onExitScroll() {
    // console.log(`[BaseSection] ${this.id}: Exited scroll trigger`);
  }

  onIntroStart() {
    // console.log(`[BaseSection] ${this.id}: Intro started`);
  }

  onIntroComplete() {
    // console.log(`[BaseSection] ${this.id}: Intro complete`);
  }

  onOutroStart() {
    // console.log(`[BaseSection] ${this.id}: Outro started`);
  }

  onOutroComplete() {
    // console.log(`[BaseSection] ${this.id}: Outro complete`);
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
    if (!this.element) {
      lumberjack.trace(
        `[BaseSection] ${this.id}: Cannot play intro - element not found`,
        null,
        'brief',
        'headsup'
      );
      return;
    }

    // Broadcast standardized event for intro start (subclass-provided)
    if (this.events?.introStart) {
      this._emit(this.events.introStart, {
        sectionId: this.id,
        element: this.element,
      });
    } else {
      console.warn(`[BaseSection] ${this.id}: No introStart event defined`);
    }

    const introRunner =
      typeof this.animations?.intro === 'function'
        ? this.animations.intro()
        : this.timeline.restart();

    const waitable =
      introRunner && typeof introRunner.then === 'function' ? introRunner : this.timeline;

    return waitable.then(() => {
      this.isIntroComplete = true;
      // Broadcast standardized event for intro complete (subclass-provided)
      if (this.events?.introComplete) {
        this._emit(this.events.introComplete, {
          sectionId: this.id,
          element: this.element,
        });
      } else {
        console.warn(`[BaseSection] ${this.id}: No introComplete event defined`);
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
    lumberjack.trace(`[BaseSection] ${this.id}: Playing outro animation`, null, 'brief', 'headsup');
    if (!this.element) {
      console.warn(`[BaseSection] ${this.id}: Cannot play outro - element not found`);
      return;
    }

    // Broadcast standardized event for outro start (subclass-provided)
    if (this.events?.outroStart) {
      this._emit(this.events.outroStart, {
        sectionId: this.id,
        element: this.element,
      });
    }

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
    const hasPlayed = this._hasIntroPlayed();

    if (!hasPlayed) {
      this._introTl = this._createIntroTimeline();
      if (this._introTl) {
        this._introTl.eventCallback('onComplete', () => this._markIntroPlayed());
        this._introTl.play(0);
      } else {
        // No intro timeline defined; mark as played to avoid re-running
        this._markIntroPlayed();
      }
    } else {
      // Apply end state instantly if intro has already played.
      this._applyPostIntroState();
    }

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
    if (!eventName) return;
    if (this.bus && typeof this.bus.emit === 'function') {
      this.bus.emit(eventName, payload);
    } else {
      // Soft warn once per event to avoid noisy logs
      lumberjack.trace(
        `[BaseSection] ${this.id}: bus.emit unavailable for "${eventName}"`,
        { payload },
        'brief',
        'headsup'
      );
    }
  }
}
