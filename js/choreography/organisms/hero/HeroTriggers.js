import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/index/index.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { SELECTORS } from "../../config/index/index.js";

/**
 * Hero Trigger Defaults
 */
export const HERO_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.hero,
  once: false,
  start: "top top",
  end: "bottom top",
  pinSpacing: true,
  pin: true,
  scrub: 1,
  fastScrollEnd: false,
  toggleActions: "none none none none",
};

export default class HeroTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._gelTrigger = null;
  }

  _getTriggerDefaults() {
    return {
      ...HERO_TRIGGER,
      end: () => {
        const bottom = this.section?.animations?.getLastWordBottom?.() ?? null;
        return bottom != null ? `+=${bottom}` : HERO_TRIGGER.end;
      },
    };
  }

  bind(callbacks = {}) {
    super.bind(callbacks);

    this._gelTrigger?.kill();
    this._gelTrigger = null;

    const outroTimeline =
      this.section?.animations?.getTimeline?.(TIMELINE_IDS.outro) ?? null;

    if (!outroTimeline) return;

    this._gelTrigger = ScrollTrigger.create({
      id: `${HERO_TRIGGER.id}:gel`,
      trigger: this.view,
      start: () => this._trigger?.start ?? 0,
      end: () => (this._trigger?.start ?? 0) + window.innerHeight,
      scrub: true,
      fastScrollEnd: false,
      invalidateOnRefresh: true,
      animation: outroTimeline,
    });
  }

  kill() {
    this._gelTrigger?.kill();
    this._gelTrigger = null;
    super.kill();
  }
}
