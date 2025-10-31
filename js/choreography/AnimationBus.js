/**
 * AnimationBus - Central Event Coordination System
 *
 * CRITICAL WARNING: This is the NERVOUS SYSTEM for cross-section animation coordination.
 * If you modify this without understanding event flow, you WILL break:
 * - Section-to-section animation triggering and choreography sequences
 * - Event-driven intro/outro coordination between multiple controllers
 * - Timeline synchronization across Hero, Work, Biography sections
 * - Debug logging and animation state tracking throughout the application
 *
 * ARCHITECTURE NOTES:
 * - Implements publish-subscribe pattern for loose coupling between sections
 * - Allows sections to announce animation state changes without direct dependencies
 * - Enables complex choreography sequences by chaining event listeners
 * - Provides centralized debug logging for animation event flow
 *
 * EVENT NAMING CONVENTION:
 * - section:[name]:intro:start    - Section begins intro animation
 * - section:[name]:intro:complete - Section intro animation finished
 * - section:[name]:outro:start    - Section begins outro animation
 * - section:[name]:outro:complete - Section outro animation finished
 * - section:[name]:scroll:enter   - Section enters viewport via scroll
 * - section:[name]:scroll:exit    - Section exits viewport via scroll
 *
 * USAGE PATTERN:
 * const bus = new AnimationBus();
 *
 * // Listen for events
 * bus.on('section:hero:intro:complete', () => {
 *   console.log('Hero intro done - trigger next section');
 * });
 *
 * // Emit events
 * bus.emit('section:hero:intro:complete', { duration: 1.2 });
 *
 * INTEGRATION DEPENDENCIES:
 * - Section controllers MUST emit events at appropriate animation milestones
 * - Sequence coordinators MUST listen for events to trigger next animations
 * - Event names MUST follow naming convention for debug logging clarity
 *
 * DEBUGGING GOTCHAS:
 * - Check console for "[AnimationBus]" prefixed messages during development
 * - Wildcard listener logs ALL events - disable in production for performance
 * - Memory leaks possible if listeners not removed - use returned unsubscribe function
 * - Event timing critical - emit too early and dependent animations break
 *
 * DO NOT REMOVE: Event emission logging - critical for debugging animation sequences
 * DO NOT CHANGE: Event naming convention - breaks existing choreography sequences
 *
 * @fileoverview Central event bus for animation coordination and choreography
 * @class AnimationBus
 */

export class AnimationBus {
  /**
   * Initialize event bus with listener map
   *
   * CRITICAL INITIALIZATION: Creates the foundation for all event coordination.
   * The listeners Map stores event names as keys and arrays of callbacks as values.
   *
   * INTERNAL STRUCTURE:
   * {
   *   'section:hero:intro:complete': [callback1, callback2],
   *   'section:work:scroll:enter': [callback3]
   * }
   *
   * @constructor
   */
  constructor() {
    /**
     * Map of event names to arrays of listener callbacks
     * @private
     * @type {Map<string, Function[]>}
     */
    this._listeners = new Map();

    /**
     * Debug mode flag - when true, logs all events to console
     * @private
     * @type {boolean}
     */
    this._debug = false;
  }

  /**
   * Register event listener for specific event
   *
   * CRITICAL FUNCTION: Core subscription mechanism for animation coordination.
   * Allows sections and sequences to react to animation state changes.
   *
   * LISTENER LIFECYCLE:
   * 1. Event name registered in listeners Map
   * 2. Callback added to array for that event
   * 3. Returns unsubscribe function for cleanup
   *
   * MEMORY MANAGEMENT:
   * - Always store returned unsubscribe function for cleanup
   * - Call unsubscribe when section destroyed or sequence complete
   * - Prevents memory leaks from orphaned event listeners
   *
   * @param {string} event - Event name to listen for
   * @param {Function} callback - Function to call when event emitted
   * @returns {Function} Unsubscribe function to remove listener
   *
   * @example
   * const unsubscribe = bus.on('section:hero:intro:complete', (data) => {
   *   console.log('Hero intro done', data);
   * });
   *
   * // Later, cleanup
   * unsubscribe();
   */
  on(event, callback) {
    // Create new array for event if doesn't exist yet
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }

    // Add callback to listeners array for this event
    this._listeners.get(event).push(callback);

