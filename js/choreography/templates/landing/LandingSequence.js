/**
 * Landing Sequence Template
 *
 * Choreographs the complete landing page animation flow.
 * Listens to AnimationBus events and triggers section transitions
 * in response to lifecycle completions.
 */

import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import {
  GEL_ARRANGEMENTS,
  SECTION_TO_GEL_ARRANGEMENT,
  SELECTORS,
} from "../../config/index/index.js";
import { createGelTransition } from "../../molecules/gel-transition/gel-transition.js";

export class LandingSequence {
  constructor(bus, sections, gelAnimation) {
    this.logger = Lumberjack.createScoped("LandingSequence", {
      prefix: "",
      color: "#66B032",
    });
    this.bus = bus;
    this.sections = sections;
    this.gelManager = gelAnimation;

    const initialArrangementId =
      typeof this.gelManager?.getActiveArrangementId === "function"
        ? this.gelManager.getActiveArrangementId()
        : null;

    this.state = {
      isStarted: false,
      isComplete: false,
      activeGelArrangementId: initialArrangementId,
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

  _applySectionArrangement(sectionId) {
    if (
      !this.gelManager ||
      typeof this.gelManager.applyArrangement !== "function"
    ) {
      return;
    }

    const arrangementId = SECTION_TO_GEL_ARRANGEMENT[sectionId];
    if (!arrangementId) {
      this.logger.trace(`No gel arrangement mapping for section: ${sectionId}`);
      return;
    }

    if (this.state.activeGelArrangementId === arrangementId) return;

    const arrangement = GEL_ARRANGEMENTS[arrangementId];
    if (!arrangement) {
      this.logger.trace(`Missing gel arrangement: ${arrangementId}`);
      return;
    }

    createGelTransition(this.gelManager, arrangement);
    this.state.activeGelArrangementId = arrangementId;
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
      this.sections?.bio?.playIntro?.();
      this._pauseBackgroundVideo();
    });

    on(EVENTS.bio.onEnterBack, () => {
      this.logger.trace(SELECTORS.bio + " entered back");
      this.sections?.bio?.playIntro?.();
      this._pauseBackgroundVideo();
    });

    on(EVENTS.bio.exit, () => {
      this.logger.trace(SELECTORS.bio + " exited");
      this.sections?.bio?.playOutro?.();
      this._resumeBackgroundVideo();
    });

    on(EVENTS.bio.onLeaveBack, () => {
      this.logger.trace(SELECTORS.bio + " left back");
      this._resumeBackgroundVideo();
    });
  }
}
