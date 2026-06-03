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
    const footer = this.view?.querySelector(`[${WORK_EL_ATTR}="footer"]`);
    if (!header || !footer || !this.view) return;
    console.log(
      "Binding header pin for Work section",
      this.view.clientHeight,
      footer.offsetTop,
    );
    this._headerPin = ScrollTrigger.create({
      id: "work-header-pin",
      trigger: this.view,
      start: "top top",
      endTrigger: footer,
      end: "bottom top",
      pin: header,
      pinSpacing: false,
      invalidateOnRefresh: true,
      markers: true,
    });
  }

  kill() {
    this._headerPin?.kill();
    this._headerPin = null;
    super.kill();
  }
}
