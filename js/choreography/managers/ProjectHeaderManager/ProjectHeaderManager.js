import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { gsap } from "/assets/js/choreography/vendor/gsap/gsap.js";

const SELECTORS = {
  header: "[data-project-header]",
  image: "[data-project-header-image]",
};

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
    this._header = document.querySelector(SELECTORS.header);
    this._image = document.querySelector(SELECTORS.image);
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
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: this._header,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    }).scrollTrigger;

    this.logger.trace("parallax initialized");
  }

  kill() {
    this._trigger?.kill();
    if (this._image) gsap.killTweensOf(this._image);
  }
}
