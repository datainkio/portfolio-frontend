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
import { motion } from "../../config/motion.js";

const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);
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
      duration: options.duration ?? toSeconds(motion.duration("slower")),
      stagger: options.stagger ?? motion.stagger("base"),
      translateY: options.translateY ?? -motion.distance("lg"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
    };

    this.view = view;
    // Using hook-based cached refs for key elements to simplify timeline definitions
    this.elements = {
      header: selectAwardsEl(this.view, "header") ?? this.view,
      context: selectAwardsEl(this.view, "context"),
      heading: selectAwardsEl(this.view, "heading") ?? this.view,
      body: selectAwardsEl(this.view, "body") ?? this.view,
      awards: selectAwardsEl(this.view, "list"),
    };

    this.animTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.subheading,
      this.elements.body,
      this.elements.awards,
    ].filter(Boolean);

    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0.5,
        y: this.options.translateY,
      });
    }
    // this.originalText = this.view?.textContent || "";
    this._buildTimeline();
  }

  intro() {
    this.logger.trace("Intro started");
    if (!this.view) return;
    return this.play(this.LABELS.intro);
  }

  outro() {
    this.logger.trace("Outro started");
    if (!this.view) return;
    return this.play(this.LABELS.outro);
  }

  _getLogos() {
    if (!this.elements.awards) return [];
    return this.elements.awards ? [this.elements.awards] : [];
  }

  _buildTimeline() {
    super._buildTimeline();
    if (!this.view || !this.options) return this.timeline;

    this.timeline.add(this._buildIntro(), this.LABELS.enter);
    this.timeline.add(this._buildIdle(), this.LABELS.idle);
    this.timeline.add(this._buildOutro(), this.LABELS.leave);

    return this.timeline;
  }

  _buildIntro() {
    var tl = gsap.timeline({ id: this.LABELS.intro });
    if (!this.animTargets.length) {
      return tl;
    }

    tl.to(this.animTargets, {
      autoAlpha: 1,
      y: 0,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.in,
    });
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: this.LABELS.idle });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: this.LABELS.outro });
    if (!this.animTargets.length) {
      return tl;
    }

    tl.to(this.animTargets, {
      autoAlpha: 0,
      y: this.options.translateY,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.out,
    });
    return tl;
  }
}
