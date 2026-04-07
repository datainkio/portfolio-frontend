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
import { gsap } from "/assets/js/choreography/vendor/gsap.js";

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
    // Allow options to override defaults, but default to motion config values
    this.options = {
      duration: options.duration ?? toSeconds(motion.duration("base")),
      translateY: options.translateY ?? -motion.distance("lg"),
      stagger: options.stagger ?? motion.stagger("loose"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
    };

    // TITLE TEXT
    this.title = this.view?.querySelector("h1") || this.view;

    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#007bff",
      enabled: true,
    });

    this._split = null;
    this._buildTimeline();
  }

  _buildTimeline() {
    super._buildTimeline();
    if (!this.view || !this.title) return;

    this.timeline.add(this._buildLanding(), this.LABELS.landing);
    this.timeline.add(this._buildIntro(), this.LABELS.enter);
    this.timeline.add(this._buildOutro(), this.LABELS.leave);

    return this.timeline;
  }

  _buildLanding() {
    // Set initial state
    this._resetSplit();
    this._split = new SplitText(this.title, {
      type: "words",
      wordsClass: "block w-full",
    });

    var tl = gsap.timeline({ id: "landing" });
    tl.to(this.view, {
      width: "100%",
      duration: this.options.duration,
      ease: this.options.ease.in,
    }).fromTo(
      this._split.words,
      { autoAlpha: 0, yPercent: 1 },
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: this.options.duration,
        ease: this.options.ease.out,
        stagger: this.options.stagger,
      },
    );
    return tl;
  }

  _buildIntro() {
    const fullClip = "inset(0% 0% 0% 0%)";
    const collapsedClipFromLeft = "inset(0% 100% 0% 0%)";
    var tl = gsap.timeline({ id: "intro" }).fromTo(
      this.view,
      {
        clipPath: collapsedClipFromLeft,
        webkitClipPath: collapsedClipFromLeft,
        autoAlpha: 0,
      },
      {
        clipPath: fullClip,
        webkitClipPath: fullClip,
        autoAlpha: 1,
        duration: this.options.duration,
        ease: this.options.ease.in,
      },
    );
    return tl;
  }

  _buildOutro() {
    const halfHeightClipFromBottom = "inset(0% 0% 50% 0%)";
    var tl = gsap.timeline({ id: "outro" }).to(
      this.view,
      {
        clipPath: halfHeightClipFromBottom,
        webkitClipPath: halfHeightClipFromBottom,
        duration: this.options.duration,
        ease: this.options.ease.out,
      },
      this.LABELS.outro,
    );
    return tl;
  }

  landing() {
    if (!this.view || !this.title) return;
    return this.play(this.LABELS.landing);
  }

  // Override AbstractSectionAnimations
  intro() {
    if (!this.view || !this.title) return;
    return this.play(this.LABELS.intro);
  }

  outro() {
    if (!this.view || !this.title) return;
    return this.play(this.LABELS.outro);
  }

  _resetSplit() {
    if (this._split?.revert) {
      this._split.revert();
    }
    this._split = null;
  }
}
