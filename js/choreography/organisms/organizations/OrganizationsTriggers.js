import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { ScrollTrigger } from "../../system/gsap.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { SELECTORS } from "../../config/index/index.js";

/**
 * Organizations Trigger Defaults
 */
export const ORGANIZATIONS_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.organizations,
};

/**
 * Logo marquee visibility. Separate from the section trigger, which is
 * `once: true` and stops reporting after the first entry: the marquee has to
 * pause every time the section leaves the viewport and resume when it returns.
 */
export const ORGANIZATIONS_MARQUEE_TRIGGER = {
  id: `${SELECTORS.organizations}-marquee`,
  start: "top bottom",
  end: "bottom top",
};

export default class OrganizationsTriggers extends AbstractSectionTriggers {
  constructor(view) {
    super(view);
    this._revealTrigger = null;
    this._hideTrigger = null;
    this._marqueeTrigger = null;
  }

  _getTriggerDefaults() {
    return ORGANIZATIONS_TRIGGER;
  }

  /**
   * Report marquee visibility. Safe to call repeatedly.
   * @param {(isVisible: boolean) => void} onToggle
   */
  bindMarquee(onToggle) {
    this.killMarquee();
    if (!this.view || typeof onToggle !== "function") return;
    this._marqueeTrigger = ScrollTrigger.create({
      ...ORGANIZATIONS_MARQUEE_TRIGGER,
      trigger: this.view,
      onToggle: (self) => onToggle(self.isActive),
    });
    onToggle(this._marqueeTrigger.isActive);
  }

  killMarquee() {
    this._marqueeTrigger?.kill();
    this._marqueeTrigger = null;
  }

  kill() {
    this.killMarquee();
    super.kill();
  }
}
