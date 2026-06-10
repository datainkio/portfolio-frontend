import AbstractSection from "../../system/AbstractSection.js";
import {
  SELECTORS,
  resolveSectionMotionProfile,
} from "../../config/index/index.js";
import AwardsAnimations from "./AwardsAnimations.js";
import AwardsTriggers from "./AwardsTriggers.js";

export default class Awards extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler, gelManager = null } = {}) {
    const view = document.getElementById(SELECTORS.awards);
    const animations = new AwardsAnimations(view, { gelManager });
    const triggers = new AwardsTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "awards",
      bus,
      reducedMotionHandler,
    });
  }

  _applyResponsiveLifecycle(conditions = {}) {
    const profile = resolveSectionMotionProfile("awards", conditions);
    this.animations?.setVariant?.(profile.animation?.variant ?? "sweep");
    super._applyResponsiveLifecycle(conditions);
  }
}
