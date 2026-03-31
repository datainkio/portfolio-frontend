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
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { motion } from "../../config/motion.js";
import { SplitText } from "/assets/js/choreography/vendor/gsap.js";
import AbstractSectionAnimations from "../abstract-section/AbstractSectionAnimations.js";

const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);

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
      duration: options.duration ?? toSeconds(motion.duration("base")),
      translateY: options.translateY ?? -motion.distance("lg"),
      stagger: options.stagger ?? motion.stagger("loose"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
    };

    this.title = this.view?.querySelector("h1") || this.view;

    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#007bff",
      enabled: true,
    });

    this._split = null;
    // this._buildIntroTimeline();
    // this._buildOutroTimeline();
  }

  // Override AbstractSectionAnimations
  intro() {
    this._buildIntroTimeline();
    return this.timeline.play(0);
  }

  outro() {
    this._buildOutroTimeline();
    return this.timeline.play(0);
  }

  outroReverse() {
    this._buildIntroTimeline();
    return this.timeline.play(0);
  }

  _resetSplit() {
    if (this._split?.revert) {
      this._split.revert();
    }
    this._split = null;
  }

  _buildIntroTimeline() {
    if (!this.view || !this.title) return;

    // Set initial state
    this._resetSplit();
    this.timeline.clear();
    // this.timeline.set(this.view, { autoAlpha: 1 });
    this.timeline.set(this.title, { autoAlpha: 1, yPercent: 0, y: 0 });

    // Animate hero container width from left to right
    this.timeline.to(
      this.view,
      {
        width: "100%",
        duration: this.options.duration,
        ease: this.options.ease.in,
      },
      0,
    );

    // Animate words fading in and sliding down into place with a stagger
    this._split = new SplitText(this.title, {
      type: "words",
      wordsClass: "block w-full",
    });
    this.timeline.fromTo(
      this._split.words,
      { autoAlpha: 0, yPercent: this.options.translateY },
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: this.options.duration,
        ease: this.options.ease.out,
        stagger: this.options.stagger,
      },
    );
  }

  _buildOutroTimeline() {
    if (!this.view || !this.title) return;
    this.timeline.to(this.view, {
      height: 0,
    });
  }
}
