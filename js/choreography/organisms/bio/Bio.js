import AbstractSection from "../../system/AbstractSection.js";
import {
  SELECTORS,
  resolveSectionMotionProfile,
} from "../../config/index/index.js";
import BioAnimations from "./BioAnimations.js";
import BioTriggers from "./BioTriggers.js";

export default class Bio extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler, gelManager = null } = {}) {
    const view = document.getElementById(SELECTORS.bio);
    const animations = new BioAnimations(view, { gelManager });
    const triggers = new BioTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "bio",
      bus,
      reducedMotionHandler,
    });
  }

  _applyResponsiveLifecycle(conditions = {}) {
    const profile = resolveSectionMotionProfile("bio", conditions);
    this.animations?.setVariant?.(profile.animation?.variant ?? "sweep");
    super._applyResponsiveLifecycle(conditions);
  }
}
