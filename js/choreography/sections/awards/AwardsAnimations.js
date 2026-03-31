/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.awards.awardsanimations
 *   role: Frontend runtime module: js/choreography/sections/awards/AwardsAnimations.js
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

export default class AwardsAnimations extends AbstractSectionAnimations {
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
      duration: options.duration ?? toSeconds(motion.duration("slower")),
      stagger: options.stagger ?? motion.stagger("base"),
      translateY: options.translateY ?? -motion.distance("lg"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
    };

    this.title = this.view?.querySelector("h2") || this.view;
    this.subtitle = this.view?.querySelector("p") || null;
    this.logos = this._getLogos();

    this._children = Array.from(this.view?.children ?? null);

    if (this._children.length) {
      gsap.set([this.title, this.subtitle, ...this.logos], {
        autoAlpha: 0,
        y: Math.abs(this.options.translateY),
      });
      this._buildIntroTimeline();
    }

    this._buildIntroTimeline();
  }

  intro() {
    this._buildIntroTimeline();
    return this.playFromLabel(this.labels.intro, 0);
  }

  outro() {
    this._buildOutroTimeline();
    return this.playFromLabel(this.labels.outro, 0);
  }

  _getLogos() {
    if (!this.view) return [];

    const listItems = Array.from(
      this.view.querySelectorAll(".awards-list__item"),
    );
    if (listItems.length) return listItems;

    const emptyState = this.view.querySelector(".awards-list__empty");
    return emptyState ? [emptyState] : [];
  }

  _buildIntroTimeline() {
    if (!this.view || !this.logos.length) return;

    const { duration, stagger, translateY, ease } = this.options;

    this.timeline.clear();
    this.addLifecycleLabel("intro", 0);

    // this.timeline.set(this.view, { autoAlpha: 1 });
    this.timeline.set([this.title, this.subtitle, ...this.logos], {
      autoAlpha: 0,
      y: translateY,
    });
    this.timeline.to([this.title, this.subtitle, ...this.logos], {
      autoAlpha: 1,
      y: 0,
      duration,
      ease: ease.out,
      stagger,
    });
  }

  _buildOutroTimeline() {
    if (!this.view || !this.logos.length) return;

    const { duration, stagger, translateY, ease } = this.options;

    this.timeline.clear();
    this.addLifecycleLabel("outro", 0);
    this.timeline.set(this.view, { autoAlpha: 1 });
    this.timeline.set(this.logos, { autoAlpha: 1, y: 0 });
    this.timeline.to(this.logos, {
      autoAlpha: 0,
      y: translateY * 0.5,
      duration: duration * 0.8,
      ease: ease.in,
      stagger: Math.min(stagger, 0.1),
    });
  }
}
