/**
 * ---
 * aix:
 *   id: frontend.js.choreography.managers.gelanimationmanager
 *   role: Frontend runtime module: js/choreography/managers/GelAnimationManager.js
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
 * GelAnimationManager - Gel instance registry and lifecycle manager
 *
 * Maintains `Gel` controller instances for `.bg-gel` elements.
 * This manager intentionally avoids scroll-trigger wiring, tween orchestration,
 * and section-element synchronization to keep responsibilities minimal.
 *
 * @fileoverview Gel manager for initialization and teardown only
 */

import { Gel } from "/assets/js/effects/gel/index.js";
import { GEL_CONFIG } from "/assets/js/choreography/config.js";

export default class GelAnimationManager {
  /**
   * @param {Object} gelConfig - Map of gel IDs to config objects
   * @param {ReducedMotionHandler} reducedMotionHandler - Reduced motion coordinator
   */
  constructor(gelConfig = GEL_CONFIG, reducedMotionHandler = null) {
    this._config = gelConfig;
    this._reducedMotionHandler = reducedMotionHandler;
    this._gels = [];
    this._gelsById = new Map();
    this._activeArrangementId = null;

    if (reducedMotionHandler) {
      this._unsubscribe = reducedMotionHandler.onChange((enabled) => {
        if (enabled) {
          this.destroy();
        }
      });
    }
  }

  /**
   * Initialize gel controllers from DOM elements with bg-gel class
   */
  initialize() {
    this._gelsById.clear();

    const gelElements = document.querySelectorAll(".bg-gel");
    this._gels = Array.from(gelElements)
      .map((el) => this._initializeGelFromElement(el))
      .filter((gel) => gel !== null);

    if (this._gels[2]) {
      this._gels[2].setCorner("topLeft", 50, 0, 0, "none");
      this._gels[2].setCorner("topRight", 50, 0, 0, "none");
    }
  }

  /**
   * Initialize single gel instance from a DOM element
   * @private
   * @param {HTMLElement} el - Gel DOM element
   * @returns {Gel|null}
   */
  _initializeGelFromElement(el) {
    const gelId = el.id;
    if (!gelId) {
      console.warn("[GelAnimationManager] Missing id for gel element", gelId);
      return null;
    }

    const configEntry = this._config[gelId] || {};
    const { masked, transformOrigin } = configEntry;
    const gel = new Gel(el, { masked, transformOrigin });
    gel.refresh();
    this._gelsById.set(gelId, gel);

    return gel;
  }

  /**
   * Apply arrangement immediately with viewport-relative geometry.
   * @param {{ id?: string, gels?: Record<string, {x:number, y:number, width:number, height:number, origin?:string}> }} arrangement
   */
  applyArrangement(arrangement) {
    if (!arrangement || !arrangement.gels) return;

    Object.entries(arrangement.gels).forEach(([gelId, rect]) => {
      const gel = this._gelsById.get(gelId);
      if (!gel) {
        console.warn(
          `[GelAnimationManager] Unknown gel id in arrangement: ${gelId}`,
        );
        return;
      }

      const { x, y, width, height, origin } = rect;
      if (
        !this._isNormalizedNumber(x) ||
        !this._isNormalizedNumber(y) ||
        !this._isNormalizedNumber(width) ||
        !this._isNormalizedNumber(height)
      ) {
        console.warn(
          `[GelAnimationManager] Invalid arrangement rect for ${gelId}`,
          rect,
        );
        return;
      }

      const { style } = gel.view;
      style.pointerEvents = "none";
      style.left = `${x * 100}%`;
      style.top = `${y * 100}%`;
      style.width = `${width * 100}%`;
      style.height = `${height * 100}%`;
      style.transformOrigin = origin || "center center";

      try {
        gel.refresh();
      } catch (error) {
        console.warn(
          `[GelAnimationManager] Failed to refresh gel after arrangement: ${gelId}`,
          error,
        );
      }
    });

    this._activeArrangementId = arrangement.id || null;
  }

  getActiveArrangementId() {
    return this._activeArrangementId;
  }

  /** @private */
  _isNormalizedNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1
    );
  }

  /** @returns {Gel[]} */
  getGels() {
    return this._gels;
  }

  /** Cleanup animations and references */
  destroy() {
    this._gels.forEach((gel) => {
      if (gel && typeof gel.destroy === "function") {
        gel.destroy();
      }
    });
    this._gels = [];
    this._gelsById.clear();
    this._activeArrangementId = null;
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}
