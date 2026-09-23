import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS, VIDEO_SELECTORS } from "../../config/index/index.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import BackgroundVideoAnimations from "./BackgroundVideoAnimations.js";
import BackgroundVideoTriggers from "./BackgroundVideoTriggers.js";
import {
  buildBackgroundVideoEvent,
  isBackgroundVideoSettled,
} from "./BackgroundVideoEvent.js";

/**
 * Native media events forwarded as `video:media:*`. Deliberately short: a
 * looping muted background never ends, and `timeupdate` would emit ~4x/sec for
 * nobody. Add to this list when something actually listens.
 */
const MEDIA_EVENT_MAP = [
  ["canplay", "ready"],
  ["playing", "playing"],
  ["pause", "pause"],
  ["waiting", "waiting"],
  ["error", "error"],
];

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Upper bound on reporting a resting state after hydration. The contract this
 * section owes its consumers is that exactly one settled event always arrives —
 * the preloader's splash gate and LandingSequence's reveal both hang off it,
 * and the reveal has no timeout of its own, so a silent path leaves the video
 * hidden permanently rather than merely late.
 *
 * Matches PRELOADER_TIMINGS.videoPlayingTimeoutMs on purpose: the preloader
 * gives up on its splash at the same moment this gives up on playback.
 */
const PLAYBACK_REPORT_TIMEOUT_MS = 4000;

export default class BackgroundVideo extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.video);
    const animations = new BackgroundVideoAnimations(view);
    const triggers = new BackgroundVideoTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "video",
      bus,
      reducedMotionHandler,
    });

    this.videoEl = this.view?.querySelector(VIDEO_SELECTORS.media) ?? null;
    this._teardownListeners = [];
    this._mediaSettled = false;
    this._playbackFailsafe = null;

    this._bindMediaEvents();
    this._bindHydrationHandshake();
  }

  /**
   * Emit a media event on the bus *and* mirror it to `window`.
   *
   * The mirror is the only way the preloader can hear this section: it runs as
   * a deferred module in <head>, well before AnimationDirector constructs the
   * bus, and the bus is injected rather than global. `director:ready` and
   * `preloader:out` already cross the boundary as window events — this follows
   * that precedent rather than widening the global surface with a bus handle.
   */
  _emitMedia(key) {
    const eventName = this.events?.media?.[key];
    if (!eventName) return;

    const detail = buildBackgroundVideoEvent(this);

    if (isBackgroundVideoSettled(eventName, detail)) {
      this._mediaSettled = true;
      this._clearPlaybackFailsafe();
    }

    this._emit(eventName, detail);
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  _bindMediaEvents() {
    if (!this.videoEl) return;

    MEDIA_EVENT_MAP.forEach(([domEvent, key]) => {
      const handler = () => this._emitMedia(key);
      this.videoEl.addEventListener(domEvent, handler);
      this._teardownListeners.push(() =>
        this.videoEl?.removeEventListener(domEvent, handler),
      );
    });
  }

  /**
   * The preloader owns hydration (which video gets a src, and when — a
   * bandwidth staging decision). This section owns everything after it.
   *
   * Bound in the constructor, which runs during Director init — before
   * `director:ready`, and so before the preloader can possibly dispatch. No
   * race to guard against.
   */
  _bindHydrationHandshake() {
    const handler = () => this._onHydrated();
    window.addEventListener(EVENTS.system.preloaderVideoHydrated, handler, {
      once: true,
    });
    this._teardownListeners.push(() =>
      window.removeEventListener(EVENTS.system.preloaderVideoHydrated, handler),
    );
  }

  _prefersReducedMotion() {
    // `_isReducedMotionMode` is null until matchMedia has run; fall back to a
    // direct query rather than defaulting to "motion is fine".
    if (typeof this._isReducedMotionMode === "boolean") {
      return this._isReducedMotionMode;
    }
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    );
  }

  /**
   * Decide what the hydrated element can do, and say so. Every branch emits
   * exactly one event, so a consumer gating on playback always gets an answer
   * and never falls through to its own timeout.
   *
   * Reduced motion checks the media query directly rather than
   * `_isLifecycleMotionEnabled`: that flag also goes false for session-gated
   * replay, and a return visitor should still get a moving background.
   */
  async _onHydrated() {
    if (!this.videoEl || !(this.videoEl.currentSrc || this.videoEl.src)) {
      // No element, or hydration skipped/failed. Nothing will ever buffer.
      this._emitMedia("unavailable");
      return;
    }

    if (this._prefersReducedMotion()) {
      // Left paused on its poster on purpose — but it is as ready as it will
      // get, so release anything waiting on it.
      this._emitMedia("ready");
      return;
    }

    // Deliberately NOT gated on `canplay`. play() is valid on an unbuffered
    // element — the browser starts it as soon as data allows — and waiting for
    // `canplay` first has no upper bound. An mp4 whose `moov` atom sits after
    // `mdat` (not faststart) reaches neither `loadedmetadata` nor `canplay`
    // until the entire file has downloaded, which is exactly the case that left
    // this video hidden.
    this._armPlaybackFailsafe();
    this._playVideo();
  }

  /**
   * Guarantee a settled event even if playback never reports one. Cleared by
   * _emitMedia as soon as any settled event goes out.
   */
  _armPlaybackFailsafe() {
    this._clearPlaybackFailsafe();
    this._playbackFailsafe = setTimeout(() => {
      this._playbackFailsafe = null;
      if (this._mediaSettled) return;
      this.logger.trace(
        `No playback within ${PLAYBACK_REPORT_TIMEOUT_MS}ms; reporting so consumers stop waiting`,
      );
      this._emitMedia("error");
    }, PLAYBACK_REPORT_TIMEOUT_MS);
  }

  _clearPlaybackFailsafe() {
    if (!this._playbackFailsafe) return;
    clearTimeout(this._playbackFailsafe);
    this._playbackFailsafe = null;
  }

  _playVideo() {
    if (!this.videoEl) return;
    const playPromise = this.videoEl.play?.();
    // A refusal (autoplay policy, backgrounded tab) never fires `playing`, so
    // report it rather than leaving a listener hanging until it times out.
    if (playPromise?.catch) playPromise.catch(() => this._emitMedia("error"));
  }

  async playIntro() {
    if (this.isDisabled || !this._isLifecycleMotionEnabled) {
      // Reduced motion (or disabled): don't autoplay the video, but still
      // delegate to super so the base snaps the post-intro state and emits
      // `video.introComplete`.
      this.videoEl?.pause?.();
      return super.playIntro();
    }

    // play() is idempotent on an already-playing element, and _onHydrated has
    // normally started it long before this. No readiness await: the reveal must
    // not be able to stall behind a buffer that may never fill.
    this._playVideo();
    return super.playIntro();
  }

  async playOutro() {
    this.videoEl?.pause?.();
    return super.playOutro();
  }

  destroy() {
    this._clearPlaybackFailsafe();
    this._teardownListeners.forEach((remove) => remove());
    this._teardownListeners = [];
    // super.destroy() nulls `view`, so the media listeners must come off first.
    super.destroy();
    this.videoEl = null;
  }

  _onEnter() {}
  _onLeave() {}
  _onEnterBack() {}
  _onLeaveBack() {}
}
