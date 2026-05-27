import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/vendor/gsap/gsap.js";
import { PROJECT_HEADER_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { PROJECT_HEADER_ANIMATION } from "../../config/ix/motion/motion.js";

/**
 * Drives the parallax scroll effect on the project hero header.
 *
 * The image layer (`data-project-header-image`) is taller than its
 * container (h-[130%]) so that a scrubbed yPercent translation keeps
 * the image filling the viewport across the full scroll-out duration.
 * The content layer moves with native scroll; only the image is animated.
 *
 * No-ops on pages that don't render `[data-project-header]`.
 */
export default class ProjectHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("ProjectHeaderManager", {
      color: "#6366f1",
    });
    this._header = document.querySelector(PROJECT_HEADER_SELECTORS.header);
    this._image = document.querySelector(PROJECT_HEADER_SELECTORS.image);
    this._reducedMotionHandler = reducedMotionHandler;
    this._trigger = null;

    if (!this._header || !this._image) {
      this.logger.trace("project header not found; disabled");
      return;
    }

    this._init();
  }

  _init() {
    this._trigger = gsap.to(this._image, {
      yPercent: PROJECT_HEADER_ANIMATION.yPercent,
      ease: PROJECT_HEADER_ANIMATION.ease,
      scrollTrigger: {
        trigger: this._header,
        ...PROJECT_HEADER_ANIMATION.scrollTrigger,
      },
    }).scrollTrigger;

    this.logger.trace("parallax initialized");
  }

  kill() {
    this._trigger?.kill();
    if (this._image) gsap.killTweensOf(this._image);
  }
}
