/**
 * ---
 * aix:
 *   id: frontend.js.choreography.nullanimationbus
 *   role: Frontend runtime module: js/choreography/NullAnimationBus.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - NullAnimationBus.js
 * ---
 */
/**
 * NullAnimationBus - Null Object Pattern Implementation
 *
 * Provides a no-op AnimationBus implementation for sections that don't have
 * access to the real AnimationBus (e.g., missing DOM elements, test scenarios).
 Issue URL: https://github.com/datainkio/portfolio-frontend/issues/37
 *
 * Implements the same interface as AnimationBus (emit, on, off) but silently
 * discards events and listeners. This eliminates the need for defensive checks
 * throughout the codebase.
 *
 * DESIGN PATTERN: Null Object
 * Instead of checking "if (bus) then emit" everywhere, use NullAnimationBus
 * as a default to make the code cleaner and more predictable.
 *
 * USAGE:
 * import { NullAnimationBus } from './NullAnimationBus.js';
 * import { AnimationBus } from './AnimationBus.js';
 *
 * const bus = actualBus ?? new NullAnimationBus();
 * bus.emit('event:name'); // Safe regardless of bus state
 *
 * @fileoverview Null Object implementation of AnimationBus interface
 */

export default class NullAnimationBus {
  /**
   * No-op emit implementation
   * Silently discards all events
   *
   * @param {string} event - Event name (ignored)
   * @param {*} data - Event payload (ignored)
   */
  emit(event, data) {
    // Intentionally do nothing
  }

  /**
   * No-op listener registration
   * Silently discards all listener registrations
   *
   * @param {string} event - Event name (ignored)
   * @param {Function} callback - Listener callback (ignored)
   * @returns {Function} No-op unsubscribe function
   */
  on(event, callback) {
    // Return no-op unsubscribe function
    return () => {};
  }

  /**
   * No-op listener removal
   * Silently ignores all removal requests
   *
   * @param {string} event - Event name (ignored)
   * @param {Function} callback - Listener callback (ignored)
   */
  off(event, callback) {
    // Intentionally do nothing
  }
}
