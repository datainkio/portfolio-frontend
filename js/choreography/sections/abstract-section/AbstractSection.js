/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.abstract-section.abstractsection
 *   role: Frontend runtime module: js/choreography/sections/abstract-section/AbstractSection.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
/**
 * AbstractSection - Foundation class for section animation controllers
 *
 * Provides standard lifecycle and event coordination for all section controllers.
 * Subclasses may provide custom animations/triggers modules as needed.
 *
 * Lifecycle:
 * 1. Constructor initializes timeline and element
 * 2. createIntro/Outro/ScrollTriggers define animations (override in subclass)
 * 3. playIntro/playOutro execute animations and emit events
 *
 * Dependencies:
 * - AnimationBus for event coordination
 */

import AbstractSectionAnimations from "./AbstractSectionAnimations.js";
import AbstractSectionTriggers from "./AbstractSectionTriggers.js";
import NullAnimationBus from "../../NullAnimationBus.js";
import { EVENTS } from "../../config/contracts/events.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";
import {
  BREAKPOINT_MATCH_MEDIA_CONDITIONS,
  getActiveBreakpoint,
} from "../../config/index.js";
import PromiseResolverQueue from "../../utils/PromiseResolverQueue.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";

export default class AbstractSection {
  /**
   * Initialize section controller
   *
   * Accepts configuration object with all initialization parameters.
   * Subclasses may provide custom animations/triggers modules as needed.
   *
   * @param {Object} options - Configuration object
   * @param {HTMLElement} options.view - DOM element for the section
   * @param {AbstractSectionAnimations} options.animations - Animation module instance
   * @param {AbstractSectionTriggers} options.triggers - Triggers module instance
   * @param {string} options.sectionKey - Section key that maps to EVENTS config (e.g., 'hero')
   * @param {AnimationBus} options.bus - Event bus for coordination (optional)
   * @param {ReducedMotionHandler} options.reducedMotionHandler - Motion preference handler (optional)
   * @param {boolean} options.initialInView - Initial in-view state for sections that start in viewport
   */
  constructor({
    view,
    animations,
    triggers,
    sectionKey,
    bus,
    reducedMotionHandler,
    initialInView = false,
  } = {}) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#007bff",
      enabled: true,
    });

    this.view = view;
    this.sectionKey = sectionKey;
    this.isDisabled = !view;
    this.bus = bus ?? new NullAnimationBus();
    this._reducedMotionHandler = reducedMotionHandler;
    this._matchMedia = null;
    this._isLifecycleMotionEnabled = true;
    this._isReducedMotionMode = null;
    this._activeBreakpoint = "base";
    // _isInView is used as a de-dup guard to prevent repeated enter/exit emissions and repeated auto-play
    // calls when ScrollTrigger callbacks fire in quick succession or from back-direction callbacks.
    this._isInView = Boolean(initialInView);
    this._landing = new PromiseResolverQueue();
    this._intro = new PromiseResolverQueue();
    this._outro = new PromiseResolverQueue();

    if (this.isDisabled) {
      this.logger.trace("element not found; section disabled");
      return;
    }

    this.events = EVENTS?.[sectionKey] ?? {};
    // Use provided modules; fall back to defaults
    this.triggers = triggers ?? new AbstractSectionTriggers(this.view);
    this.animations = animations ?? new AbstractSectionAnimations(this.view);

    // Expose owning section to trigger modules before bind() so section-specific
    // triggers can coordinate timeline playback safely.
    if (this.triggers) {
      this.triggers.section = this;
    }

    this._setupResponsiveLifecycle();
  }

  _setupResponsiveLifecycle() {
    if (typeof gsap?.matchMedia !== "function") {
      const isReducedMotion = Boolean(
        this._reducedMotionHandler?.isReducedMotion?.(),
      );

      this._applyResponsiveLifecycle({
        base: true,
        reduceMotion: isReducedMotion,
        motionOk: !isReducedMotion,
      });
      return;
    }

    this._matchMedia = gsap.matchMedia(this.view);
    this._matchMedia.add(BREAKPOINT_MATCH_MEDIA_CONDITIONS, (context = {}) => {
      this._applyResponsiveLifecycle(context.conditions ?? {});
    });
  }

  _applyResponsiveLifecycle(conditions = {}) {
    const activeBreakpoint = getActiveBreakpoint(conditions);
    this._activeBreakpoint = activeBreakpoint;

    const isReducedMotion = Boolean(
      conditions.reduceMotion ??
        this._reducedMotionHandler?.isReducedMotion?.(),
    );
    const isBaseBreakpoint = activeBreakpoint === "base";
    const shouldEnableMotion = !isReducedMotion && isBaseBreakpoint;
    const wasLifecycleMotionEnabled = this._isLifecycleMotionEnabled;

    this._isReducedMotionMode = isReducedMotion;
    this._isLifecycleMotionEnabled = shouldEnableMotion;

    // When motion is off, this kills all section triggers (including scroll triggers).
    this._bindCallbacks({ includeTriggers: shouldEnableMotion });

    // Ensure non-animated end state whenever motion is disabled.
    if (!shouldEnableMotion && wasLifecycleMotionEnabled) {
      this._applyPostIntroState();
    }
  }

  // Generic enter/exit hooks used by ScrollTrigger and Timeline bindings
  _onLandingStart() {
    this._emit(this.events.landingStart, { element: this.view });
  }

  _onLandingComplete() {
    // this.logger.trace("playLanding() complete");
    this._emit(this.events.landingComplete, { element: this.view });
  }

  _onUpdate() {}

  _onRefresh() {}

  _onEnter() {
    if (this._isInView) return;
    this._isInView = true;
    this._emit(this.events.enter, { element: this.view });
    this.playIntro();
  }

  _onLeave() {
    if (!this._isInView) return;
    this._isInView = false;
    this._emit(this.events.exit, { element: this.view });
    // TODO: Implement a more flexible solution for allowing events to be emitted on section exit without necessarily playing an outro animation. This could be a separate "exit" timeline that defaults to empty but can be defined by sections that need it, or a configuration option on the triggers that allows exit events to emit without an outro.
    // this.playOutro();
  }

  _onEnterBack() {
    if (this._isInView) return;
    this._isInView = true;
    this._emit(this.events.onEnterBack, { element: this.view });
    this.playIntro();
  }

  _onLeaveBack() {
    if (!this._isInView) return;
    this._emit(this.events.onLeaveBack, { element: this.view });
    this._onLeave();
  }

  _onIntroStart() {
    this._emit(this.events.introStart, { element: this.view });
  }

  _onIntroComplete() {
    this._emit(this.events.introComplete, { element: this.view });
  }

  _onOutroStart() {
    this._emit(this.events.outroStart, { element: this.view });
  }

  _onOutroComplete() {
    this._emit(this.events.outroComplete, { element: this.view });
  }

  _getTimelineOrWarn(timelineId, source) {
    const tl = this.animations?.getTimeline?.(timelineId);
    if (tl) return tl;

    this.logger.trace("Missing required animation timeline", {
      sectionKey: this.sectionKey,
      timelineId,
      source,
    });
    return null;
  }

  // Map trigger and timeline callbacks to standardized AnimationBus events.
  _bindCallbacks({ includeTriggers = true } = {}) {
    const bindLifecycle = (timelineId, onStart, onComplete) => {
      const tl = this._getTimelineOrWarn(timelineId, "_bindCallbacks");
      if (!tl) return;

      tl.eventCallback("onStart", onStart);
      tl.eventCallback("onComplete", onComplete);
      tl.eventCallback("onReverseComplete", null);
    };

    bindLifecycle(
      TIMELINE_IDS.landing,
      () => this._onLandingStart(),
      () => {
        this._onLandingComplete();
        this._landing.flush();
      },
    );

    bindLifecycle(
      TIMELINE_IDS.intro,
      () => this._onIntroStart(),
      () => {
        this._onIntroComplete();
        this._intro.flush();
      },
    );

    bindLifecycle(
      TIMELINE_IDS.outro,
      () => this._onOutroStart(),
      () => {
        this._onOutroComplete();
        this._outro.flush();
      },
    );

    if (!includeTriggers || !this.triggers) {
      this.triggers?.kill?.();
      return;
    }

    this.triggers.bind({
      onEnter: () => this._onEnter(),
      onLeave: () => this._onLeave(),
      onEnterBack: () => this._onEnterBack(),
      onLeaveBack: () => this._onLeaveBack(),
      onUpdate: (trigger) => this._onUpdate(trigger),
      onRefresh: (trigger) => this._onRefresh(trigger),
    });
  }

  // Safe bus emitter
  _emit(eventName, payload) {
    if (!eventName) return;
    this.bus.emit(eventName, payload);
  }

  /**
   * Play landing animation
   *
   * Executes landing timeline and emits coordination events.
   * Emits landing:start immediately, landing:complete when finished.
   *
   * @returns {Promise<void>} Resolves when animation completes
   */
  async playLanding() {
    this.logger.trace("Playing landing animation");
    if (this.isDisabled || !this._isLifecycleMotionEnabled) {
      return Promise.resolve();
    }
    return this._landing.run(() => this.animations.play(TIMELINE_IDS.landing));
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
    if (!this._isLifecycleMotionEnabled) {
      this._applyPostIntroState();
      return Promise.resolve();
    }
    return this._intro.run(() => this.animations.play(TIMELINE_IDS.intro));
  }

  /**
   * Play outro animation
   *
   * Plays timeline from the outro label and emits coordination events.
   * For scroll-based outros, may just emit events while ScrollTrigger handles animation.
   *
   * @returns {Promise<void>} Resolves when animation completes
   */
  async playOutro() {
    if (this.isDisabled || !this._isLifecycleMotionEnabled) {
      return Promise.resolve();
    }
    return this._outro.run(() => this.animations.play(TIMELINE_IDS.outro));
  }

  /**
   * Apply post-intro state without animation
   *
   * Used when reduced motion is enabled to skip animations and immediately
   * apply the final state. Respects user accessibility preferences.
   */
  _applyPostIntroState() {
    const introTimeline = this._getTimelineOrWarn(
      TIMELINE_IDS.intro,
      "_applyPostIntroState",
    );
    if (!introTimeline) return;

    // Jump intro to end state without playing
    introTimeline.progress(1, false);
    // this.isIntroComplete = true;

    // Emit completion event so other systems know section is ready
    this._emit(this.events.introComplete, { element: this.view });
  }

  /**
   * Reset section to initial state
   *
   * Resets timeline and state flags for replay or testing.
   */
  reset() {
    this.animations?.pauseAll?.(0);
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
    this._matchMedia?.revert?.();
    this._matchMedia = null;

    this.animations?.kill?.();

    // Remove ScrollTriggers registered via AbstractSectionTriggers
    this.triggers?.kill?.();

    this._emit(`section:${this.id}:destroy`, {
      sectionId: this.id,
    });

    this.view = null;
    this.animations = null;
    this.triggers = null;
  }
}
