import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { ScrollTrigger } from "/assets/js/choreography/system/gsap.js";
import { WORK_INDUSTRY_HEADER_PIN, WORK_TRIGGER } from "../../config/index/index.js";

const WORK_EL_ATTR = "data-projects-el";

export default class WorkTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
    this._headerPin = null;
    this._industryHeaderPins = [];
  }

  _getTriggerDefaults() {
    return WORK_TRIGGER;
  }

  bind(callbacks = {}) {
    super.bind(callbacks);
    this._bindHeaderPin();
    this._bindIndustryHeaderPins();
  }

  _getWorkHeaderOffset() {
    const header = this.view?.querySelector(`[${WORK_EL_ATTR}="header"]`);
    if (!header) return 0;
    return Math.max(0, Math.round(header.getBoundingClientRect().height));
  }

  _getIndustryPinOffset() {
    const extraOffset = Number(WORK_INDUSTRY_HEADER_PIN.offsetPx) || 0;
    return this._getWorkHeaderOffset() + Math.max(0, extraOffset);
  }

  _bindHeaderPin() {
    this._headerPin?.kill();
    this._headerPin = null;

    const header = this.view?.querySelector(`[${WORK_EL_ATTR}="header"]`);
    if (!header || !this.view) return;

    this._headerPin = ScrollTrigger.create({
      id: "work-header-pin",
      trigger: this.view,
      start: "top top",
      end: "bottom top",
      pin: header,
      pinSpacing: false,
      invalidateOnRefresh: true,
      markers: false,
    });
  }

  _bindIndustryHeaderPins() {
    this._industryHeaderPins.forEach((pin) => pin.kill());
    this._industryHeaderPins = [];

    if (!this.view) return;

    const groups = Array.from(
      this.view.querySelectorAll(`[${WORK_EL_ATTR}="industry-group"]`),
    );

    groups.forEach((group, index) => {
      const nextGroup = groups[index + 1] ?? null;
      const heading = group.querySelector(
        `[${WORK_EL_ATTR}="industry-heading"]`,
      );
      if (!heading) return;

      const pinId = heading.id
        ? `work-industry-header-pin-${heading.id}`
        : `work-industry-header-pin-${index}`;

      const pin = ScrollTrigger.create({
        id: pinId,
        trigger: group,
        start: () => `top top+=${this._getIndustryPinOffset()}`,
        endTrigger: nextGroup ?? group,
        end: () => {
          const offset = this._getIndustryPinOffset();
          if (nextGroup) {
            return `top top+=${offset}`;
          }
          const headingHeight = Math.max(
            0,
            Math.round(heading.getBoundingClientRect().height),
          );
          return `bottom top+=${offset + headingHeight}`;
        },
        pin: heading,
        pinSpacing: false,
        invalidateOnRefresh: true,
        markers: false,
      });

      this._industryHeaderPins.push(pin);
    });
  }

  kill() {
    this._headerPin?.kill();
    this._headerPin = null;
    this._industryHeaderPins.forEach((pin) => pin.kill());
    this._industryHeaderPins = [];
    super.kill();
  }
}
