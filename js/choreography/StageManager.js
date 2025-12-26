/** @format */

/**
 * StageManager - Master Scroll & Visual Effects Coordinator
 * Maintains temporal coordination between section transitions and background effects. It does not handle coordination between sections; that is the role of the Director class.
 *
 * Orchestrates site-wide scroll smoothing, background layers, and gel animations
 * via specialized manager modules. Coordinates with AnimationBus to sequence
 * visual effects based on section animation events.
 *
 * Delegates to specialized managers:
 * - ReducedMotionHandler: Accessibility and motion preferences
 * - BackgroundLayerManager: Fixed background positioning
 * - ScrollSmootherManager: GSAP smooth scrolling
 * - GelAnimationManager: Gel background animations
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
 * - AnimationBus: Event system for section coordination (passed from Director)
 *
 * @requires ReducedMotionHandler - Motion preference detection
 * @requires BackgroundLayerManager - Background layer positioning
 * @requires ScrollSmootherManager - Smooth scroll coordination
 * @requires GelAnimationManager - Gel animation system
 * @requires AnimationBus - Event-driven section coordination
 */
import lumberjack from '/assets/js/utils/lumberjack/index.js';
import ReducedMotionHandler from '/assets/js/choreography/managers/ReducedMotionHandler.js';
import BackgroundLayerManager from '/assets/js/choreography/managers/BackgroundLayerManager.js';
import ScrollSmootherManager from '/assets/js/choreography/managers/ScrollSmootherManager.js';
import GelAnimationManager from '/assets/js/choreography/managers/GelAnimationManager.js';
import { GEL_CONFIG } from '/assets/js/choreography/config.js';

/**
 * StageManager - Master Animation Coordinator
 *
 * Simplified orchestrator that delegates to specialized manager modules.
 * Handles initialization order and event-driven timing coordination.
 *
 * Public API:
 * - getSmoother() - Get ScrollSmoother instance
 * - getGels() - Get Gel controller instances
 * - getVideo() - Get background video element
 * - destroy() - Cleanup all managers
 */
export default class StageManager {
  /**
   * Initialize StageManager with AnimationBus instance
   * @param {AnimationBus} bus - Event bus for coordination (from Director)
   */
  constructor(bus) {
    // Create scoped logger for Director operations
    this.logger = lumberjack.createScoped('StageManager', {
      color: '#10B981',
    });
    // logger.enabled(true);
    // this.logger.enabled = false;
    // Store bus reference for event coordination
    this.bus = bus;

    // Initialize managers in dependency order
    this.reducedMotion = new ReducedMotionHandler();
    this.backgroundLayers = new BackgroundLayerManager(['overlay-view', 'sizzle-background']);
    this.scrollSmoother = new ScrollSmootherManager(this.reducedMotion);
    this.gelAnimation = new GelAnimationManager(GEL_CONFIG, this.reducedMotion);

    // Cache video and container references for external access
    this._videoContainer = document.querySelector('#overlay-view');
    // this._video = this._videoContainer?.querySelector('video');

    // Track gel animation state
    this._gelsAnimated = false;

    this.initialize();
  }

  /**
   * Initialize all manager modules
   *
   * Sets up background layers, scroll smoothing, and gel animations.
   * Gel animations are held until Hero outro completes.
   */
  initialize() {
    // Fix background layer positioning
    // this.backgroundLayers.fix();

    // Initialize gel controllers (but don't animate yet)
    this.gelAnimation.initialize();

    // Attempt to initialize ScrollSmoother immediately so the wrapper does not lock scrolling
    const smoother = this.scrollSmoother.getSmoother();

    // console.log('[StageManager] Initialized all managers');
    this._startGelAnimations();

    this.logger.trace('initialized');
  }

  /**
   * Start gel
   * @private
   */
  _startGelAnimations() {
    if (this._gelsAnimated) return; // Prevent multiple calls

    // Start gel animation (uses smoother scroller if available)
    const scroller = this.scrollSmoother.isActive() ? '#smooth-wrapper' : undefined;
    this.gelAnimation.animate(scroller);
    this._gelsAnimated = true;
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
    this.logger.trace('Falling back to native scroll (ScrollSmoother not initialized)');
    const wrapper = document.querySelector('#smooth-wrapper');
    const content = document.querySelector('#smooth-content');

    if (wrapper) {
      wrapper.style.position = 'static';
      wrapper.style.height = 'auto';
      wrapper.style.overflow = 'visible';
    }

    if (content) {
      content.style.overflow = 'visible';
    }
  }
}
