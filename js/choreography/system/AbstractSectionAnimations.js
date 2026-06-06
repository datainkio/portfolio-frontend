/** @format */

/**
 * AbstractSectionAnimations - Shared foundation for section animation modules
 *
 * Provides shared helpers for section-scoped timeline playback.
 * Subclasses override _buildLanding, _buildIntro, _buildIdle, _buildOutro
 * to return GSAP timelines for each lifecycle phase.
 */
import { TIMELINE_IDS } from "../config/contracts/timelines/timelines.js";
import { gsap } from "./gsap.js";

const EMPTY_TIMELINES = () => ({
  [TIMELINE_IDS.landing]: null,
  [TIMELINE_IDS.intro]: null,
  [TIMELINE_IDS.idle]: null,
  [TIMELINE_IDS.outro]: null,
});

const TIMELINE_BUILDERS = [
  [TIMELINE_IDS.landing, "_buildLanding"],
  [TIMELINE_IDS.intro, "_buildIntro"],
  [TIMELINE_IDS.idle, "_buildIdle"],
  [TIMELINE_IDS.outro, "_buildOutro"],
];

export default class AbstractSectionAnimations {
  /** @param {HTMLElement|null} view */
  constructor(view) {
    this.view = view;
    this._timelines = EMPTY_TIMELINES();
  }

  play(timelineId) {
    const resolvedId = this._resolveTimelineId(timelineId);
    if (!resolvedId) return null;
    const activeTimeline = this._timelines[resolvedId] ?? null;
    if (!activeTimeline) return null;
    this._pauseInactiveTimelines(resolvedId);
    return activeTimeline.restart();
  }

  getTimeline(timelineId) {
    const resolvedId = this._resolveTimelineId(timelineId);
    if (!resolvedId) return null;
    return this._timelines[resolvedId] ?? null;
  }

  pauseAll(atTime = 0) {
    Object.values(this._timelines).forEach((timeline) => {
      timeline?.pause?.(atTime);
    });
  }

  kill() {
    Object.keys(this._timelines).forEach((timelineId) => {
      this._timelines[timelineId]?.kill?.();
      this._timelines[timelineId] = null;
    });
  }

  _buildTimeline() {
    this.kill();
    if (!this.view) return this._timelines;
    TIMELINE_BUILDERS.forEach(([id, builderName]) => {
      this._registerTimeline(id, this[builderName]?.());
    });
    return this._timelines;
  }

  _registerTimeline(timelineId, timeline) {
    if (!timelineId || !Object.hasOwn(this._timelines, timelineId)) return null;
    this._timelines[timelineId]?.kill?.();
    if (!timeline) {
      this._timelines[timelineId] = null;
      return null;
    }
    timeline.pause(0);
    this._timelines[timelineId] = timeline;
    return timeline;
  }

  _pauseInactiveTimelines(activeId) {
    Object.entries(this._timelines).forEach(([timelineId, timeline]) => {
      if (!timeline || timelineId === activeId) return;
      timeline.pause();
    });
  }

  /**
   * Instantly set all items to their revealed end state.
   * @deprecated Use molecules/scroll-reveal-group.js createScrollRevealGroup().showAll() instead.
   */
  _showAllItems(items, revealedItems) {
    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      !revealedItems ||
      typeof revealedItems.add !== "function"
    ) {
      return;
    }
    items.forEach((item) => revealedItems.add(item));
    gsap.set(items, { autoAlpha: 1, y: 0 });
  }

  /**
   * Reveal items as they scroll into the viewport threshold.
   * @deprecated Use molecules/scroll-reveal-group.js createScrollRevealGroup().update() instead.
   */
  _revealItemsOnScroll({ items, revealedItems, revealViewportRatio, buildTween } = {}) {
    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      !revealedItems ||
      typeof revealedItems.has !== "function" ||
      typeof revealedItems.add !== "function" ||
      typeof buildTween !== "function"
    ) {
      return;
    }

    const viewportHeight =
      window.innerHeight || document.documentElement?.clientHeight || 0;
    if (!viewportHeight) return;

    const ratio =
      typeof revealViewportRatio === "number" ? revealViewportRatio : 0.5;
    const clampedRatio = Math.min(0.95, Math.max(0.05, ratio));
    const revealThreshold = viewportHeight * clampedRatio;

    items.forEach((item, itemIndex) => {
      if (revealedItems.has(item)) return;
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop > revealThreshold) return;
      revealedItems.add(item);
      buildTween(item, itemIndex);
    });
  }

  _resolveTimelineId(candidate) {
    if (typeof candidate !== "string") return null;
    return Object.hasOwn(this._timelines, candidate) ? candidate : null;
  }
}
