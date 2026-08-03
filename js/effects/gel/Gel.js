/**
 * ---
 * aix:
 *   id: frontend.js.effects.gel.gel
 *   role: Frontend runtime module: js/effects/gel/Gel.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - effects
 *     - gel
 * ---
 */
/** @format */

/**
 * Gel - Visual controller for gel overlay elements
 *
 * Composes focused helpers for:
 * - Mask lifecycle (GelMask)
 * - Geometry (GelGeometry)
 * - Visual state (GelVisualState)
 */

import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import GelMask from "./GelMask.js";
import GelGeometry from "./GelGeometry.js";
import GelVisualState from "./GelVisualState.js";

const DEFAULT_COLOR_CLASSES = [
  "bg-gel-primary",
  "bg-gel-secondary",
  "bg-gel-accent",
  "bg-gel-neutral",
];
const DEFAULT_TRANSFORM_ORIGIN = "top center";
const MASK_STYLE = {
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

export default class Gel {
  /**
   * @param {HTMLElement} view - The gel DOM element
   * @param {Object} options
   * @param {string[]} [options.colorClasses] - Available color classes
   * @param {string} [options.transformOrigin] - SVG transform origin point
   * @param {HTMLElement} [options.targetElement] - Element to match with matchTarget()
   * @param {boolean} [options.masked=true] - Whether to apply the polygon mask on init
   */
  constructor(view, options = {}) {
    if (!view) throw new Error("Gel requires a DOM element as its view");

    this.view = view;
    this.masked = options.masked !== undefined ? options.masked : true;
    this.colorClasses = options.colorClasses || DEFAULT_COLOR_CLASSES;
    this.transformOrigin = options.transformOrigin || DEFAULT_TRANSFORM_ORIGIN;
    this.targetElement = options.targetElement || null;
    this.currentState = null;

    this.logger = lumberjack.createScoped(view.id || "Gel", {
      color: "#8B5CF6",
    });

    this.geometry = new GelGeometry(this.view);
    this.mask = new GelMask(this.view, this.geometry, MASK_STYLE);
    this.visual = new GelVisualState(this.view, {
      colorClasses: this.colorClasses,
      transformOrigin: this.transformOrigin,
    });

    this._resizeObserver = null;

    // Keep behavior consistent with previous versions: init and apply mask immediately.
    this.initialize();
  }

  /**
   * Initialize the gel. Safe to call multiple times.
   * @param {Object} options
   * @param {boolean} [options.applyMask=true] - Apply CSS mask on init
   * @param {boolean} [options.autoRefresh=false] - Attach ResizeObserver to auto-refresh polygon
   */
  initialize({ applyMask = this.masked, autoRefresh = false } = {}) {
    this.logger.trace("initializing gel");
    this.mask.ensure();
    if (applyMask) {
      this.mask.apply();
      this.masked = true;
    } else {
      this.mask.remove();
      this.masked = false;
    }
    if (autoRefresh) {
      this.enableAutoRefresh();
    }
  }

  applyMask() {
    this.logger.trace("applying mask");
    this.mask.apply();
    this.masked = true;
  }

  removeMask() {
    this.logger.trace("removing mask");
    this.mask.remove();
    this.masked = false;
  }

  /**
   * Invert the mask so the polygon punches a hole instead of revealing inside.
   * @param {boolean} [enabled=true]
   */
  invertMask(enabled = true) {
    this.mask.invert(enabled);
  }

  /**
   * Animate a corner to new position.
   * @param {string} corner - 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
   */
  setCorner(corner, x, y, duration = 0.6, ease = "power3.out") {
    if (!this.geometry.corners[corner]) {
      console.warn(`Gel: Invalid corner name "${corner}"`);
      return;
    }

    const update = () => this.geometry.updatePolygonPoints();
    gsap.to(this.geometry.corners[corner], {
      x,
      y,
      duration,
      ease,
      onUpdate: update,
      overwrite: "auto",
    });
  }

  setCornerImmediate(corner, x, y) {
    if (!this.geometry.corners[corner]) {
      console.warn(`Gel: Invalid corner name "${corner}"`);
      return;
    }
    Object.assign(this.geometry.corners[corner], { x, y });
    this.geometry.updatePolygonPoints();
  }

  resetCorners() {
    this.geometry.resetCorners();
  }

  /**
   * Refresh viewBox and polygon after element positioning changes.
   */
  refresh() {
    this.geometry.refresh();
    this.mask.updateMaskDimensions();
  }

  /**
   * Dedicated scale setter (preferred over setState).
   */
  setScale({ x = 1, y = 1, origin = "left center" } = {}) {
    this.visual.setScale({ x, y, origin });
  }

  /**
   * Scroll-scale convenience wrapper for callers.
   */
  setScrollScale({ xScale = 1, yScale = 1 } = {}) {
    this.setScale({ x: xScale, y: yScale });
  }

  /**
   * Change visual state via color classes or named states.
   * For scroll scaling, use setScrollScale().
   */
  setState(stateName, stateConfig = {}) {
    if (!stateName) return;

    if (stateName === "scroll-scale") {
      this.setScrollScale(stateConfig);
      return;
    }

    if (this.colorClasses.includes(stateName)) {
      this.setColorState(stateName);
      return;
    }

    this.currentState = stateName;
  }

  setColorState(colorState) {
    this.visual.setColorState(colorState);
    this.currentState = colorState;
  }

  setTarget(element) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn("Gel: Invalid target element provided");
      return;
    }
    this.targetElement = element;
  }

  matchTarget(duration = 0, ease = "power2.out") {
    if (!this.targetElement) {
      console.warn("Gel: No target element set. Use setTarget() first.");
      return;
    }

    const targetRect = this.targetElement.getBoundingClientRect();
    const props = {
      position: "fixed",
      left: `${targetRect.left}px`,
      top: `${targetRect.top}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`,
    };

    if (duration > 0) {
      gsap.to(this.view, {
        ...props,
        duration,
        ease,
        onComplete: () => this.refresh(),
      });
    } else {
      Object.assign(this.view.style, props);
      this.refresh();
    }
  }

  /**
   * Attach a ResizeObserver to keep polygon sizing in sync with the element.
   */
  enableAutoRefresh() {
    if (this._resizeObserver || typeof ResizeObserver === "undefined") return;
    this._resizeObserver = new ResizeObserver(() => this.refresh());
    this._resizeObserver.observe(this.view);
  }

  destroy() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    this.mask.destroy();
  }
}