    // Return unsubscribe function for cleanup
    // Uses closure to capture event and callback references
    return () => this.off(event, callback);
  }

  /**
   * Emit event to all registered listeners
   *
   * CRITICAL FUNCTION: Core publish mechanism for animation coordination.
   * Triggers all callbacks registered for the specified event name.
   *
   * EVENT FLOW:
   * 1. Section emits event (e.g., 'section:hero:intro:complete')
   * 2. AnimationBus looks up all listeners for that event
   * 3. Each listener callback executed with provided data
   * 4. Sequence coordinator reacts by triggering next animation
   *
   * DEBUG LOGGING:
   * - When debug enabled, logs event name and data to console
   * - Helps trace animation sequence flow during development
   * - Disable in production for performance
   *
   * @param {string} event - Event name to emit
   * @param {Object} data - Data to pass to listener callbacks (optional)
   *
   * @example
   * // Emit event with data
   * bus.emit('section:hero:intro:complete', {
   *   duration: 1.2,
   *   element: heroElement
   * });
   *
   * // Emit event without data
   * bus.emit('section:work:scroll:enter');
   */
  emit(event, data = {}) {
    // Debug logging when enabled
    if (this._debug) {
      console.log(`[AnimationBus] ${event}`, data);
    }

    // Execute all callbacks registered for this event
    if (this._listeners.has(event)) {
      this._listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // Catch errors to prevent one broken listener from breaking all
          console.error(`[AnimationBus] Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Remove specific event listener
   *
   * CLEANUP FUNCTION: Removes callback from event listeners array.
   * Prevents memory leaks and unwanted event handling.
   *
   * TYPICAL USAGE:
   * - Called automatically by unsubscribe function returned from on()
   * - Rarely called directly unless manual cleanup needed
   *
   * @param {string} event - Event name to remove listener from
   * @param {Function} callback - Specific callback function to remove
   *
   * @example
   * const callback = (data) => console.log(data);
   * bus.on('section:hero:intro:complete', callback);
   *
   * // Later, remove specific listener
   * bus.off('section:hero:intro:complete', callback);
   */
  off(event, callback) {
    if (this._listeners.has(event)) {
      const callbacks = this._listeners.get(event);
      const index = callbacks.indexOf(callback);

      if (index > -1) {
        callbacks.splice(index, 1);

        // Clean up empty arrays to prevent memory bloat
        if (callbacks.length === 0) {
          this._listeners.delete(event);
        }
      }
    }
  }

  /**
   * Enable debug logging for all events
   *
   * DEVELOPMENT HELPER: Logs all emitted events to console for debugging.
   * Helps trace animation sequence flow and identify timing issues.
   *
   * WARNING: Can be very verbose - disable in production for performance.
   *
   * @param {boolean} enabled - True to enable debug logging, false to disable
   *
   * @example
   * // Enable during development
   * bus.enableDebug(true);
   *
   * // Disable before production
   * bus.enableDebug(false);
   */
  enableDebug(enabled = true) {
    this._debug = enabled;
    console.log(`[AnimationBus] Debug logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get count of registered listeners for specific event
   *
   * DIAGNOSTIC HELPER: Returns number of callbacks registered for event.
   * Useful for debugging and detecting memory leaks from orphaned listeners.
   *
   * @param {string} event - Event name to check
   * @returns {number} Number of listeners registered for event
   *
   * @example
   * const count = bus.getListenerCount('section:hero:intro:complete');
   * console.log(`${count} listeners registered`);
   */
  getListenerCount(event) {
    return this._listeners.has(event) ? this._listeners.get(event).length : 0;
  }

  /**
   * Remove all listeners for specific event or all events
   *
   * CLEANUP HELPER: Nuclear option for removing event listeners.
   * Use with caution - can break animation sequences if called incorrectly.
   *
   * @param {string} [event] - Optional event name to clear (clears all if omitted)
   *
   * @example
   * // Clear all listeners for specific event
   * bus.clearListeners('section:hero:intro:complete');
   *
   * // Clear ALL listeners (use with extreme caution)
   * bus.clearListeners();
   */
  clearListeners(event) {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To add new animation events:
 * 1. Follow naming convention: section:[name]:[state]:[phase]
 * 2. Emit event at appropriate animation milestone in section controller
 * 3. Listen for event in sequence coordinator to trigger next animation
 * 4. Document event in sequence file for clarity
 *
 * To debug animation sequence issues:
 * 1. Enable debug logging: bus.enableDebug(true)
 * 2. Check console for event emission order
 * 3. Verify listener count matches expectations
 * 4. Ensure events emitted at correct animation milestones
 * 5. Check for memory leaks with getListenerCount()
 *
 * To prevent memory leaks:
 * 1. Always store unsubscribe function returned by on()
 * 2. Call unsubscribe when section destroyed or sequence ends
 * 3. Use clearListeners() when resetting animation system
 * 4. Monitor listener counts during development
 *
 * To optimize performance:
 * 1. Disable debug logging in production
 * 2. Use specific event names instead of wildcards
 * 3. Remove listeners when no longer needed
 * 4. Avoid heavy computation in event callbacks
 *
 * @fileend AnimationBus.js - Central event coordination system
 */
