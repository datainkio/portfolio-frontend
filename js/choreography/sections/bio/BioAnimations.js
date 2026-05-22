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
import { gsap, ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";
import { BIO_ANIMATION_DEFAULTS, BIO_INTRO } from "../../config/ix/motion.js";
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
    this.options = {
      duration: options.duration ?? BIO_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? BIO_ANIMATION_DEFAULTS.stagger,
      ease: options.ease ?? BIO_ANIMATION_DEFAULTS.ease,
    };

    this._buildTimeline();
  }

  _buildIntro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    tl.to(this.view, BIO_INTRO, 0);
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.idle });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro });

    return tl;
  }
}
