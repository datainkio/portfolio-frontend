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
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";
import { SplitText } from "/assets/js/choreography/vendor/gsap.js";

const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);

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
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#007bff",
      enabled: true,
    });

    this.options = {
      duration: options.duration ?? toSeconds(motion.duration("base")),
      translateY: options.translateY ?? -motion.distance("lg"),
      stagger: options.stagger ?? motion.stagger("loose"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
    };

    this.view = view;

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
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro }).set(this.view, {
      clipPath: "none",
      webkitClipPath: "none",
      autoAlpha: 1,
    });
    return tl;
  }

  _buildOutro() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro }).set(this.view, {
      clipPath: "none",
      webkitClipPath: "none",
    });
    return tl;
  }

  landing() {
    console.log("Playing hero landing animation");
    if (!this.view || !this.elements.tagline) return;
    return this.play(this.LABELS.landing);
  }

  // Override AbstractSectionAnimations
  intro() {
    if (!this.view || !this.elements.tagline) return;
    return this.play(TIMELINE_IDS.intro);
  }

  outro() {
    if (!this.view || !this.elements.tagline) return;
    return this.play(TIMELINE_IDS.outro);
  }

  _resetSplit() {
    if (this._split?.revert) {
      this._split.revert();
    }
    this._split = null;
  }
}
