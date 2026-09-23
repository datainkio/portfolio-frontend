/**
 * Landing Sequence Template
 *
 * Picks up the page choreography from the preloader when it hears EVENTS.system.preloaderOut.
 */

import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import { BIO_INTRO_HOLD, SELECTORS } from "../../config/index/index.js";
import {
  BACKGROUND_VIDEO_SETTLED_EVENTS,
  isBackgroundVideoSettled,
} from "../../organisms/background/BackgroundVideoEvent.js";
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

    // The video reveal needs both halves before it can run, and they do not
    // arrive in a fixed order relative to each other — see _cueVideoIntro.
    this._videoMediaSettled = false;
    this._videoLandingStaged = false;
    this._videoIntroCued = false;

    // DISABLED INITIAL PRELOADER LISTENER FOR STYLING WORK ON PRELOADER VIEW
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
      // that fades it into view waits for the element to actually be playing
      // (see _cueVideoIntro), so the reveal never lands on a still frame.
      await this.sections?.video?.playLanding?.();
    } catch (error) {
      this.logger.trace(
        "Error staging video landing state",
        error,
        "verbose",
        "error",
      );
    }

    // Staged last, and only after the await: _cueVideoIntro must not fire
    // while playLanding() is still mid-flight toward autoAlpha 0.
    this._videoLandingStaged = true;
    this._cueVideoIntro();
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
    this._videoMediaSettled = false;
    this._videoLandingStaged = false;
    this._videoIntroCued = false;

    this._listeners.forEach((unsubscribe) => unsubscribe());
    this._listeners = [];
    this.sections = null;
    this.gelManager = null;
    this.bus = null;
  }

  /**
   * Run the reveal once both halves have landed, and only once.
   *
   * The two cues have no fixed order relative to each other. In the normal
   * flow the video settles *first*: the preloader holds its splash until the
   * video reports, so `video:media:playing` has already fired by the time
   * `preloader:out` starts this sequence. But a timed-out preloader gate, or a
   * video that errors late, can invert that. Latching both and joining here
   * means neither order drops the reveal — and revealing before
   * `playLanding()` has staged autoAlpha 0 would be immediately undone by it.
   */
  _cueVideoIntro() {
    if (this._videoIntroCued) return;
    if (!this._videoMediaSettled || !this._videoLandingStaged) return;

    this._videoIntroCued = true;
    this.logger.trace("Background video settled; starting video intro");
    this._startVideoIntro();
  }

  /**
   * Fade the background video in.
   *
   * `BackgroundVideo.playIntro()` re-issues play() as a no-op safety net; it
   * does not wait on buffering, so this cannot stall behind a slow source.
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

    // The landing runs as one serial chain, opened by the background video
    // reaching its resting state and carried by the page from there:
    //
    //   video settles (playing, or never will)
    //     -> background video intro
    //       -> (beat) -> bio gel entrance -> bio intro
    //
    // The cue used to be `home:outro:complete`, emitted by HomeHeaderManager.
    // That manager is no longer constructed by AnimationDirector, so nothing
    // emitted it and the video sat at autoAlpha 0 forever. The video's own
    // media events are the replacement: they always arrive, and they mean the
    // frames are actually moving — so the fade never reveals a still poster.
    //
    // The chain still terminates at `bio:intro:complete`, and the bio
    // ScrollTrigger still fires enter/exit for side effects without driving
    // the reveal.
    BACKGROUND_VIDEO_SETTLED_EVENTS.forEach((eventName) =>
      on(eventName, (detail) => {
        if (!isBackgroundVideoSettled(eventName, detail)) return;
        this._videoMediaSettled = true;
        this._cueVideoIntro();
      }),
    );

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
