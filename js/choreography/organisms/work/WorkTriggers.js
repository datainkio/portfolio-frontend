import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { SELECTORS } from "../../config/index/index.js";

const WORK_EL_ATTR = "data-projects-el";

/**
 * Work Trigger Defaults
 */
export const WORK_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.work,
};

/**
 * Work Industry Header Pin Defaults
 *
 * Controls stacked pinning for industry headers beneath the pinned Work header.
 */
export const WORK_INDUSTRY_HEADER_PIN = {
  ...SCROLL_DEFAULTS,
  id: `${SELECTORS.work}-industry-header-pin`,
  pin: true,
  // pinSpacing: true,
  // Extra space beneath the pinned Work header.
  // offsetPx: 24,
};

/**
 * @deprecated Use WORK_TRIGGER instead.
 *
 * TODO: Remove PROJECTS_TRIGGER once all references are updated to WORK_TRIGGER.
 */
export const PROJECTS_TRIGGER = WORK_TRIGGER;

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

    const scrollDistance =
      footer.getBoundingClientRect().bottom -
      this.view.getBoundingClientRect().top;

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
