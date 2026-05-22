/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sequences.landing.landingsequence
 *   role: Frontend runtime module: js/choreography/sequences/landing/LandingSequence.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sequences
 * ---
 */
/**
 * LandingSequence - Landing page animation choreography coordinator
 *
 * Manages the flow of intro and outro animations for the landing page
 * Listens to AnimationBus events and triggers next animations based on completion.
 *
 * - [ ] Video background is not currently going full-bleed.
 *
 * @requires AnimationBus
 */

import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { EVENTS } from "../../config/contracts/events.js";
import {
  GEL_ARRANGEMENTS,
  SECTION_TO_GEL_ARRANGEMENT,
  SELECTORS,
} from "../../config/index.js";

const LOGS = {
  description:
    "LandingSequence manages the flow of intro and outro animations for the landing page.",
  methods: "",
};

export class LandingSequence {
  /**
   * Initialize landing sequence
   * @param {AnimationBus} bus - Event bus for coordination
   * @param {Object} sections - Section controllers (hero, work, biography...)
   */
  constructor(bus, sections, gelAnimation) {
    this.logger = Lumberjack.createScoped("LandingSequence", {
      prefix: "",
      color: "#66B032",
    });
    // this.logger.trace(LOGS.description);
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

    /**
     * Wait for preloader to announce its exit before starting
     * @returns
     */
    this.handlePreloaderOut = () => this.start();
    // window.addEventListener(EVENTS.system.directorReady, this.handleDirectorReady, { once: true });
    window.addEventListener(
      EVENTS.system.preloaderOut,
      this.handlePreloaderOut,
      { once: true },
    );
    this._registerListeners();
  }

  /**
   * Start landing page animation sequence
   *
   * Kicks off choreography by playing hero intro.
   * Event listeners handle subsequent animations automatically.
   */

  start() {
    this.logger.trace("Starting landing sequence");
    window.removeEventListener(
      EVENTS.system.preloaderOut,
      this.handlePreloaderOut,
    );
    // if (this.state.isStarted) return;
    // this.state.isStarted = true;

    try {
      this.sections?.video?.playIntro?.();
      // The expectation is that the video intro will emit an event on completion that triggers the hero
      // intro, so we don't need to call playLanding() here. If we want to trigger the hero intro immediately
      // without waiting for the video, we could call playLanding() here instead.
    } catch (error) {
      this.logger.trace("Error starting hero intro", error, "verbose", "error");
      this.state.isStarted = false;
    }
  }

  /**
   * Reset sequence to initial state
   *
   * Resets all section controllers and clears state flags.
   * Does not remove event listeners - use destroy() for full cleanup.
   */
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

  /**
   * Cleanup and remove event listeners
   *
   * Call when sequence no longer needed to prevent memory leaks.
   * Sequence cannot be reused after destroy().
   */
  destroy() {
    if (this.handlePreloaderOut) {
      window.removeEventListener(
        EVENTS.system.preloaderOut,
        this.handlePreloaderOut,
      );
    }

    this.logger.trace(
      "Destroying sequence and cleaning up",
      null,
      "brief",
      "standard",
    );

    this._listeners.forEach((unsubscribe) => unsubscribe());
    this._listeners = [];
    this.sections = null;
    this.gelManager = null;
    this.bus = null;
  }

  /**
   * Apply the mapped gel arrangement for a given section id.
   * @private
   * @param {string} sectionId
   */
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

    if (this.state.activeGelArrangementId === arrangementId) {
      return;
    }

    const arrangement = GEL_ARRANGEMENTS[arrangementId];
    if (!arrangement) {
      this.logger.trace(`Missing gel arrangement: ${arrangementId}`);
      return;
    }

    this.gelManager.applyArrangement(arrangement);
    this.state.activeGelArrangementId = arrangementId;
  }

  /**
   * Pause the background video playback without triggering section outro events.
   * LandingSequence owns this cross-section media handoff behavior.
   * @private
   */
  _pauseBackgroundVideo() {
    const videoEl = this.sections?.video?.videoEl ?? null;
    videoEl?.pause?.();
  }

  /**
   * Resume background video playback after back-scrolling out of bio.
   * @private
   */
  _resumeBackgroundVideo() {
    const videoEl = this.sections?.video?.videoEl ?? null;
    const playPromise = videoEl?.play?.();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }

  /**
   * Wire AnimationBus listeners to drive the sequence
   * @private
   */
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
      this._pauseBackgroundVideo();
    });

    on(EVENTS.bio.onEnterBack, () => {
      this.logger.trace(SELECTORS.bio + " entered back");
      this._pauseBackgroundVideo();
    });

    on(EVENTS.bio.exit, () => {
      this.logger.trace(SELECTORS.bio + " exited");
      this._resumeBackgroundVideo();
    });
  }
}
