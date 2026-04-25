/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.hero.heroanimations
 *   role: Frontend runtime module: js/choreography/sections/hero/HeroAnimations.js
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
import { HERO_ANIMATION_DEFAULTS } from "../../config/ix/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";
import { SplitText } from "/assets/js/choreography/vendor/gsap.js";
const HERO_EL_ATTR = "data-hero-el";

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

export default class HeroAnimations extends AbstractSectionAnimations {
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
      duration: options.duration ?? HERO_ANIMATION_DEFAULTS.duration,
      translateY: options.translateY ?? HERO_ANIMATION_DEFAULTS.translateY,
      stagger: options.stagger ?? HERO_ANIMATION_DEFAULTS.stagger,
      ease: {
        in: options.ease?.in ?? HERO_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? HERO_ANIMATION_DEFAULTS.ease.out,
      },
    };

    // TITLE TEXT
    // Using hook-based cached refs for key elements to simplify timeline definitions
    this.elements = {
      tagline: selectHeroEl(this.view, "tagline") ?? this.view,
    };

    this._split = null;
    this._buildTimeline();
  }

  _buildLanding() {
    // Set initial state
    this._resetSplit();
    this._split = new SplitText(this.elements.tagline, {
      type: "words",
      wordsClass: "block w-full",
    });

    var tl = gsap.timeline({ id: TIMELINE_IDS.landing });
    tl.set(this.view, {
      width: "100%",
      backgroundColor: "transparent",
      clipPath: "none",
      webkitClipPath: "none",
      autoAlpha: 1,
    })
      .fromTo(
        this._split.words,
        { autoAlpha: 0, yPercent: 1 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: this.options.duration,
          ease: this.options.ease.out,
          stagger: this.options.stagger,
        },
      )
      .addPause();
    return tl;
  }

  _buildIntro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    tl.to(this.view, {
      autoAlpha: 1,
      duration: this.options.duration,
      ease: this.options.ease.out,
    });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro });
    tl.to(this.view, {
      autoAlpha: 0,
      duration: this.options.duration,
      ease: this.options.ease.in,
    });
    return tl;
  }

  _resetSplit() {
    if (this._split?.revert) {
      this._split.revert();
    }
    this._split = null;
  }
}
