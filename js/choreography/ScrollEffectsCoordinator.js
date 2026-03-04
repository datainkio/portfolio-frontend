/**
 * ---
 * aix:
 *   id: frontend.js.choreography.scrolleffectscoordinator
 *   role: Frontend runtime module: js/choreography/ScrollEffectsCoordinator.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - ScrollEffectsCoordinator.js
 * ---
 */
/** @format */

/**
 * StageManager - Master Scroll & Visual Effects Coordinator
 * Maintains temporal coordination between section transitions and background effects.
 * It does not handle coordination between sections; that is the role of AnimationDirector.
 *
 * Orchestrates site-wide scroll smoothing, background layers, and gel effects
 * via specialized manager modules. Coordinates with AnimationBus to sequence
 * visual effects based on section animation events.
 *
 * Delegates to specialized managers:
 * - ReducedMotionHandler: Accessibility and motion preferences
 * - BackgroundLayerManager: Fixed background positioning
 * - ScrollSmootherManager: GSAP smooth scrolling
 * - GelAnimationManager: Gel background lifecycle
 *
 * ARCHITECTURE:
 * - Modular design with single-responsibility managers
 * - Each manager handles specific concern independently
 * - StageManager coordinates initialization order and event-driven timing
 * - Clean separation of concerns for maintainability
 *
 * CRITICAL DEPENDENCIES:
 * - HTML: #overlay-view, #sizzle-background (background layers)
 * - HTML: #smooth-wrapper, #smooth-content (optional for smooth scroll)
 * - CSS: .bg-gel-* classes for gel styling
 * - AnimationBus: Event system for section coordination (passed from AnimationDirector)
 *
 * @requires ReducedMotionHandler - Motion preference detection
 * @requires BackgroundLayerManager - Background layer positioning
 * @requires ScrollSmootherManager - Smooth scroll coordination
 * @requires GelAnimationManager - Gel animation system
 * @requires AnimationBus - Event-driven section coordination
 */
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import ReducedMotionHandler from "/assets/js/choreography/managers/ReducedMotionHandler.js";
// import BackgroundLayerManager from "/assets/js/choreography/managers/BackgroundLayerManager.js";
import ScrollSmootherManager from "/assets/js/choreography/managers/ScrollSmootherManager.js";
import GelAnimationManager from "/assets/js/choreography/managers/GelAnimationManager.js";
import { GEL_ARRANGEMENTS } from "/assets/js/choreography/config/arrangements.js";

/**
 * ScrollEffectsCoordinator - Master Animation Coordinator
 *
 * Simplified orchestrator that delegates to specialized manager modules.
 * Handles initialization order and event-driven timing coordination for
 * scroll effects, background layers, and visual animations.
 *
 * Public API:
 * - getSmoother() - Get ScrollSmoother instance
 * - getGels() - Get Gel controller instances
 * - getVideo() - Get background video element
 * - destroy() - Cleanup all managers
 */
export default class ScrollEffectsCoordinator {
  /**
   * Initialize ScrollEffectsCoordinator with AnimationBus instance
   * @param {AnimationBus} bus - Event bus for coordination (from AnimationDirector)
   */
  constructor(bus) {
    // Create scoped logger for ScrollEffectsCoordinator operations
    this.logger = lumberjack.createScoped("ScrollEffectsCoordinator", {
      color: "#10B981",
    });
    // logger.enabled(true);
    // this.logger.enabled = false;
    // Store bus reference for event coordination
    this.bus = bus;

    // Initialize managers in dependency order
    this.reducedMotion = new ReducedMotionHandler();
    this.scrollSmoother = new ScrollSmootherManager(this.reducedMotion);
    this.gelAnimation = new GelAnimationManager(this.reducedMotion);

    this.initialize();
  }

  /**
   * Initialize all manager modules
   *
   * Sets up scroll smoothing and gel effects.
   */
  initialize() {
    // Fix background layer positioning
    // this.backgroundLayers.fix();

    // Initialize gel controllers
    this.gelAnimation.initialize();

    const arrangementOrder = Object.keys(GEL_ARRANGEMENTS);
    const initialArrangementKey = arrangementOrder[0] ?? null;
    if (initialArrangementKey) {
      const initialArrangement = GEL_ARRANGEMENTS[initialArrangementKey];
      this.gelAnimation.applyArrangement(initialArrangement, {
        immediate: true,
      });
    } else {
      this.logger.trace("No gel arrangements available for initial state");
    }

    const smoother = this.scrollSmoother.getSmoother();
    if (!smoother) {
      this._fallbackToNativeScroll();
    }

    this.logger.trace("initialized");
  }

  /**
   * Get ScrollSmoother instance
   * @returns {ScrollSmoother|null} Instance or null if disabled
   */
  getSmoother() {
    return this.scrollSmoother.getSmoother();
  }

  /**
   * Get Gel controller instances
   * @returns {Gel[]} Array of Gel controllers
   */
  getGels() {
    return this.gelAnimation.getGels();
  }

  /**
   * Get background video element
   * @returns {HTMLVideoElement|null} Video element or null
   */
  getVideo() {
    return this._video;
  }

  /**
   * Cleanup all managers and event listeners
   */
  destroy() {
    this.gelAnimation.destroy();
    this.scrollSmoother.destroy();
    this.reducedMotion.destroy();
    this._video = null;
    this._videoContainer = null;
  }

  /**
   * Restore native scrolling if ScrollSmoother cannot be initialized
   * @private
   */
  _fallbackToNativeScroll() {
    this.logger.trace(
      "Falling back to native scroll (ScrollSmoother not initialized)",
    );
    const wrapper = document.querySelector("#smooth-wrapper");
    const content = document.querySelector("#smooth-content");

    if (wrapper) {
      wrapper.style.position = "static";
      wrapper.style.height = "auto";
      wrapper.style.overflow = "visible";
    }

    if (content) {
      content.style.overflow = "visible";
    }
  }
}
