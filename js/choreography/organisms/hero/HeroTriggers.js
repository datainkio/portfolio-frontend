import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { HERO_TRIGGER, TIMELINE_IDS } from "../../config/index/index.js";

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
