import AbstractSection from '../abstract-section/AbstractSection.js';
import { EVENTS } from '../../constants.js';
import { SELECTORS, ANIMATION_DEFAULTS } from '../../config.js';
import BackgroundVideoAnimations from './BackgroundVideoAnimations.js';
import BackgroundVideoTriggers from './BackgroundVideoTriggers.js';

export default class BackgroundVideo extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    var view = document.getElementById(SELECTORS.video);
    var anim = new BackgroundVideoAnimations(view, ANIMATION_DEFAULTS);
    var triggers = new BackgroundVideoTriggers(view);
    var events = EVENTS.video;

    super(view, anim, triggers, events, bus, { reducedMotionHandler });

    if (!view) {
      this.logger.trace('element not found; skipping initialization.');
      return;
    }
  }
}
