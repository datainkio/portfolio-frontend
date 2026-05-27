import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS } from "../../config/index/index.js";
import BioAnimations from "./BioAnimations.js";
import BioTriggers from "./BioTriggers.js";

export default class Bio extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.bio);
    const animations = new BioAnimations(view);
    const triggers = new BioTriggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: SELECTORS.bio,
      bus,
      reducedMotionHandler,
    });
  }
}
