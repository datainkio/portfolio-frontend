/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.work.workanimations
 *   role: Frontend runtime module: js/choreography/sections/work/WorkAnimations.js
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
import { gsap } from "/assets/js/choreography/vendor/gsap.js";
import { WORK_ANIMATION_DEFAULTS } from "../../config/ix/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";

const WORK_EL_ATTR = "data-projects-el";

const selectWorkEl = (view, name) =>
  view?.querySelector(`[${WORK_EL_ATTR}="${name}"]`) ?? null;

export default class WorkAnimations extends AbstractSectionAnimations {
  /**
   * @param {HTMLElement} view
   * @param {Object} options
   */
  constructor(view, options = {}) {
    super(view);

    this.options = {
      duration: options.duration ?? WORK_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? WORK_ANIMATION_DEFAULTS.stagger,
      translateY: options.translateY ?? WORK_ANIMATION_DEFAULTS.translateY,
      itemTranslateY:
        options.itemTranslateY ?? WORK_ANIMATION_DEFAULTS.itemTranslateY,
      itemRevealViewportRatio:
        options.itemRevealViewportRatio ??
        WORK_ANIMATION_DEFAULTS.itemRevealViewportRatio,
      ease: {
        in: options.ease?.in ?? WORK_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? WORK_ANIMATION_DEFAULTS.ease.out,
      },
    };

    this.view = view;

    this.elements = {
      header: selectWorkEl(this.view, "header") ?? this.view,
      context: selectWorkEl(this.view, "context"),
      heading: selectWorkEl(this.view, "heading") ?? this.view,
      body: selectWorkEl(this.view, "body") ?? this.view,
      list: selectWorkEl(this.view, "list"),
    };

    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.body,
      this.elements.list,
    ].filter(Boolean);

    this.workItems = Array.from(
      this.view?.querySelectorAll(`[${WORK_EL_ATTR}="project"]`) ?? [],
    );
    this.revealedItems = new WeakSet();

    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0.5,
        y: this.options.translateY,
      });
    }

    if (this.workItems.length) {
      gsap.set(this.workItems, {
        autoAlpha: 0,
        y: this.options.itemTranslateY,
      });
    }

    this._buildTimeline();
  }

  showAllWorkItems() {
    if (!this.workItems.length) return;

    this.workItems.forEach((item) => {
      this.revealedItems.add(item);
    });

    gsap.set(this.workItems, {
      autoAlpha: 1,
      y: 0,
    });
  }

  updateWorkReveal() {
    if (!this.workItems.length) return;

    const viewportHeight =
      window.innerHeight || document.documentElement?.clientHeight || 0;
    if (!viewportHeight) return;

    const clampedRatio = Math.min(
      0.95,
      Math.max(0.05, this.options.itemRevealViewportRatio),
    );
    const revealThreshold = viewportHeight * clampedRatio;

    this.workItems.forEach((item) => {
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
