/**
 * AbstractSection - Foundation class for section animation controllers
 *
 * Provides standard lifecycle and event coordination for all section controllers.
 * Subclasses may provide custom animations/triggers modules as needed.
 */

import AbstractSectionAnimations from "./AbstractSectionAnimations.js";
import AbstractSectionTriggers from "./AbstractSectionTriggers.js";
import NullAnimationBus from "./NullAnimationBus.js";
import { EVENTS } from "../config/contracts/events/events.js";
import { TIMELINE_IDS } from "../config/contracts/timelines/timelines.js";
import {
  BREAKPOINT_MATCH_MEDIA_CONDITIONS,
  getActiveBreakpoint,
  resolveSectionMotionProfile,
} from "../config/index/index.js";
import PromiseResolverQueue from "./PromiseResolverQueue.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "./gsap.js";

export default class AbstractSection {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.view
   * @param {AbstractSectionAnimations} options.animations
   * @param {AbstractSectionTriggers} options.triggers
   * @param {string} options.sectionKey
   * @param {AnimationBus} options.bus
   * @param {ReducedMotionHandler} options.reducedMotionHandler
   * @param {boolean} options.initialInView
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
    this._isInView = Boolean(initialInView);
    this._landing = new PromiseResolverQueue();
    this._intro = new PromiseResolverQueue();
    this._outro = new PromiseResolverQueue();

    if (this.isDisabled) {
      this.logger.trace("element not found; section disabled");
      return;
    }

    this.events = EVENTS?.[sectionKey] ?? {};
    this.triggers = triggers ?? new AbstractSectionTriggers(this.view);
    this.animations = animations ?? new AbstractSectionAnimations(this.view);

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

    const profile = resolveSectionMotionProfile(this.sectionKey, {
      ...conditions,
      reduceMotion: isReducedMotion,
    });
    const wasLifecycleMotionEnabled = this._isLifecycleMotionEnabled;

    this._isReducedMotionMode = isReducedMotion;
    this._motionProfile = profile;
    this._isLifecycleMotionEnabled = profile.timeline.enabled;

    this._bindCallbacks({ includeTriggers: profile.trigger.enabled });

    if (!profile.timeline.enabled && wasLifecycleMotionEnabled) {
      this._applyPostIntroState();
    }
  }

  _onLandingStart() {
    this._emit(this.events.landingStart, { element: this.view });
  }

  _onLandingComplete() {
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

  _emit(eventName, payload) {
    if (!eventName) return;
    this.bus.emit(eventName, payload);
  }

  async playLanding() {
    if (this.isDisabled || !this._isLifecycleMotionEnabled)
      return Promise.resolve();
    return this._landing.run(() => this.animations.play(TIMELINE_IDS.landing));
  }

  async playIntro() {
    if (this.isDisabled) return Promise.resolve();
    if (!this._isLifecycleMotionEnabled) {
      this._applyPostIntroState();
      return Promise.resolve();
    }
    return this._intro.run(() => this.animations.play(TIMELINE_IDS.intro));
  }

  async playOutro() {
    if (this.isDisabled || !this._isLifecycleMotionEnabled)
      return Promise.resolve();
    return this._outro.run(() => this.animations.play(TIMELINE_IDS.outro));
  }

  _applyPostIntroState() {
    const introTimeline = this._getTimelineOrWarn(
      TIMELINE_IDS.intro,
      "_applyPostIntroState",
    );
    if (!introTimeline) return;
    introTimeline.progress(1, false);
    this._emit(this.events.introComplete, { element: this.view });
  }

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

  destroy() {
    this._matchMedia?.revert?.();
    this._matchMedia = null;
    this.animations?.kill?.();
    this.triggers?.kill?.();
    this._emit(`section:${this.id}:destroy`, { sectionId: this.id });
    this.view = null;
    this.animations = null;
    this.triggers = null;
  }
}
