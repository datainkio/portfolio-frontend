/**
 * NullAnimationBus - Null Object Pattern Implementation
 *
 * Provides a no-op AnimationBus implementation for sections that don't have
 * access to the real AnimationBus (e.g., missing DOM elements, test scenarios).
 * Issue URL: https://github.com/datainkio/portfolio-frontend/issues/37
 *
 * Implements the same interface as AnimationBus (emit, on, off) but silently
 * discards events and listeners. This eliminates the need for defensive checks
 * throughout the codebase.
 *
 * @fileoverview Null Object implementation of AnimationBus interface
 */

export default class NullAnimationBus {
  emit(event, data) {}

  on(event, callback) {
    return () => {};
  }

  off(event, callback) {}
}
