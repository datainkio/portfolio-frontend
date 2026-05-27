/**
 * ReducedMotionHandler - Accessibility-focused motion detection
 *
 * Monitors and responds to user's prefers-reduced-motion setting.
 * Provides central API for checking motion state and registering callbacks.
 */
import { ACCESSIBILITY_SETTINGS } from "../config/index/index.js";

export default class ReducedMotionHandler {
  constructor() {
    this._reducedMotion = ACCESSIBILITY_SETTINGS.prefersReducedMotion;
    this._mql = null;
    this._callbacks = [];
    this._setup();
  }

  _setup() {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const query = "(prefers-reduced-motion: reduce)";
    this._mql = window.matchMedia(query);
    this._reducedMotion = !!this._mql.matches;

    const handler = (e) => {
      this._reducedMotion = !!e.matches;
      this._notify();
    };

    if (this._mql.addEventListener) {
      this._mql.addEventListener("change", handler);
    } else if (this._mql.addListener) {
      this._mql.addListener(handler);
    }
  }

  _notify() {
    this._callbacks.forEach((cb) => {
      try {
        cb(this._reducedMotion);
      } catch (e) {
        console.error("ReducedMotionHandler callback error:", e);
      }
    });
  }

  /** @returns {boolean} */
  isReducedMotion() {
    return this._reducedMotion;
  }

  /**
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  onChange(callback) {
    if (typeof callback !== "function") return () => {};
    this._callbacks.push(callback);
    return () => {
      this._callbacks = this._callbacks.filter((cb) => cb !== callback);
    };
  }

  destroy() {
    this._callbacks = [];
    this._mql = null;
  }
}
