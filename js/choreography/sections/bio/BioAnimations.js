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
import { motion } from "../../config/motion.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";

const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);

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
    this.options = {
      duration: options.duration ?? toSeconds(motion.duration("base")),
      stagger: options.stagger ?? motion.stagger("base"),
      translateY: options.translateY ?? -motion.distance("md"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
      ...options,
    };

    this._children = Array.from(this.view?.children ?? null);

    if (this._children.length) {
      gsap.set(this._children, {
        autoAlpha: 0,
        y: Math.abs(this.options.translateY),
      });
      this._configureIntroTimeline();
    }
  }

  _configureIntroTimeline() {
    if (!this._children) {
      this.timeline.clear();
      return;
    }

    this.timeline.clear();
    this.timeline.fromTo(
      this._children,
      {
        autoAlpha: 0,
        y: Math.abs(this.options.translateY),
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: this.options.duration,
        stagger: this.options.stagger,
        ease: this.options.ease.in,
      },
    );
  }

  intro() {
    if (!this._children) {
      return this.timeline;
    }

    this._configureIntroTimeline();
    return this.timeline.play(0);
  }

  outro() {
    if (!this._children) {
      return this.timeline;
    }

    this.timeline.time(this.timeline.duration());
    return this.timeline.reverse();
  }
}
