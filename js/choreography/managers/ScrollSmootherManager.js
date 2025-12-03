/**
 * ScrollSmootherManager - GSAP ScrollSmoother Integration
 *
 * Manages ScrollSmoother initialization, lifecycle, and accessibility.
 * Auto-detects DOM requirements and gracefully degrades when unavailable.
 *
 * REQUIREMENTS:
 * - HTML: #smooth-wrapper and #smooth-content elements (both required)
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

import { gsap } from '/assets/js/gsap/all.js';
import { ScrollSmoother } from '/assets/js/gsap/ScrollSmoother.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const SMOOTHER_EFFECTS = true; // Enable parallax effects

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
      this._unsubscribe = reducedMotionHandler.onChange(enabled => {
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
   * @returns {boolean} True if #smooth-wrapper and #smooth-content exist
   */
  _checkAvailability() {
    const wrapper = document.querySelector('#smooth-wrapper');
    const content = document.querySelector('#smooth-content');
    return !!(wrapper && content);
  }

  /**
   * Initialize ScrollSmoother instance
   * @returns {boolean} True if initialization succeeded
   */
  enable() {
    if (!this._isAvailable) return false;
    if (this._reducedMotionHandler?.isReducedMotion()) return false;
    if (this._smoother) return true; // Already enabled

    try {
      this._smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: SMOOTHER_EFFECTS,
      });
      return true;
    } catch (e) {
      console.error('ScrollSmootherManager: Failed to create instance', e);
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
