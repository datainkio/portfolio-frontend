/**
 * Landing Sequence Template
 *
 * Choreographs the complete landing page animation flow.
 * Listens to AnimationBus events and triggers section transitions
 * in response to lifecycle completions.
 */

import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import { SELECTORS } from "../../config/index/index.js";

export class LandingSequence {
  constructor(bus, sections, gelAnimation) {
    this.logger = Lumberjack.createScoped("LandingSequence", {
      prefix: "",
      color: "#66B032",
    });
    this.bus = bus;
    this.sections = sections;
    this.gelManager = gelAnimation;

    this.state = {
      isStarted: false,
      isComplete: false,
      heroIntroRequested: false,
    };

    this._listeners = [];

    this.handlePreloaderOut = () => this.start();
    window.addEventListener(
      EVENTS.system.preloaderOut,
      this.handlePreloaderOut,
      { once: true },
    );

    this._registerListeners();
  }

  start() {
    this.logger.trace("Starting landing sequence");
    window.removeEventListener(
      EVENTS.system.preloaderOut,
      this.handlePreloaderOut,
    );

    try {
      this.sections?.video?.playIntro?.();
    } catch (error) {
      this.logger.trace(
        "Error starting video intro",
        error,
        "verbose",
        "error",
      );
      this.state.isStarted = false;
    }
  }

  reset() {
    this.logger.trace("Resetting sequence", null, "brief", "standard");

    Object.values(this.sections).forEach((section) => {
      if (section && typeof section.reset === "function") {
        section.reset();
      }
    });

    this.state.isStarted = false;
    this.state.isComplete = false;
    this.state.heroIntroRequested = false;
  }

  destroy() {
    if (this.handlePreloaderOut) {
      window.removeEventListener(
        EVENTS.system.preloaderOut,
        this.handlePreloaderOut,
      );
    }

    this.logger.trace("Destroying sequence", null, "brief", "standard");

    this._listeners.forEach((unsubscribe) => unsubscribe());
    this._listeners = [];
    this.sections = null;
    this.gelManager = null;
    this.bus = null;
  }

  _pauseBackgroundVideo() {
    const videoEl = this.sections?.video?.videoEl ?? null;
    videoEl?.pause?.();
  }

  _resumeBackgroundVideo() {
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

    on(EVENTS.video.introComplete, () => {
      this.logger.trace("BG Video intro complete");
      this.sections?.hero?.playLanding?.();
    });

    on(EVENTS.hero.onEnterBack, () => {
      this.logger.trace(SELECTORS.hero + " entered back");
      this._resumeBackgroundVideo();
    });

    on(EVENTS.hero.exit, () => {
      this._pauseBackgroundVideo();
      this.logger.trace(SELECTORS.hero + " exited");
    });

    on(EVENTS.bio.enter, () => {
      this.logger.trace(SELECTORS.bio + " entered.");
      // this._applySectionArrangement("bio");
      this._pauseBackgroundVideo();
      this.sections?.bio?.playIntro?.();
    });

    on(EVENTS.bio.onEnterBack, () => {
      this.logger.trace(SELECTORS.bio + " entered back");
      this._pauseBackgroundVideo();
      this.sections?.bio?.playIntro?.();
    });

    on(EVENTS.bio.exit, () => {
      this.logger.trace(SELECTORS.bio + " exited");
      this.sections?.bio?.playOutro?.();
      //this._pauseBackgroundVideo();
    });

    on(EVENTS.bio.onLeaveBack, () => {
      this.logger.trace(SELECTORS.bio + " left back");
      // this._resumeBackgroundVideo();
    });
  }
}
