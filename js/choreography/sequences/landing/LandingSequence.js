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
import {
  GEL_ARRANGEMENTS,
  SECTION_TO_GEL_ARRANGEMENT,
} from "../../config/arrangements.js";
import {
  SECTION_LEAD_LINE_ANCHORS,
  SECTION_LEAD_LINE_STYLES,
  SECTION_LEAD_LINE_THEME,
} from "../../config/displays/section-lead-lines.js";

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
    this._sectionLeadLines = [];
    this._linePositionRaf = null;
    this._handleLinePositionUpdate = () => {
      if (this._linePositionRaf !== null) return;
      this._linePositionRaf = window.requestAnimationFrame(() => {
        this._linePositionRaf = null;
        this._positionSectionLeadLines();
      });
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
    this._drawSectionLeadLines();
    this._positionSectionLeadLines();
    window.addEventListener("resize", this._handleLinePositionUpdate, {
      passive: true,
    });
    window.addEventListener("scroll", this._handleLinePositionUpdate, {
      passive: true,
    });
    window.addEventListener("load", this._handleLinePositionUpdate, {
      once: true,
    });
    this._handleLinePositionUpdate();
    setTimeout(() => this._positionSectionLeadLines(), 250);
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
    this._destroySectionLeadLines();
    if (this._handleLinePositionUpdate) {
      window.removeEventListener("resize", this._handleLinePositionUpdate);
      window.removeEventListener("scroll", this._handleLinePositionUpdate);
    }
    if (this._linePositionRaf !== null) {
      window.cancelAnimationFrame(this._linePositionRaf);
      this._linePositionRaf = null;
    }

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
   * Draw section-to-section lead lines in main content.
   * Each line starts at the bottom edge of a section and points to the
   * top edge of the following section.
   * @private
   */
  _drawSectionLeadLines() {
    this._destroySectionLeadLines();

    const LeaderLine = window.LeaderLine;
    if (!LeaderLine || typeof LeaderLine.pointAnchor !== "function") {
      this.logger.trace("LeaderLine unavailable; skipping section lead lines");
      return;
    }

    const main = document.querySelector("main");
    if (!main) return;

    const lineStyle = this._getSectionLeadLineStyle(main);

    const sections = Array.from(main.children).filter(
      (element) => element.tagName === "SECTION",
    );
    if (sections.length < 2) return;

    for (let i = 0; i < sections.length - 1; i += 1) {
      const currentSection = sections[i];
      const nextSection = sections[i + 1];

      const line = new LeaderLine(
        LeaderLine.pointAnchor(currentSection, SECTION_LEAD_LINE_ANCHORS.start),
        LeaderLine.pointAnchor(nextSection, SECTION_LEAD_LINE_ANCHORS.end),
        lineStyle,
      );

      this._sectionLeadLines.push(line);
    }

    this.logger.trace(
      `Section lead lines drawn: ${this._sectionLeadLines.length}`,
    );
  }

  /**
   * Recalculate lead line positions after layout or scroll changes.
   * @private
   */
  _positionSectionLeadLines() {
    this._sectionLeadLines.forEach((line) => {
      if (line && typeof line.position === "function") {
        line.position();
      }
    });
  }

  /**
   * Resolve a Tailwind theme CSS variable from :root.
   * @private
   * @param {string} variableName
   * @param {string} fallback
   * @returns {string}
   */
  _resolveTailwindColor(variableName, fallback) {
    const value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();

    return value || fallback;
  }

  /**
   * Build section lead line style values from Tailwind theme tokens.
   * @private
   * @param {HTMLElement} main
   * @returns {object}
   */
  _getSectionLeadLineStyle(main) {
    const mainColor = window.getComputedStyle(main).color || "#E6E7E7";
    const accentColor = this._resolveTailwindColor(
      SECTION_LEAD_LINE_THEME.stroke.variableName,
      mainColor,
    );
    const outlineColor = this._resolveTailwindColor(
      SECTION_LEAD_LINE_THEME.outline.variableName,
      SECTION_LEAD_LINE_THEME.outline.fallback,
    );

    return {
      ...SECTION_LEAD_LINE_STYLES,
      color: accentColor,
      endPlugColor: accentColor,
      startPlugColor: accentColor,
      outlineColor,
    };
  }

  /**
   * Remove all section lead lines.
   * @private
   */
  _destroySectionLeadLines() {
    this._sectionLeadLines.forEach((line) => {
      if (line && typeof line.remove === "function") {
        line.remove();
      }
    });
    this._sectionLeadLines = [];
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
      this.logger.trace("BG Video intro started");
    });

    // This is where it all begins. The video intro completes, we trigger the hero intro.
    on(EVENTS.video.introComplete, () => {
      this.logger.trace("BG Video intro complete");
      this.sections?.hero?.playLanding?.();
    });

    // Respond to video outro start
    on(EVENTS.video.outroStart, () => {
      this.logger.trace("BG Video outro started");
    });

    // Respond to video outro complete
    on(EVENTS.video.outroComplete, () => {
      this.logger.trace("BG Video outro complete");
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
    });

    // Respond to hero intro start
    on(EVENTS.hero.introStart, () => {
      this.logger.trace(SELECTORS.hero + " intro started");
      // this._applySectionArrangement("hero");
    });

    // Respond to hero intro complete
    on(EVENTS.hero.introComplete, () => {
      this.logger.trace(SELECTORS.hero + " intro complete");
      // this.gelManager?
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      // this.sections?.video?.playIntro?.();
    });

    // Respond to hero outro start
    on(EVENTS.hero.outroStart, () => {
      this.logger.trace(SELECTORS.hero + " outro started");
    });

    // Respond to hero outro complete
    on(EVENTS.hero.outroComplete, () => {
      this.logger.trace(SELECTORS.hero + " outro complete");
      // this.sections?.work?.playIntro?.();
    });

    /**
     * ORGANIZATIONS EVENTS
     */

    // Respond to organizations intro start
    on(EVENTS.organizations.enter, () => {
      // this.logger.trace("Organizations entered");
      if (SECTION_TO_GEL_ARRANGEMENT[SELECTORS.organizations]) {
        this._applySectionArrangement(SELECTORS.organizations);
      }
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
    });

    // Respond to bio intro start
    on(EVENTS.bio.introStart, () => {
      this.logger.trace(SELECTORS.bio + " intro started");
    });

    // Respond to bio intro complete
    on(EVENTS.bio.introComplete, () => {
      this.logger.trace(SELECTORS.bio + " intro complete");
      // this.gelManager?
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      // this.sections?.video?.playIntro?.();
    });

    // Respond to bio outro start
    on(EVENTS.bio.outroStart, () => {
      this.logger.trace(SELECTORS.bio + " outro started");
    });

    // Respond to bio outro complete
    on(EVENTS.bio.outroComplete, () => {
      this.logger.trace(SELECTORS.bio + " outro complete");
    });

    /**
     * AWARDS EVENTS
     */

    // Respond to awards enter/exit
    on(EVENTS.awards.enter, () => {
      this.logger.trace(SELECTORS.awards + " entered");
      this._applySectionArrangement(SELECTORS.awards);
    });

    on(EVENTS.awards.exit, () => {
      this.logger.trace(SELECTORS.awards + " exited");
    });

    // Respond to awards intro start
    on(EVENTS.awards.introStart, () => {
      this.logger.trace(SELECTORS.awards + " intro started");
    });

    // Respond to awards intro complete
    on(EVENTS.awards.introComplete, () => {
      this.logger.trace(SELECTORS.awards + " intro complete");
    });

    // Respond to awards outro start
    on(EVENTS.awards.outroStart, () => {
      this.logger.trace(SELECTORS.awards + " outro started");
    });

    // Respond to awards outro complete
    on(EVENTS.awards.outroComplete, () => {
      this.logger.trace(SELECTORS.awards + " outro complete");
    });
  }
}
