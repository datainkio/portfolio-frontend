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

import { EVENTS } from "../../config/events.js";
import AbstractSectionAnimations from "../abstract-section/AbstractSectionAnimations.js";
import { Lumberjack } from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";
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
    this.options = options;
    this.logger = Lumberjack.createScoped("BackgroundVideoAnimations", {
      prefix: "",
      color: "#CCC59D",
    });

    this.setDefault(options);
  }

  async setDefault(options = {}) {
    const collapsedClip = "inset(50% 0 50% 0)"; // zero-height strip

    super.setDefault({
      clipPath: collapsedClip,
      webkitClipPath: collapsedClip,
      ...options,
    });
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
      this.logger.trace("Loading deferred background video");
      this.videoEl.src = this.videoEl.dataset.src;
      this.videoEl.load();
    }

    // Return promise that resolves when video can play
    return new Promise((resolve) => {
      if (this.videoEl.readyState >= 2) {
        this.logger.trace(
          "Background video has sufficiently loaded. Stop polling.",
        );
        resolve();
      } else {
        this.logger.trace("Wait for background video to load, then play");
        const handleCanPlay = () => {
          this.logger.trace("Sounds like it can play now");
          this.videoEl.removeEventListener("canplay", handleCanPlay);
          resolve();
        };
        this.videoEl.addEventListener("canplay", handleCanPlay);
      }
    });
  }

  // Override AbstractSectionAnimations
  async intro() {
    this.logger.trace("intro() called for BackgroundVideoAnimations");
    // Load video before starting intro animation
    await this._loadVideo();
    // Play video when intro animation completes
    // this.timeline.eventCallback("onComplete", () => this._playVideo());
    return super.intro();
  }

  _buildTimeline() {
    super._buildTimeline();
    this.timeline.add(this._buildIntro(), this.LABELS.enter);
    this.timeline.add(this._buildOutro(), this.LABELS.leave);
    return this.timeline;
  }

  _playVideo() {
    if (!this.videoEl) return;
    const playPromise = this.videoEl.play?.();
    if (playPromise?.catch) playPromise.catch(() => {});
  }

  _buildIntro() {
    const collapsedClip = "inset(50% 0 50% 0)";
    const targetClip = "inset(0% 0% 0% 0%)"; // full element width/height
    var tl = gsap.timeline({ id: "intro" });
    // tl.fromTo(
    //   this.view,
    //   { autoAlpha: 0 },
    //   { autoAlpha: 1, duration: this.DURATION },
    // ).to(this.view, {
    //   clipPath: targetClip,
    //   webkitClipPath: targetClip,
    //   // ease: this.easeOut,
    //   duration: this.DURATION,
    // });
    return tl;
  }

  _buildOutro() {
    const collapsedClip = "inset(50% 0 50% 0)";
    const targetClip = "inset(0% 0% 0% 0%)"; // full element width/height
    var tl = gsap.timeline({ id: "outro" });
    // .fromTo(
    //   this.view,
    //   {
    //     clipPath: targetClip,
    //     webkitClipPath: targetClip,
    //     autoAlpha: 1,
    //   },
    //   {
    //     clipPath: collapsedClip,
    //     webkitClipPath: collapsedClip,
    //     autoAlpha: 0,
    //     duration: this.DURATION,
    //   },
    // );
    return tl;
  }

  outro() {
    // Pause video on outro
    if (this.videoEl) {
      this.videoEl.pause();
    }
    return super.outro();
  }
}
