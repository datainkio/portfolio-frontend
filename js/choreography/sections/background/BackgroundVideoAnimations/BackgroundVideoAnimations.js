/** @format */

import AbstractSectionAnimations from "../../abstract-section/AbstractSectionAnimations/AbstractSectionAnimations.js";
import { BACKGROUND_ANIMATION_DEFAULTS } from "../../../config/ix/motion/motion.js";
import { TIMELINE_IDS } from "../../../config/contracts/timelines/timelines.js";
import { gsap } from "/assets/js/choreography/vendor/gsap/gsap.js";

export default class BackgroundVideoAnimations extends AbstractSectionAnimations {
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
      duration: options.duration ?? BACKGROUND_ANIMATION_DEFAULTS.duration,
      stagger: options.stagger ?? BACKGROUND_ANIMATION_DEFAULTS.stagger,
      translateY:
        options.translateY ?? BACKGROUND_ANIMATION_DEFAULTS.translateY,
      ease: {
        in: options.ease?.in ?? BACKGROUND_ANIMATION_DEFAULTS.ease.in,
        out: options.ease?.out ?? BACKGROUND_ANIMATION_DEFAULTS.ease.out,
      },
    };

    this.animTargets = [this.view].filter(Boolean);

    this._buildTimeline();
  }

  _buildIntro() {
    const targetClip = "inset(0% 0% 0% 0%)"; // full element width/height
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    tl.fromTo(
      this.animTargets,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: this.options.duration },
    ).to(this.animTargets, {
      clipPath: targetClip,
      duration: this.options.duration,
    });
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
