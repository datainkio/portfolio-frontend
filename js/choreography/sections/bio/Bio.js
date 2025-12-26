/** @format */
/**
 * Organizations Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import BioAnimations from './BioAnimations.js';
import BioTriggers from './BioTriggers.js';

export default class Bio extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.bio);
    const anim = new BioAnimations(view, ANIMATION_DEFAULTS);
    const triggers = new BioTriggers(view);
    const events = EVENTS.bio;

    super(view, anim, triggers, events, bus, { reducedMotionHandler });

    // Link triggers back to this section for playIntro/playOutro calls
    if (this.triggers) {
      this.triggers.section = this;
    }

    if (!view) {
      this.logger.trace('element not found; skipping initialization.');
      return;
    }
  }
}
