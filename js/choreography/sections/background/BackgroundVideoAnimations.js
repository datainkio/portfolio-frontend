/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.background.backgroundvideoanimations
 *   role: Frontend runtime module: js/choreography/sections/background/BackgroundVideoAnimations.js
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
import { motion } from "../../config/ix/motion.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";

const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);

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
      duration: options.duration ?? toSeconds(motion.duration("base")),
      stagger: options.stagger ?? motion.stagger("loose"),
      translateY: options.translateY ?? -motion.distance("lg"),
      ease: {
        in: options.ease?.in ?? motion.ease("exit"),
        out: options.ease?.out ?? motion.ease("enter"),
      },
    };

    this.animTargets = [this.view].filter(Boolean);

    this._buildTimeline();
  }

  /**
   * Load video src from data-defer-video attribute
   * Called before intro animation starts
   */
  async _loadVideo() {
    this.videoEl = this.view.querySelector("video");

    if (!this.videoEl) return;

    // If video has data-src (deferred loading), set src and load
    if (this.videoEl.dataset.deferVideo && this.videoEl.dataset.src) {
      this.logger?.trace?.("Loading deferred background video");
      this.videoEl.src = this.videoEl.dataset.src;
      this.videoEl.load();
    }

    // Return promise that resolves when video can play
    return new Promise((resolve) => {
      if (this.videoEl.readyState >= 2) {
        // Video is already ready to play
        resolve();
      } else {
        // Wait for background video to load, then play
        const handleCanPlay = () => {
          // this.logger.trace("Sounds like it can play now");
          this.videoEl.removeEventListener("canplay", handleCanPlay);
          resolve();
        };
        this.videoEl.addEventListener("canplay", handleCanPlay);
      }
    });
  }

  async play(label, fallback = 0) {
    if (this._isIntroLabel(label)) {
      await this._loadVideo();
    }

    if (this._isOutroLabel(label) && this.videoEl) {
      this.videoEl.pause();
    }

    return super.play(label, fallback);
  }

  _playVideo() {
    if (!this.videoEl) return;
    const playPromise = this.videoEl.play?.();
    if (playPromise?.catch) playPromise.catch(() => {});
  }

  _buildIntro() {
    const collapsedClip = "inset(50% 0 50% 0)";
    const targetClip = "inset(0% 0% 0% 0%)"; // full element width/height
    var tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    tl.fromTo(
      this.animTargets,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: this.DURATION },
    ).to(this.animTargets, {
      clipPath: targetClip,
      webkitClipPath: targetClip,
      // ease: this.easeOut,
      duration: this.DURATION,
    });
    return tl;
  }

  _buildIdle() {
    var tl = gsap.timeline({ id: TIMELINE_IDS.idle });
    return tl;
  }

  _buildOutro() {
    const collapsedClip = "inset(50% 0 50% 0)";
    const targetClip = "inset(0% 0% 0% 0%)"; // full element width/height
    var tl = gsap.timeline({ id: TIMELINE_IDS.outro });
    return tl;
  }

  _isIntroLabel(label) {
    return (
      label === TIMELINE_IDS.intro ||
      label === this.LABELS.intro ||
      label === this.LABELS.enter ||
      label === this.LABELS.enterBack
    );
  }

  _isOutroLabel(label) {
    return (
      label === TIMELINE_IDS.outro ||
      label === this.LABELS.leave ||
      label === this.LABELS.leaveBack ||
      label === "outro"
    );
  }
}
