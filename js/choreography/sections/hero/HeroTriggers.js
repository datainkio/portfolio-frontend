/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.hero.herotriggers
 *   role: Frontend runtime module: js/choreography/sections/hero/HeroTriggers.js
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

import AbstractSectionTriggers from "../abstract-section/AbstractSectionTriggers.js";
import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";
import { HERO_TRIGGER, TIMELINE_IDS } from "../../config/index.js";

const HERO_GEL_ID = "bg-gel-0";
const HERO_TAGLINE_SELECTOR = '[data-hero-el="tagline"]';

const getViewportHeight = () =>
  window.innerHeight || document.documentElement?.clientHeight || 1;

export default class HeroTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._releaseTrigger = null;
  }

  // Phase 1: pinned scrub drives hero outro timeline (100% -> 50%).
  _getTriggerDefaults() {
    const outroTimeline =
      this.section?.animations?.getTimeline?.(TIMELINE_IDS.outro) ?? null;

    return {
      ...HERO_TRIGGER,
      ...(outroTimeline ? { animation: outroTimeline } : {}),
    };
  }

  // Phase 2: after pin release, scrub gel upward offstage while preserving size.
  bind(callbacks = {}) {
    super.bind(callbacks);

    this._releaseTrigger?.kill();
    this._releaseTrigger = null;

    const gel =
      this.section?.animations?.gelManager?.getGel?.(HERO_GEL_ID) ?? null;

    if (!gel?.view || !this._trigger) {
      return;
    }

    const tagline =
      this.view?.querySelector(HERO_TAGLINE_SELECTOR) ?? this.view;

    const shouldApplyRelease = (self) => {
      const currentScroll =
        typeof self?.scroll === "function" ? self.scroll() : window.scrollY;
      return currentScroll >= self.start;
    };

    const getPhase1Distance = () => {
      const start = this._trigger?.start ?? 0;
      const end = this._trigger?.end ?? start;
      return Math.max(1, end - start);
    };

    const getPhase2Distance = () => {
      const fallbackDistance = getPhase1Distance();
      if (!tagline?.getBoundingClientRect) {
        return fallbackDistance;
      }

      const viewportHeight = getViewportHeight();
      const taglineBottom = tagline.getBoundingClientRect().bottom;
      if (!Number.isFinite(taglineBottom) || taglineBottom <= 0) {
        return fallbackDistance;
      }

      const headingTravelDistance = Math.max(
        1,
        Math.min(taglineBottom, viewportHeight),
      );

      return Number.isFinite(headingTravelDistance)
        ? headingTravelDistance
        : fallbackDistance;
    };

    const applyReleaseProgress = (progress) => {
      const clamped = Math.max(0, Math.min(1, progress));
      const nextTop = -50 * clamped;

      gel.view.style.top = `${nextTop}%`;
      gel.refresh?.();
    };

    this._releaseTrigger = ScrollTrigger.create({
      id: `${HERO_TRIGGER.id}:gel-release`,
      trigger: this.view,
      start: () => this._trigger?.end ?? 0,
      end: () => (this._trigger?.end ?? 0) + getPhase2Distance(),
      scrub: true,
      fastScrollEnd: false,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (!shouldApplyRelease(self)) return;
        applyReleaseProgress(self.progress);
      },
      onRefresh: (self) => {
        if (!shouldApplyRelease(self)) return;
        applyReleaseProgress(self.progress);
      },
    });
  }

  kill() {
    this._releaseTrigger?.kill();
    this._releaseTrigger = null;
    super.kill();
  }
}
