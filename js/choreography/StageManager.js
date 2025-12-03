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
 * - getVideo() - Get background video element
 * - showVideo() - Show background video
 * - hideVideo() - Hide background video
 * - destroy() - Cleanup all managers
 */
export default class StageManager {
  constructor() {
    // Initialize managers in dependency order
    this.reducedMotion = new ReducedMotionHandler();
    this.backgroundLayers = new BackgroundLayerManager(['overlay-view', 'sizzle-background']);
    this.scrollSmoother = new ScrollSmootherManager(this.reducedMotion);

    // Configure gel animations with custom target for bgGel_1
    const gelConfig = {
      bgGel_0: { target: 1 / 6, axis: 'x', position: 'left' },
      bgGel_1: { axis: 'y', targetElement: '#main-title', position: 'center' }, // Height matches H1
      bgGel_2: { target: 3 / 4, axis: 'x', position: 'left' },
    };
    this.gelAnimation = new GelAnimationManager(gelConfig, this.reducedMotion);

    // Cache video and container references for external access
    this._videoContainer = document.querySelector('#overlay-view');
    this._video = this._videoContainer?.querySelector('video');
    this._videoVisible = true;

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
   * Show background video
   * Maintains video playback state and all other functionality
   */
  showVideo() {
    if (this._videoContainer) {
      this._videoContainer.style.display = '';
      this._videoVisible = true;
    }
  }

  /**
   * Hide background video
   * Maintains video playback state and all other functionality
   */
  hideVideo() {
    if (this._videoContainer) {
      this._videoContainer.style.display = 'none';
      this._videoVisible = false;
    }
  }

  /**
   * Check if video is currently visible
   * @returns {boolean} True if video is visible
   */
  isVideoVisible() {
    return this._videoVisible;
  }

  /**
   * Toggle video visibility
   * @returns {boolean} New visibility state
   */
  toggleVideo() {
    if (this._videoVisible) {
      this.hideVideo();
    } else {
      this.showVideo();
    }
    return this._videoVisible;
  }

  /**
   * Cleanup all managers
   */
  destroy() {
    this.gelAnimation.destroy();
    this.scrollSmoother.destroy();
    this.reducedMotion.destroy();
    this._video = null;
    this._videoContainer = null;
  }
}
