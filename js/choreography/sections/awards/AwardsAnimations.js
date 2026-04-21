/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.awards.awardsanimations
 *   role: Frontend runtime module: js/choreography/sections/awards/AwardsAnimations.js
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

import AbstractSectionAnimations from "../abstract-section/AbstractSectionAnimations.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";
import { AWARDS_ANIMATION_DEFAULTS } from "../../config/ix/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";

const AWARDS_EL_ATTR = "data-awards-el";

const selectAwardsEl = (view, name) =>
  view?.querySelector(`[${AWARDS_EL_ATTR}="${name}"]`) ?? null;

export default class AwardsAnimations extends AbstractSectionAnimations {
  /**
   * Extends AbstractSectionAnimations, which:
   * - Stores the section root element and ID
   * - Sets up shared GSAP timeline primitives and intro/outro hooks
   * - Provides common utilities (pause/resume/reset) used by sections
   */
  /**
   * @param {HTMLElement} view
   * @param {Object} options
   */
  constructor(view, options = {}) {
    super(view);
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#007bff",
      enabled: true,
    });

    this.options = {
      duration: options.duration ?? AWARDS_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? AWARDS_ANIMATION_DEFAULTS.stagger,
      translateY: options.translateY ?? AWARDS_ANIMATION_DEFAULTS.translateY,
      itemTranslateY:
        options.itemTranslateY ?? AWARDS_ANIMATION_DEFAULTS.itemTranslateY,
      itemRevealViewportRatio:
        options.itemRevealViewportRatio ??
        AWARDS_ANIMATION_DEFAULTS.itemRevealViewportRatio,
      ease: {
        in: options.ease?.in ?? AWARDS_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? AWARDS_ANIMATION_DEFAULTS.ease.out,
      },
    };

    this.view = view;

    // Using hook-based cached refs for key elements to simplify timeline definitions
    this.elements = {
      header: selectAwardsEl(this.view, "header") ?? this.view,
      context: selectAwardsEl(this.view, "context"),
      heading: selectAwardsEl(this.view, "heading") ?? this.view,
      body: selectAwardsEl(this.view, "body") ?? this.view,
      list: selectAwardsEl(this.view, "list"),
    };

    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.body,
      this.elements.list,
    ].filter(Boolean);

    this.awardItems = Array.from(
      this.view?.querySelectorAll(`[${AWARDS_EL_ATTR}="award"]`) ?? [],
    );
    this.revealedItems = new WeakSet();

    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0.5,
        y: this.options.translateY,
      });
    }

    if (this.awardItems.length) {
      gsap.set(this.awardItems, {
        autoAlpha: 0,
        y: this.options.itemTranslateY,
      });
    }

    // this.originalText = this.view?.textContent || "";
    this._buildTimeline();
  }

  intro() {
    this.logger.trace("Intro started");
    if (!this.view) return;
    return this.play(TIMELINE_IDS.intro);
  }

  outro() {
    this.logger.trace("Outro started");
    if (!this.view) return;
    return this.play(TIMELINE_IDS.outro);
  }

  _getLogos() {
    if (!this.elements.list) return [];
    return [this.elements.list];
  }

  showAllAwards() {
    if (!this.awardItems.length) return;

    this.awardItems.forEach((item) => {
      this.revealedItems.add(item);
    });

    gsap.set(this.awardItems, {
      autoAlpha: 1,
      y: 0,
    });
  }

  updateAwardsReveal() {
    if (!this.awardItems.length) return;

    const viewportHeight =
      window.innerHeight || document.documentElement?.clientHeight || 0;
    if (!viewportHeight) return;

    const clampedRatio = Math.min(
      0.95,
      Math.max(0.05, this.options.itemRevealViewportRatio),
    );
    const revealThreshold = viewportHeight * clampedRatio;

    this.awardItems.forEach((item) => {
      if (this.revealedItems.has(item)) return;

      const itemTop = item.getBoundingClientRect().top;
      if (itemTop > revealThreshold) return;

      this.revealedItems.add(item);

      gsap.to(item, {
        autoAlpha: 1,
        y: 0,
        duration: this.options.duration,
        ease: this.options.ease.in,
      });
    });
  }

  _buildIntro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    if (!this.animTargets.length) {
      return tl;
    }

    tl.to(this.animTargets, {
      autoAlpha: 1,
      y: 0,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.in,
    }).addPause();
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.idle });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro });
    if (!this.animTargets.length) {
      return tl;
    }

    tl.to(this.animTargets, {
      autoAlpha: 0,
      y: this.options.translateY,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.out,
    }).addPause();
    return tl;
  }
}
