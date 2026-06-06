import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";

const COLLAPSE_GUARD_PROGRESS = 0;

export default class WorkHeaderManager {
  constructor({ reducedMotionHandler, industryHeaderManager } = {}) {
    this.logger = lumberjack.createScoped("WorkHeaderManager", {
      color: "#F59E0B",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    const workHeader = workSection?.querySelector(`[${WORK_EL_ATTR}="header"]`);
    this._jumplinks =
      workHeader?.querySelector(`[${WORK_EL_ATTR}="jumplinks"]`) ?? null;
    this._workSection = workSection;
    this._workHeader = workHeader;
    this._reducedMotionHandler = reducedMotionHandler;
    this._industryHeaderManager = industryHeaderManager ?? null;
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
      end: "bottom bottom",
      onUpdate: (self) => this._onScrollUpdate(self, reduced),
      markers: false,
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
    this._trigger?.refresh();
    if (this._isCollapsed) return;
    this._isCollapsed = true;
    this._naturalHeight = this._jumplinks.offsetHeight;
    this._naturalHeaderHeight = this._workHeader.offsetHeight;
    const collapsedHeaderHeight =
      this._naturalHeaderHeight - this._naturalHeight;

    this._industryHeaderManager?.onWorkHeaderCollapse({
      collapsedHeight: collapsedHeaderHeight,
      reduced,
    });

    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 0, y: -8, height: 0 });
      gsap.set(this._workHeader, { height: collapsedHeaderHeight });
      return;
    }

    gsap.to(this._jumplinks, {
      autoAlpha: 0,
      y: -8,
      height: 0,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
    gsap.to(this._workHeader, {
      height: collapsedHeaderHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  _expand(reduced) {
    this._trigger?.refresh();
    if (!this._isCollapsed) return;
    this._isCollapsed = false;

    this._industryHeaderManager?.onWorkHeaderExpand({
      naturalHeight: this._naturalHeaderHeight,
      reduced,
    });

    if (reduced) {
      gsap.set(this._jumplinks, { autoAlpha: 1, y: 0, height: "auto" });
      gsap.set(this._workHeader, { clearProps: "height,maxHeight" });
      return;
    }

    gsap.to(this._jumplinks, {
      autoAlpha: 1,
      y: 0,
      height: this._naturalHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
      onComplete: () => gsap.set(this._jumplinks, { height: "auto" }),
    });
    gsap.to(this._workHeader, {
      height: this._naturalHeaderHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
      onComplete: () => {
        gsap.set(this._workHeader, { clearProps: "height,maxHeight" });
      },
    });
  }

  kill() {
    this._trigger?.kill();
    this._trigger = null;
    if (this._jumplinks) {
      gsap.killTweensOf(this._jumplinks);
      gsap.set(this._jumplinks, { clearProps: "height,overflow,autoAlpha,y" });
    }
    if (this._workHeader) {
      gsap.killTweensOf(this._workHeader);
      gsap.set(this._workHeader, { clearProps: "height,maxHeight" });
    }
    this.logger.trace("destroyed");
  }
}
