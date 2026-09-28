import { gsap, ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { motion } from "../../config/ix/motion.js";
import { SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { EVENTS } from "../../config/contracts/events/events.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const SCROLL_THRESHOLD_PX = 80;

export default class GlobalHeaderManager {
  constructor({ bus, reducedMotionHandler } = {}) {
    this.logger = lumberjack.createScoped("GlobalHeaderManager", {
      color: "#8B5CF6",
      enabled: true,
    });

    this._el = document.getElementById(SELECTORS.header);
    this._bus = bus;
    this._reducedMotionHandler = reducedMotionHandler;
    this._offCue = null;
    this._revealed = false;
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

    // The markup ships `hidden`. On home (bus + bio section), the reveal is
    // the last beat of the landing chain — it waits for the bio intro, so the
    // header enters once the page content has settled. Everywhere else it
    // reveals immediately: landing pages without a bio (work, contact) load
    // the Director too, and would otherwise wait on a cue that never fires.
    if (this._bus && document.getElementById(SELECTORS.bio)) {
      this._offCue = this._bus.on(EVENTS.bio.introComplete, () =>
        this._reveal(),
      );
    } else {
      this._reveal();
    }

    this.logger.trace("initialized");
  }

  _reveal() {
    if (this._revealed) return;
    this._revealed = true;
    this._offCue?.();
    this._offCue = null;

    const reduced = this._reducedMotionHandler?.isReducedMotion?.() ?? false;
    // Only a home reveal is choreographed; elsewhere the header is page chrome.
    const animate = !reduced && Boolean(this._bus);

    this._bus?.emit(EVENTS.header.introStart);
    this._el.classList.remove("hidden");

    // Scroll auto-hide is armed only after the intro, so it can never fire first.
    const onComplete = () => {
      this._trigger = ScrollTrigger.create({
        onUpdate: (self) => this._onScrollUpdate(self, reduced),
      });
      this._bus?.emit(EVENTS.header.introComplete);
    };

    if (!animate) {
      gsap.set(this._el, { yPercent: 0 });
      onComplete();
      return;
    }

    gsap.fromTo(
      this._el,
      { yPercent: -100 },
      {
        yPercent: 0,
        duration: motion.duration("base") / 1000,
        ease: motion.ease("enter"),
        onComplete,
      },
    );
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
    this._offCue?.();
    this._offCue = null;
    this._trigger?.kill();
    this._trigger = null;
    if (this._el) gsap.killTweensOf(this._el);
    this.logger.trace("destroyed");
  }
}
