/** @format */
/**
 * Hero Section Controller
 *
 * Simple intro fade-in that emits standardized events from constants.js.
 * Extends AbstractSection to use shared lifecycle and AnimationBus coordination.
 */

import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import HeroAnimations from './HeroAnimations.js';
import HeroTriggers from './HeroTriggers.js';

export default class Hero extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const elem = document.getElementById(SELECTORS.hero);
    const anim = new HeroAnimations(elem, ANIMATION_DEFAULTS);
    const triggers = new HeroTriggers(elem);
    const events = EVENTS.hero;

    super(elem, anim, triggers, events, bus, { reducedMotionHandler });

    if (!elem) {
      this.logger.trace('element not found; skipping initialization.');
      return;
    }
  }

  destroy() {
    this.heroTriggers?.destroy();
    this.heroAnimations?.outroTimeline?.kill();
    super.destroy();
  }
}
