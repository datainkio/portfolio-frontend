/** @format */
/**
 * Organizations Section Controller
 *
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import OrganizationsAnimations from './OrganizationsAnimations.js';
import OrganizationsTriggers from './OrganizationsTriggers.js';

export default class Organizations extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.organizations);
    const anim = new OrganizationsAnimations(view, ANIMATION_DEFAULTS);
    const triggers = new OrganizationsTriggers(view);
    const events = EVENTS.organizations;

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
