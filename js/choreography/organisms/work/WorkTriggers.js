import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { WORK_TRIGGER } from "../../config/index/index.js";

const WORK_EL_ATTR = "data-projects-el";

export default class WorkTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
    this._headerPin = null;
  }

  _getTriggerDefaults() {
    return WORK_TRIGGER;
  }

  bind(callbacks = {}) {
    super.bind(callbacks);
    this._bindHeaderPin();
  }

  _bindHeaderPin() {
    this._headerPin?.kill();
    this._headerPin = null;

    const header = this.view?.querySelector(`[${WORK_EL_ATTR}="header"]`);
    if (!header || !this.view) return;

    const { top, bottom } = this.view.getBoundingClientRect();
    const scrollDistance = bottom - top;

    this._headerPin = ScrollTrigger.create({
      id: "work-header-pin",
      trigger: this.view,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: header,
      pinSpacing: false,
      invalidateOnRefresh: false,
      markers: false,
    });
  }

  kill() {
    this._headerPin?.kill();
    this._headerPin = null;
    super.kill();
  }
}
