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
    this.view = view;
    this.title = this.view?.querySelector("h1") || this.view;
    // this.originalText = this.view?.textContent || "";

    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#007bff",
      enabled: true,
    });

    this.Y_OFFSET = this.options.translateY;
    this.STAGGER = this.options.stagger;
    this._split = null;
    this._buildIntroTimeline();
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

    this._resetSplit();
    this.timeline.clear();
    this.timeline.set(this.view, { autoAlpha: 1 });
    this.timeline.set(this.title, { autoAlpha: 1, yPercent: 0, y: 0 });

    this._split = new SplitText(this.title, { type: "words" });

    this.timeline.fromTo(
      this._split.words,
      { autoAlpha: 0, yPercent: this.Y_OFFSET },
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

    this._resetSplit();
    this.timeline.clear();
    this.timeline.set(this.view, { autoAlpha: 1 });
    this.timeline.set(this.title, { autoAlpha: 1, yPercent: 0, y: 0 });

    this._split = new SplitText(this.title, { type: "words" });

    this.timeline.fromTo(
      this._split.words.reverse(),
      { autoAlpha: 1, yPercent: 0 },
      {
        autoAlpha: 0,
        yPercent: this.Y_OFFSET,
        duration: this.options.duration,
        ease: this.options.ease.in,
        stagger: this.options.stagger,
      },
    );
  }
}
