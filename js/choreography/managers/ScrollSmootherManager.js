/**
 * ---
 * aix:
 *   id: frontend.js.choreography.managers.scrollsmoothermanager
 *   role: Frontend runtime module: js/choreography/managers/ScrollSmootherManager.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - managers
 * ---
 */
/**
 * ScrollSmootherManager - GSAP ScrollSmoother Integration
 *
 * Manages ScrollSmoother initialization, lifecycle, and accessibility.
 * Auto-detects DOM requirements and gracefully degrades when unavailable.
 *
 * REQUIREMENTS:
 * - HTML: IDs configured via SELECTORS.smoothWrapper and SELECTORS.smoothContent
 * - GSAP: ScrollSmoother and ScrollTrigger plugins
 *
 * FEATURES:
 * - Auto-detection of smoother availability
 * - Integrates with ReducedMotionHandler for accessibility
 * - Lazy initialization on demand
 * - Graceful degradation to native scroll
 *
 * USAGE:
 * const manager = new ScrollSmootherManager(reducedMotionHandler);
 * const smoother = manager.getSmoother(); // null if unavailable
 * manager.enable(); // Force initialization if not already active
 */

// ESM-friendly GSAP core + plugins (skypack)
import { ScrollSmoother } from "/assets/js/choreography/vendor/gsap.js";
import { SELECTORS } from "/assets/js/choreography/config/index.js";

const SMOOTHER_EFFECTS = true; // Enable parallax effects
const SMOOTHER_ENABLED = true; // Global disable flag for debugging/UX testing
const SMOOTH_WRAPPER_SELECTOR = `#${SELECTORS.smoothWrapper}`;
const SMOOTH_CONTENT_SELECTOR = `#${SELECTORS.smoothContent}`;

export default class ScrollSmootherManager {
  /**
   * @param {ReducedMotionHandler} reducedMotionHandler - Reduced motion coordinator
   */
  constructor(reducedMotionHandler) {
    this._reducedMotionHandler = reducedMotionHandler;
    this._smoother = null;
    this._isAvailable = this._checkAvailability();

    // Subscribe to reduced motion changes
    if (reducedMotionHandler) {
      this._unsubscribe = reducedMotionHandler.onChange((enabled) => {
        if (enabled && this._smoother) {
          this.disable();
        } else if (!enabled && this._isAvailable && !this._smoother) {
          this.enable();
        }
      });
    }
  }

  /**
   * Check if ScrollSmoother DOM requirements exist
   * @private
   * @returns {boolean} True if configured smoother wrapper/content elements exist
   */
  _checkAvailability() {
    const wrapper = document.querySelector(SMOOTH_WRAPPER_SELECTOR);
    const content = document.querySelector(SMOOTH_CONTENT_SELECTOR);
    return !!(wrapper && content);
  }

  /**
   * Initialize ScrollSmoother instance
   * @returns {boolean} True if initialization succeeded
   */
  enable() {
    if (!SMOOTHER_ENABLED) return false; // Global disable override
    if (!this._isAvailable) return false;
    if (this._reducedMotionHandler?.isReducedMotion()) return false;
    if (this._smoother) return true;

    try {
      this._smoother = ScrollSmoother.create({
        wrapper: SMOOTH_WRAPPER_SELECTOR,
        content: SMOOTH_CONTENT_SELECTOR,
        smooth: 0,
        effects: SMOOTHER_EFFECTS,
        normalizeScroll: true, // ← Add this
        ignoreMobileResize: true, // ← Add this
        preventDefault: false, // ← Ensure this is false
      });
      return true;
    } catch (e) {
      console.error("ScrollSmootherManager: Failed to create instance", e);
      return false;
    }
  }

  /**
   * Destroy ScrollSmoother instance
   */
  disable() {
    if (this._smoother && this._smoother.kill) {
      this._smoother.kill();
      this._smoother = null;
    }
  }

  /**
   * Get ScrollSmoother instance (lazy initialization)
   * @returns {ScrollSmoother|null} Instance or null if unavailable
   */
  getSmoother() {
    if (!this._smoother && this._isAvailable) {
      this.enable();
    }
    return this._smoother;
  }

  /**
   * Check if ScrollSmoother is available and active
   * @returns {boolean} True if smoother is running
   */
  isActive() {
    return !!this._smoother;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.disable();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}
