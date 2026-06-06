/** @format */

/**
 * AbstractSectionTriggers - Shared foundation for scroll/GSAP triggers per section
 *
 * Manages a collection of triggers and provides lifecycle helpers.
 */

import { ScrollTrigger } from "./gsap.js";
import lumberjack from "/assets/js/utils/lumberjack/index.js";
import { SCROLL_DEFAULTS } from "../config/index/index.js";

export default class AbstractSectionTriggers {
  /** @param {HTMLElement|null} view */
  constructor(view) {
    this.logger = lumberjack.createScoped(this.constructor.name, {
      color: "#28a745",
      enabled: true,
    });
    this.view = view;
    this._trigger = null;
  }

  _getTriggerDefaults() {
    return SCROLL_DEFAULTS;
  }

  /**
   * Bind callbacks to the viewport trigger.
   * Calling bind() multiple times is safe — the previous trigger is killed first.
   */
  bind({ onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate, onRefresh, animation } = {}) {
    if (!this.view) {
      this.logger.trace("No view available to bind triggers");
      return;
    }

    if (this._trigger) {
      this._trigger.kill();
    }

    const triggerDefaults = this._getTriggerDefaults();
    const toggleActions = String(triggerDefaults.toggleActions ?? "")
      .trim()
      .split(/\s+/);
    const [enterAction, leaveAction, enterBackAction, leaveBackAction] = toggleActions;
    const resolveCallback = (action, callback, fallback) =>
      String(action ?? "").toLowerCase() === "none"
        ? undefined
        : (callback ?? fallback);

    const vars = {
      ...triggerDefaults,
      trigger: this.view,
      onEnter: resolveCallback(enterAction, onEnter, triggerDefaults.onEnter),
      onLeave: resolveCallback(leaveAction, onLeave, triggerDefaults.onLeave),
      onEnterBack: resolveCallback(enterBackAction, onEnterBack, triggerDefaults.onEnterBack),
      onLeaveBack: resolveCallback(leaveBackAction, onLeaveBack, triggerDefaults.onLeaveBack),
      onUpdate: onUpdate ?? triggerDefaults.onUpdate,
      onRefresh: onRefresh ?? triggerDefaults.onRefresh,
      ...(animation ? { animation } : {}),
    };

    this._trigger = ScrollTrigger.create(vars);
  }

  kill() {
    this._trigger?.kill();
    this._trigger = null;
  }
}
