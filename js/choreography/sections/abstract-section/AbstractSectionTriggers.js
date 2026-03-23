/**
 * ---
 * aix:
 *   id: frontend.js.choreography.sections.abstract-section.abstractsectiontriggers
 *   role: Frontend runtime module: js/choreography/sections/abstract-section/AbstractSectionTriggers.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - sections
 * ---
 */
/** @format */

/**
 * BaseTriggers - Shared foundation for scroll/GSAP triggers per section
 *
 * Manages a collection of triggers and provides lifecycle helpers.
 */

import { ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { SCROLL_DEFAULTS } from "../../config/index.js";

export default class AbstractSectionTriggers {
  /**
   * @param {HTMLElement|null} view - Target element for triggers
   */
  constructor(view) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#28a745",
      enabled: true,
    });
    this.view = view;
    this._trigger = null;
  }

  /**
   * Per-section ScrollTrigger defaults.
   * Subclasses can override to layer section-specific settings.
   *
   * @returns {Object}
   */
  getTriggerDefaults() {
    return SCROLL_DEFAULTS;
  }

  /**
   * Bind callbacks to the viewport trigger
   *
   * Recreates the trigger with callbacks included in vars.
   *
   * **Rebind Behavior:**
   * Calling bind() multiple times is safe and efficient:
   * - Automatically kills the previous trigger before creating a new one
   * - Useful for updating trigger behavior without memory leaks
   *
   * @example
   * // First bind
   * triggers.bind({
   *   onEnter: () => console.log('entered'),
   *   onLeave: () => console.log('left')
   * });
   *
   * // Later, rebind with different callbacks
   * triggers.bind({
   *   onEnter: () => { ...new behavior... }
   * });
   * // Previous trigger is automatically cleaned up
   *
   * @param {Object} callbacks - Viewport trigger callbacks
   * @param {Function} callbacks.onEnter - Fired when viewport enters trigger
   * @param {Function} callbacks.onLeave - Fired when viewport leaves trigger
   * @param {Function} callbacks.onEnterBack - Fired when scrolling back into viewport
   * @param {Function} callbacks.onLeaveBack - Fired when scrolling back out of viewport
   */
  bind({ onEnter, onLeave, onEnterBack, onLeaveBack } = {}) {
    if (!this.view) {
      this.logger.trace("No view available to bind triggers");
      return;
    }

    // Kill existing trigger if any
    if (this._trigger) {
      this._trigger.kill();
    }

    const triggerDefaults = this.getTriggerDefaults();

    // Build vars with callbacks
    const vars = {
      ...triggerDefaults,
      trigger: this.view,
      onEnter: onEnter ?? triggerDefaults.onEnter,
      onLeave: onLeave ?? triggerDefaults.onLeave,
      onEnterBack: onEnterBack ?? triggerDefaults.onEnterBack,
      onLeaveBack: onLeaveBack ?? triggerDefaults.onLeaveBack,
    };

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
