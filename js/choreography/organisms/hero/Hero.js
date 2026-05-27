import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS } from "../../config/index/index.js";
import HeroAnimations from "./HeroAnimations.js";
import HeroTriggers from "./HeroTriggers.js";

export default class Hero extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler, gelManager = null } = {}) {
    const view = document.getElementById(SELECTORS.hero);
    const animations = new HeroAnimations(view, { gelManager });
    const triggers = new HeroTriggers(view);
    super({
      view,
      animations,
      triggers,
      sectionKey: "hero",
      bus,
      reducedMotionHandler,
      initialInView: true,
    });
  }

  playOutro() {
    this.logger.trace(
      "Hero outro is scrub-driven; skipping direct timeline play",
    );
    return Promise.resolve();
  }
}
