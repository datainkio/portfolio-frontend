/**
 * ScrollSmootherManager - GSAP ScrollSmoother Integration
 *
 * Manages ScrollSmoother initialization, lifecycle, and accessibility.
 * Auto-detects DOM requirements and gracefully degrades when unavailable.
 */
import { ScrollSmoother } from "/assets/js/choreography/system/gsap.js";
import { SELECTORS } from "../../config/index/index.js";

const SMOOTHER_EFFECTS = true;
const SMOOTHER_ENABLED = true;
const SMOOTH_WRAPPER_SELECTOR = `#${SELECTORS.smoothWrapper}`;
const SMOOTH_CONTENT_SELECTOR = `#${SELECTORS.smoothContent}`;

export default class ScrollSmootherManager {
  /** @param {ReducedMotionHandler} reducedMotionHandler */
  constructor(reducedMotionHandler) {
    this._reducedMotionHandler = reducedMotionHandler;
    this._smoother = null;
    this._isAvailable = this._checkAvailability();
    this._onAnchorClick = this._onAnchorClick.bind(this);

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

  _checkAvailability() {
    const wrapper = document.querySelector(SMOOTH_WRAPPER_SELECTOR);
    const content = document.querySelector(SMOOTH_CONTENT_SELECTOR);
    return !!(wrapper && content);
  }

  enable() {
    if (!SMOOTHER_ENABLED) return false;
    if (!this._isAvailable) return false;
    if (this._reducedMotionHandler?.isReducedMotion()) return false;
    if (this._smoother) return true;

    try {
      this._smoother = ScrollSmoother.create({
        wrapper: SMOOTH_WRAPPER_SELECTOR,
        content: SMOOTH_CONTENT_SELECTOR,
        smooth: 1,
        effects: SMOOTHER_EFFECTS,
        normalizeScroll: true,
        ignoreMobileResize: true,
        preventDefault: false,
      });
      document.addEventListener("click", this._onAnchorClick);
      return true;
    } catch (e) {
      console.error("ScrollSmootherManager: Failed to create instance", e);
      return false;
    }
  }

  disable() {
    document.removeEventListener("click", this._onAnchorClick);
    if (this._smoother && this._smoother.kill) {
      this._smoother.kill();
      this._smoother = null;
    }
  }

  /**
   * Route same-page `#hash` links through the smoother. Left native, the
   * browser scrolls the fixed, overflow-hidden wrapper to the target instead
   * of the window; the smoother never resets that offset, so the page can no
   * longer be scrolled back above it.
   */
  _onAnchorClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href^="#"]');
    const hash = link?.getAttribute("href");
    if (!this._smoother || !hash || hash === "#") return;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target || !this._smoother.content().contains(target)) return;

    event.preventDefault();
    this._smoother.scrollTo(target, true, "top top");
    history.pushState(null, "", hash);
    target.focus({ preventScroll: true });
  }

  getSmoother() {
    if (!this._smoother && this._isAvailable) {
      this.enable();
    }
    return this._smoother;
  }

  isActive() {
    return !!this._smoother;
  }

  destroy() {
    this.disable();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}
