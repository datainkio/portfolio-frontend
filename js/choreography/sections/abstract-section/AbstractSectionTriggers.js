/** @format */

/**
 * BaseTriggers - Shared foundation for scroll/GSAP triggers per section
 *
 * Manages a collection of triggers and provides lifecycle helpers.
 */

import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import lumberjack from '/assets/js/utils/lumberjack/index.js';

export default class AbstractSectionTriggers {
  /**
   * @param {HTMLElement|null} view - Target element for triggers
   */
  constructor(view) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: '#28a745',
      enabled: true,
    });
    this.view = view;
    this._trigger = null;
    this._callbacks = {};
  }

  /**
   * Bind callbacks to the viewport trigger
   *
   * Stores callbacks internally and recreates the trigger with them
   * included in the vars object for proper GSAP ScrollTrigger integration.
   */
  bind({ onEnter = null, onLeave = null, onEnterBack = null, onLeaveBack = null } = {}) {
    if (!this.view) {
      this.logger.trace('No view available to bind triggers');
      return;
    }

    // Store callbacks
    this._callbacks = { onEnter, onLeave, onEnterBack, onLeaveBack };

    // Kill existing trigger if any
    if (this._trigger) {
      this._trigger.kill();
    }

    // Build vars with callbacks
    const vars = {
      trigger: this.view,
      start: 'center top',
      end: 'bottom top',
    };

    if (onEnter) vars.onEnter = onEnter;
    if (onLeave) vars.onLeave = onLeave;
    if (onEnterBack) vars.onEnterBack = onEnterBack;
    if (onLeaveBack) vars.onLeaveBack = onLeaveBack;

    // Create trigger with callbacks baked in
    this._trigger = ScrollTrigger.create(vars);

    // this.logger.trace('Bound ScrollTrigger callbacks', {
    //   onEnter: !!onEnter,
    //   onLeave: !!onLeave,
    //   onEnterBack: !!onEnterBack,
    //   onLeaveBack: !!onLeaveBack,
    // });
  }

  /** Kill the viewport trigger. */
  kill() {
    this._trigger?.kill();
    this._trigger = null;
  }
}
