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
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";

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
    // this.options = {
    //   duration: options.duration ?? toSeconds(motion.duration("base")),
    //   stagger: options.stagger ?? motion.stagger("loose"),
    //   translateY: options.translateY ?? -motion.distance("lg"),
    //   ease: {
    //     in: options.ease?.in ?? motion.ease("exit"),
    //     out: options.ease?.out ?? motion.ease("enter"),
    //   },
    // };

    this.animTargets = [
      selectBioEl(this.view, "context"),
      selectBioEl(this.view, "heading"),
      selectBioEl(this.view, "subheading"),
      selectBioEl(this.view, "body"),
    ].filter(Boolean);

    if (this.animTargets.length) {
      gsap.set(this.animTargets, {
        autoAlpha: 0,
        y: this.TRANSLATE_Y,
      });
    }

    this._buildTimeline(options);
  }

  _buildIntro() {
    // Build the timelines for intro, idle, and outro states
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    tl.to(this.animTargets, {
      autoAlpha: 1,
      y: 0,
      duration: this.DURATION,
      stagger: this.STAGGER,
      ease: this.EASE.in,
    });
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.idle });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro });
    tl.to(this.animTargets, {
      autoAlpha: 0,
      y: this.TRANSLATE_Y,
      duration: this.DURATION,
      stagger: this.STAGGER,
      ease: this.EASE.out,
    });
    return tl;
  }
}
