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
      stagger: options.stagger ?? motion.stagger("loose"),
      translateY: options.translateY ?? -motion.distance("lg"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
      ...options,
    };

    this.view = view;
    this.heading = this.view?.querySelector("h2") || this.view;
    this.body = this.view?.querySelector("p") || this.view;
    gsap.set([this.heading, this.body], {
      autoAlpha: 0,
      y: this.options.translateY,
    });
    // this.originalText = this.view?.textContent || "";
    // this._buildIntroTimeline();
  }

  _buildIntroTimeline() {
    this.timeline.clear();
    this.addLifecycleLabel("intro", 0);

    this.timeline.fromTo(
      [this.heading, this.body],
      {
        autoAlpha: 0,
        y: this.options.translateY,
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

  _buildOutroTimeline() {
    this.timeline.clear();
    this.addLifecycleLabel("outro", 0);
    this.timeline.to([this.heading, this.body], {
      autoAlpha: 0,
      y: this.options.translateY,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.out,
    });
  }

  intro() {
    this._buildIntroTimeline();
    return this.playFromLabel(this.labels.intro, 0);
  }

  outro() {
    this._buildOutroTimeline();
    return this.playFromLabel(this.labels.outro, 0);
  }
}
