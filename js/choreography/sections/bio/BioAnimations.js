/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.bio.bioanimations
 *   role: Frontend runtime module: js/choreography/sections/bio/BioAnimations.js
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
import { BIO_ANIMATION_DEFAULTS } from "../../config/ix/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

export default class BioAnimations extends AbstractSectionAnimations {
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
      duration: options.duration ?? BIO_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? BIO_ANIMATION_DEFAULTS.stagger,
      translateY: options.translateY ?? BIO_ANIMATION_DEFAULTS.translateY,
      itemTranslateY:
        options.itemTranslateY ?? BIO_ANIMATION_DEFAULTS.itemTranslateY,
      itemRevealViewportRatio:
        options.itemRevealViewportRatio ??
        BIO_ANIMATION_DEFAULTS.itemRevealViewportRatio,
      ease: {
        in: options.ease?.in ?? BIO_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? BIO_ANIMATION_DEFAULTS.ease.out,
      },
    };

    this.view = view;

    this.elements = {
      header: selectBioEl(this.view, "header") ?? this.view,
      context: selectBioEl(this.view, "context"),
      heading: selectBioEl(this.view, "heading") ?? this.view,
      subheading: selectBioEl(this.view, "subheading"),
      body: selectBioEl(this.view, "body"),
    };

    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.subheading,
      this.elements.body,
    ].filter(Boolean);

    this.subSectionItems = Array.from(
      this.view?.querySelectorAll(BIO_SELECTORS.subSectionSelector) ?? [],
    );
    this.revealedItems = new WeakSet();

    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0,
        y: this.options.translateY,
      });
    }

    if (this.subSectionItems.length) {
      gsap.set(this.subSectionItems, {
        autoAlpha: 0,
        y: this.options.itemTranslateY,
      });
    }

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

  showAllSubSections() {
    if (!this.subSectionItems.length) return;

    this.subSectionItems.forEach((item) => {
      this.revealedItems.add(item);
    });

    gsap.set(this.subSectionItems, {
      autoAlpha: 1,
      y: 0,
    });
  }

  updateSubSectionReveal() {
    if (!this.subSectionItems.length) return;

    const viewportHeight =
      window.innerHeight || document.documentElement?.clientHeight || 0;
    if (!viewportHeight) return;

    const clampedRatio = Math.min(
      0.95,
      Math.max(0.05, this.options.itemRevealViewportRatio),
    );
    const revealThreshold = viewportHeight * clampedRatio;

    this.subSectionItems.forEach((item) => {
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
