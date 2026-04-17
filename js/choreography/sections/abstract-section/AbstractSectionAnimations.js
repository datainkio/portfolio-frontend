/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.abstract-section.abstractsectionanimations
 *   role: Frontend runtime module: js/choreography/sections/abstract-section/AbstractSectionAnimations.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
/** @format */

/**
 * BaseAnimations - Shared foundation for section animation modules
 *
 * Provides a minimal structure and helpers for building GSAP timelines
 * associated with a specific DOM element and section id.
 */
import { motion } from "../../config/ix/motion.js";
import { LABELS } from "../../config/contracts/labels.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";
const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);
const DURATION = toSeconds(motion.duration("base")); // Default duration for animations
const STAGGER = motion.stagger("base"); // Default stagger duration for animations
const EASE = motion.ease("standard"); // Default easing for animations
const TIMELINE_LABEL_MAP = Object.freeze({
  [LABELS.landing]: TIMELINE_IDS.landing,
  [LABELS.intro]: TIMELINE_IDS.intro,
  [LABELS.enter]: TIMELINE_IDS.intro,
  [LABELS.enterBack]: TIMELINE_IDS.intro,
  [LABELS.idle]: TIMELINE_IDS.idle,
  [LABELS.leave]: TIMELINE_IDS.outro,
  [LABELS.leaveBack]: TIMELINE_IDS.outro,
  outro: TIMELINE_IDS.outro,
});

const EMPTY_TIMELINES = () => ({
  [TIMELINE_IDS.landing]: null,
  [TIMELINE_IDS.intro]: null,
  [TIMELINE_IDS.idle]: null,
  [TIMELINE_IDS.outro]: null,
});

export default class AbstractSectionAnimations {
  /**
   * @param {HTMLElement|null} view - Target element for animations
   * @param {string} sectionId - Section identifier (e.g., 'main-header')
   */
  constructor(view, options = {}) {
    this.view = view;
    this._timelines = EMPTY_TIMELINES();
    this.timeline = this._createTimelineRegistry();
    this.DURATION = DURATION; // Default duration for animations
    this.STAGGER = STAGGER; // Default stagger duration for animations
    this.EASE = EASE; // Default easing for animations
    this.LABELS = LABELS;
  }

  play(label, fallback = 0) {
    const timelineId = this._resolveTimelineId(label, fallback);
    const activeTimeline = this.getTimeline(timelineId);
    if (!activeTimeline) return null;

    this._pauseInactiveTimelines(timelineId);
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

  progressAll(value, suppressEvents = false) {
    Object.values(this._timelines).forEach((timeline) => {
      timeline?.progress?.(value, suppressEvents);
    });
  }

  kill() {
    Object.keys(this._timelines).forEach((timelineId) => {
      this._timelines[timelineId]?.kill?.();
      this._timelines[timelineId] = null;
    });
  }

  /**
   * Set the default styles for the element
   * Descendants should override for custom behavior.
   */
  async setDefault(props = {}) {
    gsap.set(this.view, props);
  }

  /**
   * Build and register section timelines by direct reference.
   * Descendants should implement _buildLanding/_buildIntro/_buildIdle/_buildOutro as needed.
   * @returns {Object} Timeline registry facade
   */
  _buildTimeline() {
    this.kill();
    if (!this.view) return this.timeline;

    this._registerTimeline(TIMELINE_IDS.landing, this._buildLanding?.());
    this._registerTimeline(TIMELINE_IDS.intro, this._buildIntro?.());
    this._registerTimeline(TIMELINE_IDS.idle, this._buildIdle?.());
    this._registerTimeline(TIMELINE_IDS.outro, this._buildOutro?.());

    return this.timeline;
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

  _resolveTimelineId(label, fallback) {
    const resolve = (candidate) => {
      if (typeof candidate !== "string") return null;
      if (Object.hasOwn(this._timelines, candidate)) return candidate;
      return TIMELINE_LABEL_MAP[candidate] ?? null;
    };

    return resolve(label) ?? resolve(fallback);
  }

  _createTimelineRegistry() {
    return {
      getById: (timelineId) => this.getTimeline(timelineId),
      pause: (atTime = 0) => {
        this.pauseAll(atTime);
        return this.timeline;
      },
      progress: (value, suppressEvents = false) => {
        this.progressAll(value, suppressEvents);
        return this.timeline;
      },
      kill: () => {
        this.kill();
      },
    };
  }
}
