/** @format */

/**
 * ScrollEffectsCoordinator - Master Scroll & Visual Effects Coordinator
 *
 * Orchestrates site-wide scroll smoothing, background layers, and gel effects
 * via specialized manager modules. Coordinates with AnimationBus to sequence
 * visual effects based on section animation events.
 */
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import ReducedMotionHandler from "../ReducedMotionHandler/ReducedMotionHandler.js";
import ScrollSmootherManager from "../ScrollSmootherManager/ScrollSmootherManager.js";
import GelAnimationManager from "../GelAnimationManager/GelAnimationManager.js";
import { SELECTORS } from "../../config/index/index.js";

export default class ScrollEffectsCoordinator {
  /** @param {AnimationBus} bus */
  constructor(bus) {
    this.logger = lumberjack.createScoped("ScrollEffectsCoordinator", {
      color: "#dbbcbc",
    });
    this.logger.enabled = true;

    this.bus = bus;
    this.reducedMotion = new ReducedMotionHandler();
    this.scrollSmoother = new ScrollSmootherManager(this.reducedMotion);
    this.gelAnimation = new GelAnimationManager(this.reducedMotion);

    this.initialize();
  }

  initialize() {
    this.gelAnimation.initialize();

    const smoother = this.scrollSmoother.getSmoother();
    if (!smoother) {
      this._fallbackToNativeScroll();
    }
  }

  getSmoother() {
    return this.scrollSmoother.getSmoother();
  }

  getGels() {
    return this.gelAnimation.getGels();
  }

  getVideo() {
    return this._video;
  }

  destroy() {
    this.gelAnimation.destroy();
    this.scrollSmoother.destroy();
    this.reducedMotion.destroy();
    this._video = null;
    this._videoContainer = null;
  }

  _fallbackToNativeScroll() {
    const wrapper = document.querySelector(`#${SELECTORS.smoothWrapper}`);
    const content = document.querySelector(`#${SELECTORS.smoothContent}`);
    if (wrapper) {
      wrapper.style.position = "static";
      wrapper.style.height = "auto";
      wrapper.style.overflow = "visible";
    }
    if (content) {
      content.style.overflow = "visible";
    }
  }
}
