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
import { gsap } from "./gsap.js";
import { GEL_ARRANGEMENT_TRANSITION } from "../config/index/index.js";

export default class GelAnimationManager {
  /** @param {ReducedMotionHandler} reducedMotionHandler */
  constructor(reducedMotionHandler = null) {
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

  initialize() {
    this._gelsById.clear();
    const gelElements = document.querySelectorAll(".bg-gel");
    this._gels = Array.from(gelElements)
      .map((el) => this._initializeGelFromElement(el))
      .filter((gel) => gel !== null);
  }

  _initializeGelFromElement(el) {
    const gelId = el.id;
    if (!gelId) {
      console.warn("[GelAnimationManager] Missing id for gel element", gelId);
      return null;
    }
    const gel = new Gel(el);
    gel.refresh();
    this._gelsById.set(gelId, gel);
    return gel;
  }

  /**
   * Apply arrangement with viewport-relative geometry.
   * @param {{ id?: string, gels?: Record<string, object> }} arrangement
   * @param {{ immediate?: boolean, duration?: number, ease?: string, refreshOnUpdate?: boolean }} [options]
   */
  applyArrangement(arrangement, options = {}) {
    if (!arrangement || !arrangement.gels) return;

    const isReducedMotion =
      this._reducedMotionHandler?.isReducedMotion?.() === true;
    const transition = this._resolveArrangementTransition(options);
    const immediate =
      options.immediate === true ||
      isReducedMotion ||
      !this._activeArrangementId ||
      transition.duration === 0;

    Object.entries(arrangement.gels).forEach(([gelId, rect]) => {
      const gel = this._gelsById.get(gelId);
      if (!gel) {
        console.warn(`[GelAnimationManager] Unknown gel id in arrangement: ${gelId}`);
        return;
      }

      const { x, y, width, height, origin, blendMode } = rect;
      if (
        !this._isNormalizedNumber(x) ||
        !this._isNormalizedNumber(y) ||
        !this._isNormalizedNumber(width) ||
        !this._isNormalizedNumber(height)
      ) {
        console.warn(`[GelAnimationManager] Invalid arrangement rect for ${gelId}`, rect);
        return;
      }

      const { style } = gel.view;
      style.pointerEvents = "none";
      style.transformOrigin = origin || "center center";
      style.mixBlendMode = typeof blendMode === "string" && blendMode ? blendMode : "";

      const nextGeometry = {
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
      };

      const refreshSafely = () => {
        try {
          gel.refresh();
        } catch (error) {
          console.warn(`[GelAnimationManager] Failed to refresh gel after arrangement: ${gelId}`, error);
        }
      };

      gsap.killTweensOf(gel.view);

      if (immediate) {
        Object.assign(style, nextGeometry);
        refreshSafely();
        return;
      }

      gsap.to(gel.view, {
        ...nextGeometry,
        duration: transition.duration,
        ease: transition.ease,
        overwrite: "auto",
        onUpdate: transition.refreshOnUpdate ? refreshSafely : null,
        onComplete: transition.refreshOnUpdate ? null : refreshSafely,
      });
    });

    this._activeArrangementId = arrangement.id || null;
  }

  _resolveArrangementTransition(options = {}) {
    const duration =
      typeof options.duration === "number" && Number.isFinite(options.duration)
        ? Math.max(0, options.duration)
        : GEL_ARRANGEMENT_TRANSITION.duration;
    const ease =
      typeof options.ease === "string" && options.ease
        ? options.ease
        : GEL_ARRANGEMENT_TRANSITION.ease;
    const refreshOnUpdate =
      typeof options.refreshOnUpdate === "boolean"
        ? options.refreshOnUpdate
        : GEL_ARRANGEMENT_TRANSITION.refreshOnUpdate;
    return { duration, ease, refreshOnUpdate };
  }

  getActiveArrangementId() {
    return this._activeArrangementId;
  }

  _isNormalizedNumber(value) {
    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 1
    );
  }

  getGel(gelId) {
    if (typeof gelId !== "string" || gelId.length === 0) return null;
    return this._gelsById.get(gelId) ?? null;
  }

  getTween(gelId) {
    const gel = this.getGel(gelId);
    if (!gel?.view) return null;
    const tweens = gsap.getTweensOf(gel.view);
    if (!Array.isArray(tweens) || tweens.length === 0) return null;
    return tweens.find((tween) => tween.isActive()) ?? tweens.at(-1) ?? null;
  }

  getGels() {
    return this._gels;
  }

  destroy() {
    this._gels.forEach((gel) => {
      if (gel?.view) gsap.killTweensOf(gel.view);
      if (gel && typeof gel.destroy === "function") gel.destroy();
    });
    this._gels = [];
    this._gelsById.clear();
    this._activeArrangementId = null;
    if (this._unsubscribe) this._unsubscribe();
  }
}
