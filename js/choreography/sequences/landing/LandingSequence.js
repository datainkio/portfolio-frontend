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
import { SELECTORS } from "../../config/index.js";
// import {
//   GEL_ARRANGEMENTS,
//   SECTION_TO_GEL_ARRANGEMENT,
// } from "../../config/arrangements.js";
import { SOCKETS, LINE_STYLES } from "../../config/displays/leader-lines.js";
import LineManager from "../../managers/LineManager.js";

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
    this.lineManager = new LineManager({
      sockets: SOCKETS,
      styles: LINE_STYLES,
    });
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
    this.lineManager?.initialize();
    this.lineManager?.hideAllLines("none");
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
    this.lineManager?.reset();
  }

  /**
   * Cleanup and remove event listeners
   *
   * Call when sequence no longer needed to prevent memory leaks.
   * Sequence cannot be reused after destroy().
   */
  destroy() {
    this.lineManager?.destroy();

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
    this.lineManager = null;
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
   * Wire AnimationBus listeners to drive the sequence
   * @private
   */
  _registerListeners() {
    if (!this.bus) return;

    const on = (event, handler) => {
      const off = this.bus.on(event, handler);
      this._listeners.push(off);
    };
    /**
     * BACKGROUND VIDEO EVENTS
     */
    // Respond to video intro start
    on(EVENTS.video.introStart, () => {
      // this.logger.trace("BG Video intro started");
    });

    // This is where it all begins. The video intro completes, we trigger the hero intro.
    on(EVENTS.video.introComplete, () => {
      //  this.logger.trace("BG Video intro complete");
      this.sections?.hero?.playLanding?.();
    });

    // Respond to video outro start
    on(EVENTS.video.outroStart, () => {
      // this.logger.trace("BG Video outro started");
    });

    // Respond to video outro complete
    on(EVENTS.video.outroComplete, () => {
      // this.logger.trace("BG Video outro complete");
      // this.sections?.work?.playIntro?.();
    });

    /**
     * HERO EVENTS
     */

    // Respond to hero intro start
    on(EVENTS.hero.enter, () => {
      this.logger.trace(SELECTORS.hero + " entered");
      // this._applySectionArrangement(SELECTORS.hero);
    });

    on(EVENTS.hero.exit, () => {
      this.logger.trace(SELECTORS.hero + " exited");
      this.lineManager?.connect(SELECTORS.hero, SELECTORS.bio, "none");
    });

    // Respond to hero intro start
    on(EVENTS.hero.introStart, () => {
      // this.logger.trace(SELECTORS.hero + " intro started");
      // this._applySectionArrangement("hero");
    });

    // Respond to hero intro complete
    on(EVENTS.hero.introComplete, () => {
      // this.logger.trace(SELECTORS.hero + " intro complete");
    });

    // Respond to hero outro start
    on(EVENTS.hero.outroStart, () => {
      // this.logger.trace(SELECTORS.hero + " outro started");
    });

    // Respond to hero outro complete
    on(EVENTS.hero.outroComplete, () => {
      // this.logger.trace(SELECTORS.hero + " outro complete");
      // this.sections?.work?.playIntro?.();
    });

    /**
     * ORGANIZATIONS EVENTS
     */

    // Respond to organizations intro start
    on(EVENTS.organizations.enter, () => {
      // this.logger.trace("Organizations entered");
    });

    on(EVENTS.organizations.exit, () => {
      // this.logger.trace("Organizations exited");
    });

    // Respond to organizations intro start
    on(EVENTS.organizations.introStart, () => {
      // this.logger.trace('Organizations intro started');
    });

    // Respond to organizations intro complete
    on(EVENTS.organizations.introComplete, () => {
      // this.logger.trace('Organizations intro complete');
      // this.gelManager?
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      // this.sections?.video?.playIntro?.();
    });

    // Respond to organizations outro start
    on(EVENTS.organizations.outroStart, () => {
      // this.logger.trace('Organizations outro started');
    });

    // Respond to organizations outro complete
    on(EVENTS.organizations.outroComplete, () => {
      // this.logger.trace('Organizations outro complete');
      // this.sections?.work?.playIntro?.();
    });

    /**
     * BIO EVENTS
     */

    // Respond to bio intro start
    on(EVENTS.bio.enter, () => {
      this.logger.trace(SELECTORS.bio + " entered.");
    });

    on(EVENTS.bio.exit, () => {
      this.logger.trace(SELECTORS.bio + " exited");
      // this.lineManager?.connect(SELECTORS.bio, SELECTORS.awards, "none");
    });

    // Respond to bio intro start
    on(EVENTS.bio.introStart, () => {
      // this.logger.trace(SELECTORS.bio + " intro started");
    });

    // Respond to bio intro complete
    on(EVENTS.bio.introComplete, () => {
      // this.logger.trace(SELECTORS.bio + " intro complete");
    });

    // Respond to bio outro start
    on(EVENTS.bio.outroStart, () => {
      // this.logger.trace(SELECTORS.bio + " outro started");
    });

    // Respond to bio outro complete
    on(EVENTS.bio.outroComplete, () => {
      // this.logger.trace(SELECTORS.bio + " outro complete");
    });

    /**
     * AWARDS EVENTS
     */

    // Respond to awards enter/exit
    on(EVENTS.awards.enter, () => {
      // this.logger.trace(SELECTORS.awards + " entered");
    });

    on(EVENTS.awards.exit, () => {
      // this.logger.trace(SELECTORS.awards + " exited");
      // this.lineManager?.connect(SELECTORS.awards, SELECTORS.work, "none");
    });

    // Respond to awards intro start
    on(EVENTS.awards.introStart, () => {
      // this.logger.trace(SELECTORS.awards + " intro started");
    });

    // Respond to awards intro complete
    on(EVENTS.awards.introComplete, () => {
      // this.logger.trace(SELECTORS.awards + " intro complete");
    });

    // Respond to awards outro start
    on(EVENTS.awards.outroStart, () => {
      // this.logger.trace(SELECTORS.awards + " outro started");
    });

    // Respond to awards outro complete
    on(EVENTS.awards.outroComplete, () => {
      // this.logger.trace(SELECTORS.awards + " outro complete");
    });

    /**
     * WORK EVENTS
     */

    on(EVENTS.work.enter, () => {
      // this.logger.trace(SELECTORS.work + " entered");
    });

    on(EVENTS.work.exit, () => {
      // this.logger.trace(SELECTORS.work + " exited");
      // this.lineManager?.connect(
      //   SELECTORS.work,
      //   SELECTORS.organizations,
      //   "none",
      // );
    });

    on(EVENTS.work.introStart, () => {
      // this.logger.trace(SELECTORS.work + " intro started");
    });

    on(EVENTS.work.introComplete, () => {
      // this.logger.trace(SELECTORS.work + " intro complete");
    });

    on(EVENTS.work.outroStart, () => {
      // this.logger.trace(SELECTORS.work + " outro started");
    });

    on(EVENTS.work.outroComplete, () => {
      // this.logger.trace(SELECTORS.work + " outro complete");
      // this.lineManager?.connect(SELECTORS.work, SELECTORS.organizations, "none");
    });
  }
}
