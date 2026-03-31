/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.abstract-section.abstractsectionanimations
 *   role: Frontend runtime module: js/choreography/sections/abstract-section/AbstractSectionAnimations.js
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

/**
 * BaseAnimations - Shared foundation for section animation modules
 *
 * Provides a minimal structure and helpers for building GSAP timelines
 * associated with a specific DOM element and section id.
 */
import { motion } from "../../config/motion.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";
const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);
const DURATION = toSeconds(motion.duration("base")); // Default duration for animations
const STAGGER = motion.stagger("base"); // Default stagger duration for animations
const EASE = motion.ease("standard"); // Default easing for animations
export default class AbstractSectionAnimations {
  /**
   * @param {HTMLElement|null} view - Target element for animations
   * @param {string} sectionId - Section identifier (e.g., 'main-header')
   */
  constructor(view) {
    this.view = view;
    this.timeline = gsap.timeline({ paused: true }); // init timeline instance
    this.DURATION = DURATION; // Default duration for animations
    this.STAGGER = STAGGER; // Default stagger duration for animations
    this.EASE = EASE; // Default easing for animations
    this.labels = {
      intro: "intro",
      outro: "outro",
    };
  }

  addLabel(name, position = 0) {
    this.timeline.addLabel(name, position);
  }

  playFromLabel(label, fallback = 0) {
    if (this.timeline.labels[label] != null) {
      return this.timeline.play(label);
    }
    return this.timeline.play(fallback);
  }

  /**
   * Set the default styles for the element
   * Descendants should override for custom behavior.
   */
  async setDefault(props = {}) {
    gsap.set(this.view, props);
  }

  /**
   * Intro animation sequence. Descendants should override for custom behavior.
   * @returns {Promise<void>} Resolves when intro animation completes.
   */
  intro() {
    if (!this.view) {
      return this.timeline;
    }

    this.timeline.clear();
    this.addLabel(this.labels.intro, 0);
    this.timeline.fromTo(
      this.view,
      { opacity: 0 },
      { opacity: 1, duration: this.DURATION, ease: this.EASE },
    );
    return this.playFromLabel(this.labels.intro);
  }

  /**
   * Outro animation sequence. Descendants should override for custom behavior.
   * @returns {Promise<void>} Resolves when outro animation completes.
   */
  outro() {
    if (!this.view) {
      return this.timeline;
    }

    if (this.timeline.labels[this.labels.outro] != null) {
      return this.playFromLabel(this.labels.outro);
    }

    this.timeline.time(this.timeline.duration());
    return this.timeline.reverse();
  }
}
