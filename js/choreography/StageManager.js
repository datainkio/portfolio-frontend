/**
 * StageManager - Master Scroll & Visual Effects Coordinator
 *
 * Orchestrates site-wide scroll smoothing, background layers, and gel animations
 * via specialized manager modules. Simplified coordinator that delegates to:
 *
 * - ReducedMotionHandler: Accessibility and motion preferences
 * - BackgroundLayerManager: Fixed background positioning
 * - ScrollSmootherManager: GSAP smooth scrolling
 * - GelAnimationManager: Gel background animations
 *
 * ARCHITECTURE:
 * - Modular design with single-responsibility managers
 * - Each manager handles specific concern independently
 * - StageManager coordinates initialization order
 * - Clean separation of concerns for maintainability
 *
 * CRITICAL DEPENDENCIES:
 * - HTML: #overlay-view, #sizzle-background (background layers)
 * - HTML: #smooth-wrapper, #smooth-content (optional for smooth scroll)
 * - CSS: .bg-gel-* classes for gel styling
 *
 * @requires ReducedMotionHandler - Motion preference detection
 * @requires BackgroundLayerManager - Background layer positioning
 * @requires ScrollSmootherManager - Smooth scroll coordination
 * @requires GelAnimationManager - Gel animation system
 */

import ReducedMotionHandler from '/assets/js/choreography/managers/ReducedMotionHandler.js';
import BackgroundLayerManager from '/assets/js/choreography/managers/BackgroundLayerManager.js';
import ScrollSmootherManager from '/assets/js/choreography/managers/ScrollSmootherManager.js';
import GelAnimationManager from '/assets/js/choreography/managers/GelAnimationManager.js';

/**
 * StageManager - Master Animation Coordinator
 *
 * Simplified orchestrator that delegates to specialized manager modules.
 * Handles initialization order and provides unified API for external access.
 *
 * Public API:
 * - getSmoother() - Get ScrollSmoother instance
 * - getGels() - Get Gel controller instances
 * - destroy() - Cleanup all managers
 */
export default class StageManager {
  constructor() {
    // Initialize managers in dependency order
    this.reducedMotion = new ReducedMotionHandler();
    this.backgroundLayers = new BackgroundLayerManager(['overlay-view', 'sizzle-background']);
    this.scrollSmoother = new ScrollSmootherManager(this.reducedMotion);
    this.gelAnimation = new GelAnimationManager(undefined, this.reducedMotion);

    // Cache video reference for external access
    this._video = document.querySelector('#overlay-view video');

    this.initialize();
  }

  /**
   * Initialize all manager modules
   *
   * Sets up background layers, scroll smoothing, and gel animations
   * in proper dependency order.
   */
  initialize() {
    // Fix background layer positioning
    this.backgroundLayers.fix();

    // Initialize gel controllers
    this.gelAnimation.initialize();

    // Start gel animation (uses smoother scroller if available)
    const scroller = this.scrollSmoother.isActive() ? '#smooth-wrapper' : undefined;
    this.gelAnimation.animate(scroller);
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
   * Cleanup all managers
   */
  destroy() {
    this.gelAnimation.destroy();
    this.scrollSmoother.destroy();
    this.reducedMotion.destroy();
    this._video = null;
  }
}
