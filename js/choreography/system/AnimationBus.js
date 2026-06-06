/** @format */

/**
 * AnimationBus - Event Coordination for Choreography System
 *
 * Publish-subscribe pattern enabling loose coupling between section animations.
 * Sections emit lifecycle events; coordinators listen to sequence animations.
 *
 * QUICK START:
 * import { AnimationBus } from './system/AnimationBus.js';
 * import { EVENTS } from './config/events.js';
 *
 * // Listen for events
 * AnimationBus.on(EVENTS.hero.introComplete, () => {
 *   // Start next animation
 * });
 *
 * // Emit events
 * AnimationBus.emit(EVENTS.hero.outroComplete);
 *
 * // Cleanup when done
 * const unsubscribe = AnimationBus.on(event, callback);
 * unsubscribe(); // Remove listener
 *
 * EVENT NAMING: Use EVENTS from config/events.js for standardized event names.
 * See config/events.js for full event list and naming conventions.
 *
 * @fileoverview Central event bus for animation coordination
 */
import lumberjack from "/assets/js/utils/lumberjack/index.js";

const LOGS = {
  description:
    "AnimationBus is a publish-subscribe pattern enabling loose coupling between section animations. Sections emit lifecycle events; coordinators listen to sequence animations. Use EVENTS from config/events.js for standardized event names.",
  methods: "",
};
export class AnimationBus {
  constructor() {
    this.logger = lumberjack.createScoped("AnimationBus", {
      color: "#EE6C4D",
    });
    this.logger.trace(LOGS.description);
    this._listeners = new Map();
    this._debug = false;
    this.logger.trace("initialized");
  }

  /**
   * Subscribe to event
   * @param {string} event - Event name (use EVENTS from config/events.js)
   * @param {Function} callback - Handler function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Emit event to all listeners
   * @param {string} event - Event name (use EVENTS from config/events.js)
   * @param {Object} [data={}] - Optional data to pass to listeners
   */
  emit(event, data = {}) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          this.logger.trace(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Unsubscribe from event (usually called via returned unsubscribe function)
   * @param {string} event - Event name
   * @param {Function} callback - Handler to remove
   */
  off(event, callback) {
    if (this._listeners.has(event)) {
      const callbacks = this._listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        if (callbacks.length === 0) {
          this._listeners.delete(event);
        }
      }
    }
  }

  /**
   * Enable/disable debug logging
   * @param {boolean} [enabled=true]
   */
  enableDebug(enabled = true) {
    this._debug = enabled;
  }

  /**
   * Get listener count for event (useful for debugging memory leaks)
   * @param {string} event
   * @returns {number}
   */
  getListenerCount(event) {
    return this._listeners.has(event) ? this._listeners.get(event).length : 0;
  }

  /**
   * Clear all listeners for event (or all events if no event specified)
   * @param {string} [event]
   */
  clearListeners(event) {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
  }
}
