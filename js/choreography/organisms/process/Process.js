import AbstractSection from "../../system/AbstractSection.js";
import {
  SELECTORS,
  resolveSectionMotionProfile,
} from "../../config/index/index.js";
import ProcessAnimations from "./ProcessAnimations.js";
import ProcessTriggers from "./ProcessTriggers.js";

export default class Process extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.process);
    const animations = new ProcessAnimations(view);
    const triggers = new ProcessTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "process",
      bus,
      reducedMotionHandler,
    });
  }

  _applyResponsiveLifecycle(conditions = {}) {
    const profile = resolveSectionMotionProfile("process", conditions);
    this.animations?.rebuild?.(profile.animation?.variant ?? "blockframes");
    super._applyResponsiveLifecycle(conditions);
  }
}
