/**
 * Landing Sequence Template
 *
 * Choreographs the complete landing page animation flow.
 * Listens to AnimationBus events and triggers section transitions
 * in response to lifecycle completions.
 */

import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import { BIO_INTRO_HOLD, SELECTORS } from "../../config/index/index.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";

export class LandingSequence {
  constructor(bus, sections, gelAnimation) {
    this.logger = Lumberjack.createScoped("LandingSequence", {
      prefix: "",
      color: "#66B032",
    });
    this.bus = bus;
    this.sections = sections;
    this.gelManager = gelAnimation;

    this._listeners = [];
    // The beat between video:intro:complete and bio.playIntro(). gsap.delayedCall
    // (not setTimeout) so the timer is ticker-synced, pausable and killable.
    this._bioHoldCall = null;
    // Gates the scroll-driven resume below. Until the video's own intro has
    // completed, playback belongs to the landing chain and nothing else may
    // start it.
    this._videoIntroComplete = false;
    // Set for exactly one `bio:exit`, by the `bio:onLeaveBack` that precedes it.
    // See the exit listener in _registerListeners for why this is needed.
    this._bioLeftBackwards = false;

    this.handlePreloaderOut = () => this.start();
    window.addEventListener(
      EVENTS.system.preloaderOut,
      this.handlePreloaderOut,
      { once: true },
    );

    this._registerListeners();
  }

  async start() {
    this.logger.trace("Starting landing sequence");
    window.removeEventListener(
      EVENTS.system.preloaderOut,
      this.handlePreloaderOut,
    );

    try {
      // Landing only: the background video's hidden resting state. The intro
      // that fades it into view is deferred until the home header finishes its
      // own intro (see _registerListeners) — the header leads, the video
      // follows, then Bio. Playing the intro here would race the header.
      await this.sections?.video?.playLanding?.();
    } catch (error) {
      this.logger.trace(
        "Error staging video landing state",
        error,
        "verbose",
        "error",
      );
    }
  }

  reset() {
    this.logger.trace("Resetting sequence", null, "brief", "standard");

    Object.values(this.sections).forEach((section) => {
      if (section && typeof section.reset === "function") {
        section.reset();
      }
    });
  }

  destroy() {
    if (this.handlePreloaderOut) {
      window.removeEventListener(
        EVENTS.system.preloaderOut,
        this.handlePreloaderOut,
      );
    }

    this.logger.trace("Destroying sequence", null, "brief", "standard");

    this._bioHoldCall?.kill();
    this._bioHoldCall = null;
    this._videoIntroComplete = false;
    this._bioLeftBackwards = false;

    this._listeners.forEach((unsubscribe) => unsubscribe());
    this._listeners = [];
    this.sections = null;
    this.gelManager = null;
    this.bus = null;
  }

  /**
   * Fade the background video in, cued by the home header's intro completing.
   *
   * `BackgroundVideo.playIntro()` awaits `_ensureVideoReady()` first. By this
   * point the preloader has long since hydrated the deferred source, so that
   * await is a safety net rather than a wait.
   */
  async _startVideoIntro() {
    try {
      await this.sections?.video?.playIntro?.();
    } catch (error) {
      this.logger.trace(
        "Error starting video intro",
        error,
        "verbose",
        "error",
      );
    }
  }

  /**
   * Hold a beat after the background video's intro, then bring the gel band in
   * and — once it lands — play Bio's intro.
   *
   * The gel entrance is bio's `landing` phase (the `split` variant's `init`; see
   * molecules/bio-motion/heading-gel.js). Awaiting `playLanding()` is what gates
   * the reveal: its promise resolves on the landing timeline's `onComplete`, so
   * the intro cannot start over a band that is still flying in.
   *
   * Reduced motion zeroes the hold rather than skipping the call — the video
   * still emits `video:intro:complete` under a gated profile (AbstractSection
   * jumps the intro to progress(1) and emits), so this chain must stay intact.
   * `playLanding()` likewise resolves immediately when the profile gates motion
   * off, so the await never stalls the chain.
   */
  _armBioIntro() {
    if (this._bioHoldCall) return;

    const hold = isReducedMotion() ? 0 : BIO_INTRO_HOLD.delay;

    this._bioHoldCall = gsap.delayedCall(hold, async () => {
      this._bioHoldCall = null;
      this.logger.trace(SELECTORS.bio + " gel entrance (after video intro)");
      await this.sections?.bio?.playLanding?.();
      this.logger.trace(SELECTORS.bio + " intro (after gel entrance)");
      this.sections?.bio?.playIntro?.();
    });

    this.logger.trace(`BG Video intro complete; bio holds ${hold}s`);
  }

