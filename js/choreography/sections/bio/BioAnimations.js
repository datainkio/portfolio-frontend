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
const BIO_EL_ATTR = "data-bio-el";

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
    this.options = {
      duration: options.duration ?? toSeconds(motion.duration("base")),
      stagger: options.stagger ?? motion.stagger("loose"),
      translateY: options.translateY ?? -motion.distance("lg"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
    };

    this.view = view;
    // Using hook-based cached refs for key elements to simplify timeline definitions
    this.elements = {
      header: selectBioEl(this.view, "header") ?? this.view,
      context: selectBioEl(this.view, "context"),
      heading: selectBioEl(this.view, "heading") ?? this.view,
      subheading: selectBioEl(this.view, "subheading"),
      body: selectBioEl(this.view, "body") ?? this.view,
    };

    this.introTargets = [
      this.elements.context,
      this.elements.heading,
      this.elements.subheading,
      this.elements.body,
    ].filter(Boolean);

    if (this.introTargets.length) {
      gsap.set(this.introTargets, {
        autoAlpha: 0.5,
        y: this.options.translateY,
      });
    }
    // this.originalText = this.view?.textContent || "";
    this._buildTimeline();
  }

  _buildTimeline() {
    super._buildTimeline();
    if (!this.view || !this.options || !this.introTargets) return this.timeline;

    this.timeline.add(this._buildIntro(), this.LABELS.enter);
    this.timeline.add(this._buildIdle(), this.LABELS.idle);
    this.timeline.add(this._buildOutro(), this.LABELS.leave);

    return this.timeline;
  }

  _buildIntro() {
    var tl = gsap.timeline({ id: "intro" });
    if (!this.introTargets.length) {
      return tl;
    }

    tl.to(this.introTargets, {
      autoAlpha: 1,
      y: 0,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.in,
    });
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: "idle" });
    return tl;
  }
  _buildOutro() {
    var tl = gsap.timeline({ id: "outro" });

    if (!this.introTargets.length) {
      return tl;
    }

    tl.to(this.introTargets, {
      autoAlpha: 0,
      y: this.options.translateY,
      duration: this.options.duration,
      stagger: this.options.stagger,
      ease: this.options.ease.out,
    });

    return tl;
  }

  intro() {
    if (!this.view) return;
    console.log("Playing bio intro animation");
    return this.play(this.LABELS.intro);
  }

  outro() {
    if (!this.view) return;
    return this.play(this.LABELS.outro);
  }
}
