import { gsap, ScrollTrigger } from "../../vendor/gsap/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

// Show header unconditionally when scroll position is near the top.
const SCROLL_THRESHOLD_PX = 80;

export default class GlobalHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("GlobalHeaderManager", {
      color: "#8B5CF6",
      enabled: true,
    });

    this._el = document.getElementById(SELECTORS.header);
    this._reducedMotionHandler = reducedMotionHandler;
    this._trigger = null;
    this._isHidden = false;

    if (!this._el) {
      this.logger.trace("element not found; GlobalHeaderManager disabled");
      return;
    }

    this._init();
  }

  _init() {
    if (this._el.dataset.globalHeaderInit) return;
    this._el.dataset.globalHeaderInit = "1";

    gsap.set(this._el, { yPercent: 0 });

    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;

    this._trigger = ScrollTrigger.create({
      onUpdate: (self) => this._onScrollUpdate(self, reduced),
    });

    this.logger.trace("initialized");
  }

  _onScrollUpdate(self, reduced) {
    if (self.scroll() < SCROLL_THRESHOLD_PX) {
      this._show(reduced);
      return;
    }

    if (self.direction === 1) {
      this._hide(reduced);
    } else {
      this._show(reduced);
    }
  }

  _hide(reduced) {
    if (this._isHidden) return;
    this._isHidden = true;

    if (reduced) {
      gsap.set(this._el, { yPercent: -100 });
      return;
    }

    gsap.to(this._el, {
      yPercent: -100,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  _show(reduced) {
    if (!this._isHidden) return;
    this._isHidden = false;

    if (reduced) {
      gsap.set(this._el, { yPercent: 0 });
      return;
    }

    gsap.to(this._el, {
      yPercent: 0,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
    });
  }

  kill() {
    this._trigger?.kill();
    this._trigger = null;
    if (this._el) gsap.killTweensOf(this._el);
    this.logger.trace("destroyed");
  }
}