  /**
   * Background video playback is scoped to Bio.
   *
   * The video is the subject of the landing and of Bio, and backdrop for
   * everything below it. Rather than ask "is the video covered" — which is
   * unanswerable here, since every section sits over it transparently by
   * design and the sections tile the page contiguously — the cue is simply
   * whether Bio is on screen. Bio is in view at load, so the video plays from
   * the landing through the manifesto, then pauses for the rest of the page.
   *
   * The video keeps its fixed positioning, size, layer and visibility
   * throughout: only play/pause changes. That is load-bearing — the gels in
   * `#sizzle-background` blend against the video's painted frame, so a paused
   * video holds its last frame and the composite is unchanged, while hiding or
   * unmounting it would visibly alter the page.
   */
  _pauseBackgroundVideo() {
    const videoEl = this.sections?.video?.videoEl ?? null;
    videoEl?.pause?.();
  }

  _resumeBackgroundVideo() {
    // Reduced motion never autoplays the video (BackgroundVideo.playIntro
    // pauses instead), so a scroll-driven resume must not start it either.
    if (isReducedMotion()) return;
    // Before the video's intro completes, the landing chain owns playback —
    // Bio's ScrollTrigger fires `enter` at load, and resuming on it would start
    // the video underneath its own reveal.
    if (!this._videoIntroComplete) return;

    const videoEl = this.sections?.video?.videoEl ?? null;
    const playPromise = videoEl?.play?.();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }

  _registerListeners() {
    if (!this.bus) return;

    const on = (event, handler) => {
      const off = this.bus.on(event, handler);
      this._listeners.push(off);
    };

    // The landing runs as one serial chain, opened by the header and carried by
    // the page from there:
    //
    //   home header OUTRO (hero slides off, header dismissed)
    //     -> background video intro
    //       -> (beat) -> bio gel entrance -> bio intro
    //
    // The cue is the header's outro because that is the only cue it gives: once
    // its exit finishes the header is dismissed and takes no further part in the
    // page, so it emits no intro. The chain terminates at `bio:intro:complete`.
    //
    // The bio ScrollTrigger still fires enter/exit for side effects, but no
    // longer drives the reveal.
    on(EVENTS.home.outroComplete, () => {
      this.logger.trace("Home hero exited; starting video intro");
      this._startVideoIntro();
    });

    on(EVENTS.video.introComplete, () => {
      this._videoIntroComplete = true;
      this._armBioIntro();
    });

    // Bio's enter/exit pair gates background video playback (see
    // _resumeBackgroundVideo). Both scroll directions are wired so the gate is
    // symmetric: enter/onEnterBack resume, exit/onLeaveBack pause.
    on(EVENTS.bio.enter, () => {
      this.logger.trace(SELECTORS.bio + " entered.");
      this._bioLeftBackwards = false;
      this._resumeBackgroundVideo();
    });

    on(EVENTS.bio.onEnterBack, () => {
      this.logger.trace(SELECTORS.bio + " entered back");
      this._bioLeftBackwards = false;
      this._resumeBackgroundVideo();
    });

    on(EVENTS.bio.onLeaveBack, () => {
      this.logger.trace(SELECTORS.bio + " left back");
      // Leaving Bio *backwards* means scrolling up above its start — which is
      // the landing, where the video is the subject. Keep playing. The flag is
      // consumed by the `exit` listener below.
      this._bioLeftBackwards = true;
      this._resumeBackgroundVideo();
    });

    on(EVENTS.bio.exit, () => {
      // Bio playback is disengaged from scroll — no outro on scroll-out.
      this.logger.trace(SELECTORS.bio + " exited");
      // `exit` is not directional. AbstractSection._onLeaveBack emits
      // `onLeaveBack` and then routes through `_onLeave`, which emits `exit` —
      // so this fires when scrolling up above Bio as well as down past it, and
      // only the downward case means "past Bio". The listener above ran first
      // (bus dispatch is synchronous) and flags the upward case.
      if (this._bioLeftBackwards) {
        this._bioLeftBackwards = false;
        return;
      }
      this._pauseBackgroundVideo();
    });
  }
}
