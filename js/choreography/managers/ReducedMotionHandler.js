/**
 * ReducedMotionHandler - Accessibility-focused motion detection
 *
 * Monitors and responds to user's prefers-reduced-motion setting.
 * Provides central API for checking motion state and registering callbacks.
 *
 * FEATURES:
 * - Auto-detects prefers-reduced-motion media query
 * - Watches for real-time preference changes
 * - Callback system for components to respond to changes
 * - Graceful fallback for environments without matchMedia
 *
 * USAGE:
 * const handler = new ReducedMotionHandler();
 * if (handler.isReducedMotion()) {
 *   // Use reduced animations
 * }
 * handler.onChange(enabled => {
 *   // Respond to changes
 * });
 */
export default class ReducedMotionHandler {
  constructor() {
    this._reducedMotion = false;
    this._mql = null;
    this._callbacks = [];
    this._setup();
  }

  /**
   * Initialize media query listener
   * @private
   */
  _setup() {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    const query = '(prefers-reduced-motion: reduce)';
    this._mql = window.matchMedia(query);
    this._reducedMotion = !!this._mql.matches;

    const handler = e => {
      this._reducedMotion = !!e.matches;
      this._notify();
    };

    if (this._mql.addEventListener) {
      this._mql.addEventListener('change', handler);
    } else if (this._mql.addListener) {
      this._mql.addListener(handler);
    }
  }

  /**
   * Notify all registered callbacks of state change
   * @private
   */
  _notify() {
    this._callbacks.forEach(cb => {
      try {
        cb(this._reducedMotion);
      } catch (e) {
        console.error('ReducedMotionHandler callback error:', e);
      }
    });
  }

  /**
   * Check if reduced motion is currently enabled
   * @returns {boolean} True if user prefers reduced motion
   */
  isReducedMotion() {
    return this._reducedMotion;
  }

  /**
   * Register callback for motion preference changes
   * @param {Function} callback - Called with boolean when preference changes
   * @returns {Function} Unsubscribe function
   */
  onChange(callback) {
    if (typeof callback !== 'function') return () => {};
    this._callbacks.push(callback);
    return () => {
      this._callbacks = this._callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    this._callbacks = [];
    // Note: MediaQueryList doesn't support removeEventListener in all browsers
    this._mql = null;
  }
}
