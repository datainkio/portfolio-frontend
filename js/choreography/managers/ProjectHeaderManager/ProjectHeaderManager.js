import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { parallaxScrub } from "../../atoms/parallax/parallax.js";
import { PROJECT_HEADER_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { PROJECT_HEADER_ANIMATION } from "../../config/ix/motion/motion.js";

export default class ProjectHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("ProjectHeaderManager", {
      color: "#6366f1",
    });
    this._header = document.querySelector(PROJECT_HEADER_SELECTORS.header);
    this._image = document.querySelector(PROJECT_HEADER_SELECTORS.image);
    this._reducedMotionHandler = reducedMotionHandler;
    this._tween = null;

    if (!this._header || !this._image) {
      this.logger.trace("project header not found; disabled");
      return;
    }

    this._init();
  }

  _init() {
    this._tween = parallaxScrub(this._image, {
      yPercent: PROJECT_HEADER_ANIMATION.yPercent,
      ease: PROJECT_HEADER_ANIMATION.ease,
      trigger: this._header,
      ...PROJECT_HEADER_ANIMATION.scrollTrigger,
    });

    this.logger.trace("parallax initialized");
  }

  kill() {
    this._tween?.kill();
    this._tween = null;
  }
}
