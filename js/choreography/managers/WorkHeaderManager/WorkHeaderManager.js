import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";

// Collapse only after this fraction of the work section has scrolled past.
// Prevents immediate collapse the instant the header pins.
const COLLAPSE_GUARD_PROGRESS = 0.01;

export default class WorkHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("WorkHeaderManager", {
      color: "#F59E0B",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    const workHeader = workSection?.querySelector(`[${WORK_EL_ATTR}="header"]`);
    this._jumplinks =
      workHeader?.querySelector(`[${WORK_EL_ATTR}="jumplinks"]`) ?? null;
    this._workSection = workSection;
    this._reducedMotionHandler = reducedMotionHandler;
    this._trigger = null;
    this._isCollapsed = false;

    if (!this._jumplinks) {
      this.logger.trace(
        "jumplinks element not found; WorkHeaderManager disabled",
      );
      return;
    }

    this._init();
  }

  _init() {
    if (this._jumplinks.dataset.workHeaderJumplinksInit) return;
    this._jumplinks.dataset.workHeaderJumplinksInit = "1";

    gsap.set(this._jumplinks, { autoAlpha: 1, y: 0 });

    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;

    this._trigger = ScrollTrigger.create({
      trigger: this._workSection,
      start: "top top",
      end: "bottom top",
      onLeave: () => this._expand(reduced),
      onLeaveBack: () => this._expand(reduced),
      onUpdate: (self) => this._onScrollUpdate(self, reduced),
    });

    this.logger.trace("initialized");
  }

  _onScrollUpdate(self, reduced) {
    if (self.progress < COLLAPSE_GUARD_PROGRESS) {
      this._expand(reduced);
      return;
    }
    if (self.direction === 1) {
      this._collapse(reduced);
    } else {
      this._expand(reduced);
    }
  }

  _collapse(reduced) {
    if (this._isCollapsed) return;
    this._isCollapsed = true;
    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 0, y: -8 });
      return;
    }
    gsap.to(this._jumplinks, {
      autoAlpha: 0,
      y: -8,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  _expand(reduced) {
    if (!this._isCollapsed) return;
    this._isCollapsed = false;
    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.to(this._jumplinks, {
      autoAlpha: 1,
      y: 0,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
    });
  }

  kill() {
    this._trigger?.kill();
    this._trigger = null;
    if (this._jumplinks) gsap.killTweensOf(this._jumplinks);
    this.logger.trace("destroyed");
  }
}
