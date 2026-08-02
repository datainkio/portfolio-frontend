/**
 * Scroll-triggered intro animation manager for the ruler display.
 *
 * Keeps the display implementation (Ruler.js) focused on rendering while
 * choreography concerns (timing, trigger, motion tokens) live in this manager.
 */
import {
  motion,
  RULER_INTRO_DEFAULTS,
} from "/assets/js/choreography/config/index.js";
import { gsap } from "/assets/js/choreography/vendor/gsap.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default class RulerIntroManager {
  constructor(options = {}) {
    this.config = { ...RULER_INTRO_DEFAULTS, ...options };
    this.tween = null;
    this._initialized = false;
  }

  init() {
    if (this._initialized) return this;

    const trigger = document.querySelector(this.config.selectorTrigger);
    const container = document.querySelector(
      this.config.selectorRulerContainer,
    );
    const svg = container?.querySelector(this.config.selectorSvg);
    const baseline = svg?.querySelector(this.config.selectorBaseline);
    const targets = svg
      ? Array.from(svg.querySelectorAll(this.config.selectorTargets))
      : [];

    if (!trigger || !svg || !baseline || !targets.length) {
      return this;
    }

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      gsap.set(baseline, { scaleX: 1, visibility: "visible" });
      gsap.set(targets, { visibility: "visible" });
      this._initialized = true;
      return this;
    }

    const duration = motion.duration(this.config.durationToken) / 1000;
    const staggerAmountToken =
      this.config.staggerAmountToken || this.config.staggerToken || "slow";
    const staggerAmount = motion.duration(staggerAmountToken) / 1000;
    const ease = motion.ease(this.config.easeToken);

    gsap.set(baseline, {
      visibility: "visible",
      transformOrigin: "left center",
      scaleX: 0,
    });
    gsap.set(targets, { visibility: "hidden" });

    this.tween = gsap.timeline({
      defaults: {
        overwrite: true,
      },
      scrollTrigger: {
        trigger,
        start: this.config.start,
        once: this.config.once,
      },
    });

    this.tween.to(baseline, {
      scaleX: 1,
      duration,
      ease,
    });

    this.tween.to(targets, {
      visibility: "visible",
      duration: 0,
      stagger: {
        amount: staggerAmount,
        from: this.config.staggerOrder || "start",
      },
    });

    this._initialized = true;
    return this;
  }

  refresh() {
    this.destroy();
    return this.init();
  }

  destroy() {
    if (this.tween?.scrollTrigger) {
      this.tween.scrollTrigger.kill();
    }
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
    this._initialized = false;
  }
}

let singleton = null;

export function initRulerIntro(options = {}) {
  if (!singleton) {
    singleton = new RulerIntroManager(options);
  }
  singleton.init();
  return singleton;
}

export function getRulerIntro() {
  return singleton;
}
