import AbstractSection from "../../system/AbstractSection.js";
import {
  SELECTORS,
  VIDEO_SELECTORS,
  VIDEO_GEL_ID,
  resolveSectionMotionProfile,
} from "../../config/index/index.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
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
  constructor({ bus = null, reducedMotionHandler, gelManager = null } = {}) {
    const view = document.getElementById(SELECTORS.video);
    // `gel_video` sits inside this section's root, and this section owns it:
    // the intro snaps it visible inside the clip. Resolved here, before
    // super(), because super() can already run the gated reveal.
    const videoGel = gelManager?.getGel?.(VIDEO_GEL_ID)?.view ?? null;
    const animations = new BackgroundVideoAnimations(view, { videoGel });
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
    this._pendingIntroComplete = null;
    if (this.animations) {
      this.animations.onPerspectiveSettled = () => this._releaseIntroComplete();
    }

    this._bindMediaEvents();
    this._bindHydrationHandshake();
    this._bindPerspectiveResize();
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

    // Already playing — a non-deferred `src` + `autoplay` can start before
    // this section exists, so the native `playing` fired with nobody
    // listening, and play() on a playing element fires no new one. Report it
    // now rather than leaving the gate to the failsafe.
    if (this._isAlreadyPlaying()) {
      this._emitMedia("playing");
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
   * True when frames are actually advancing: not paused, not ended, and
   * buffered past the current frame (HAVE_FUTURE_DATA). A video that is
   * unpaused but still stalled waiting for data does not count — it will fire
   * its own `playing` once it moves.
   */
  _isAlreadyPlaying() {
    const video = this.videoEl;
    return Boolean(
      video &&
        !video.paused &&
        !video.ended &&
        video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA,
    );
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

  /**
   * Two-point perspective rest pose (see
   * specs/animation/background-video-perspective-spec.md).
   *
   * On perspective tiers the pose (overscale and turn) is applied statically
   * before the video is visible, so nothing animates into it. It is
   * re-asserted when the intro completes (_enterPerspective) and on resize.
   * `video:intro:complete` is not held for it. Narrow tiers stay flat
   * (SECTION_OVERRIDES.video); a matchMedia breakpoint crossing clears or
   * re-applies the pose in _applyResponsiveLifecycle.
   *
   * The video and `gel_video` sit at full visibility inside a clip-path;
   * the intro pops cells into it right to left (or the clip is removed on
   * gated paths). See BackgroundVideoAnimations._buildIntro.
   */
  _isPerspectiveTier() {
    // The `reduced` profile carries no breakpoint, and reduced motion does not
    // change the pose — the breakpoint decides whether to tilt at all.
    // So resolve the active tier's profile alone, with reduced motion aside.
    const profile = resolveSectionMotionProfile(this.sectionKey, {
      [this._activeBreakpoint]: true,
    });
    return profile.animation?.variant === "perspective";
  }

  /** Re-assert the rest pose at intro completion if it is not yet settled. */
  _enterPerspective() {
    if (this.isDisabled || !this._isPerspectiveTier()) return;
    if (this.animations?.isPerspectiveSettled?.()) return;
    this.animations?.snapPerspective?.();
  }

  /**
   * Emit a held `video:intro:complete`, once. Nothing holds it now, so this is
   * inert; kept for the clear path and `onPerspectiveSettled`. A held event
   * means the intro completed, so the clip is removed first.
   */
  _releaseIntroComplete() {
    const release = this._pendingIntroComplete;
    if (!release) return;
    this._pendingIntroComplete = null;
    this.animations?.revealAll?.();
    release();
  }

  /**
   * Re-assert the video gel once it has been revealed. Runs on every
   * matchMedia pass (breakpoint crossings, reduced-motion changes). Those
   * passes run inside this section's gsap.matchMedia context, which reverts
   * the previous pass's sets — including a gated snap of the gel — before it
   * re-runs; re-asserting here, in the same synchronous pass, means a revert
   * can never leave an earned gel hidden.
   */
  _syncVideoGel() {
    if (this.isDisabled) return;
    if (this.animations?.isVideoGelShown?.()) this.animations.showVideoGel();
    if (this.animations?.isRevealed?.()) this.animations.revealAll();
  }

  /**
   * Breakpoint crossings and reduced-motion changes. Runs once during
   * construction too (inside super()), so it must not rely on fields set in
   * this constructor's body.
   */
  _syncPerspective() {
    if (this.isDisabled) return;
    if (!this._isPerspectiveTier()) {
      this.animations?.clearPerspective?.();
      // Releases a held event, if any (none is held now).
      this._releaseIntroComplete();
      return;
    }
    // Perspective tier: the full rest pose, applied statically — also before
    // the video is visible (this runs inside super() on construction).
    this.animations?.snapPerspective?.();
  }

  /**
   * Perspective scales with viewport width, so a plain resize (which fires no
   * matchMedia change) re-asserts the rest pose at the new width. The same
   * pass re-asserts a visible video gel and a finished reveal; a clip still revealing is left alone.
   */
  _bindPerspectiveResize() {
    if (this.isDisabled) return;
    const handler = () => {
      this._syncVideoGel();
      if (!this._isPerspectiveTier()) return;
      if (!this.animations?.isPerspectiveSettled?.()) return;
      this.animations.snapPerspective();
    };
    window.addEventListener("resize", handler);
    this._teardownListeners.push(() =>
      window.removeEventListener("resize", handler),
    );
  }

  _applyResponsiveLifecycle(conditions = {}) {
    super._applyResponsiveLifecycle(conditions);
    this._syncPerspective();
    this._syncVideoGel();
  }

  /**
   * The intro (cell reveal) has completed: the rest pose is re-asserted
   * (already applied before the reveal). The played path has nothing more to
   * reveal; gated paths (reduced motion, session-gated replay — reached here
   * through _applyPostIntroState's progress(1)) remove the clip and snap the
   * video and gel visible.
   */
  _onIntroComplete() {
    this._enterPerspective();
    if (this.isDisabled || !this._isLifecycleMotionEnabled) {
      this.animations?.revealAll?.();
    }
    super._onIntroComplete();
  }

  /**
   * Gated paths. The intro is already at progress 1 on a second call (e.g.
   * playIntro() after the construction-time pass), so its onComplete does not
   * fire again; the clip is removed here too so every gated call shows the video.
   */
  _applyPostIntroState() {
    super._applyPostIntroState();
    this._enterPerspective();
    this.animations?.revealAll?.();
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
