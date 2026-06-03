import { gsap } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion/motion.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const WORK_EL_ATTR = "data-projects-el";
const INDUSTRY_HEADING_VALUE = "industry-heading";

export default class IndustryHeaderManager {
  constructor({ reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("IndustryHeaderManager", {
      color: "#3B82F6",
      enabled: true,
    });

    const workSection = document.getElementById(SELECTORS.work);
    this._workHeader =
      workSection?.querySelector(`[${WORK_EL_ATTR}="header"]`) ?? null;
    this._headings = Array.from(
      document.querySelectorAll(`[${WORK_EL_ATTR}="${INDUSTRY_HEADING_VALUE}"]`),
    );
    this._reducedMotionHandler = reducedMotionHandler;

    if (!this._headings.length) {
      this.logger.trace(
        "no industry headings found; IndustryHeaderManager disabled",
      );
      return;
    }

    this._init();
  }

  _init() {
    const naturalTop = this._workHeader?.offsetHeight ?? 0;
    gsap.set(this._headings, { top: naturalTop });
    this.logger.trace("initialized");
  }

  onWorkHeaderCollapse({ collapsedHeight, reduced }) {
    if (!this._headings.length) return;
    if (reduced) {
      gsap.set(this._headings, { top: collapsedHeight });
      return;
    }
    gsap.to(this._headings, {
      top: collapsedHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("exit"),
      overwrite: true,
    });
  }

  onWorkHeaderExpand({ naturalHeight, reduced }) {
    if (!this._headings.length) return;
    if (reduced) {
      gsap.set(this._headings, { top: naturalHeight });
      return;
    }
    gsap.to(this._headings, {
      top: naturalHeight,
      duration: motion.duration("base") / 1000,
      ease: motion.ease("enter"),
      overwrite: true,
    });
  }

  kill() {
    if (this._headings.length) {
      gsap.killTweensOf(this._headings);
      gsap.set(this._headings, { clearProps: "top" });
    }
    this.logger.trace("destroyed");
  }
}
