/**
 * PromiseResolverQueue
 *
 * Manages a queue of pending Promise resolvers for animation lifecycle gates.
 *
 * Each `run(fn)` call returns a Promise that resolves when:
 * - `flush()` is called (e.g. from a timeline onComplete callback), or
 * - `fn()` returns null/undefined, indicating no animation started (resolves immediately).
 */
export default class PromiseResolverQueue {
  constructor() {
    this._resolvers = [];
  }

  /**
   * Enqueue a resolver and invoke the animation function.
   *
   * If `fn` returns null/undefined (no animation started), the promise
   * resolves immediately and the resolver is removed from the queue.
   *
   * @param {Function} fn - Animation initiator; return value determines whether to queue or resolve immediately
   * @returns {Promise<void>}
   */
  run(fn) {
    return new Promise((resolve) => {
      this._resolvers.push(resolve);
      const result = fn();

      let settled = false;
      const settleNow = () => {
        if (settled) return;
        settled = true;
        this._resolvers = this._resolvers.filter((r) => r !== resolve);
        resolve();
      };

      if (result == null) {
        settleNow();
        return;
      }

      if (typeof result?.then === "function") {
        result
          .then((value) => {
            if (value == null) {
              settleNow();
            }
          })
          .catch(() => {
            settleNow();
          });
      }
    });
  }

  /**
   * Resolve and drain all pending resolvers.
   *
   * Called from timeline onComplete callbacks to unblock awaiting callers.
   * Resolver errors are silently swallowed so lifecycle cannot be interrupted.
   */
  flush() {
    const pending = this._resolvers.splice(0, this._resolvers.length);
    for (const resolve of pending) {
      try {
        resolve();
      } catch {
        // no-op: resolver failures must not break animation lifecycle
      }
    }
  }
}
