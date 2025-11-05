/** @format */

/**
 * Lumberjack - Robust Runtime Console Logging
 *
 * Singleton logging utility with semantic styling, hierarchical output, and automatic error detection.
 *
 * @example Basic usage
 * import lumberjack from './js/utils/lumberjack/index.js';
 * lumberjack.trace('User data:', userData, 'verbose');
 * lumberjack.trace('Processing step 1', null, 'brief', 'success');
 *
 * @example Error auto-detection
 * try {
 *   riskyOperation();
 * } catch (err) {
 *   lumberjack.trace('Failed:', err, 'verbose'); // Auto-applies error style
 * }
 *
 * @example Hierarchical logging
 * await lumberjack.group(async () => {
 *   lumberjack.trace('Parent operation');
 *   lumberjack.indent();
 *   lumberjack.trace('Child operation', data);
 *   lumberjack.outdent();
 * });
 *
 * @example Custom styles
 * import { LumberjackStyle } from './js/utils/lumberjack/index.js';
 * const purple = new LumberjackStyle('#9333EA', '🎨');
 * lumberjack.trace('Custom message', data, 'brief', purple);
 *
 * @example Scoped logger
 * import { Lumberjack } from './js/utils/lumberjack/index.js';
 * const moduleLogger = Lumberjack.createScoped('MyModule');
 * moduleLogger.trace('Module-specific log');
 */

import { Lumberjack, LumberjackStyles } from './Lumberjack.class.js';
import LumberjackStyle from './LumberjackStyle.js';

/**
 * Default lumberjack singleton - use for most logging needs
 */
const lumberjack = {
  /**
   * Log message with optional data
   * @param {string} message - Description
   * @param {*} [obj=null] - Data to log (auto-detects Error objects)
   * @param {'brief'|'verbose'} [mode='brief'] - Detail level
   * @param {string|LumberjackStyle} [style='standard'] - 'standard'|'headsup'|'error'|'success' or custom
   */
  trace: (message, obj = null, mode = 'brief', style = 'standard') =>
    Lumberjack.getInstance().trace(message, obj, mode, style),

  /** Increase indent level */
  indent: () => Lumberjack.getInstance().indent(),

  /** Decrease indent level */
  outdent: () => Lumberjack.getInstance().outdent(),

  /** Reset indent to zero */
  resetIndent: () => Lumberjack.getInstance().resetIndent(),

  /**
   * Execute function with auto-indent
   * @param {Function} fn - Async or sync function
   */
  group: fn => Lumberjack.getInstance().group(fn),

  /**
   * Show formatted operation outline
   * @param {string} operationName - Operation title
   * @param {string[]} scriptSequence - Array of step descriptions
   * @param {'brief'|'verbose'} [mode='brief'] - Detail level
   * @param {string|LumberjackStyle} [style='headsup'] - Style preset or instance
   */
  showScriptOutline: (operationName, scriptSequence, mode = 'brief', style = 'headsup') =>
    Lumberjack.getInstance().showScriptOutline(operationName, scriptSequence, mode, style),

  /**
   * Configure global logger
   * @param {Object} options - { enabled, prefix, styles, scope }
   */
  configure: (options = {}) => Lumberjack.configure(options),

  /**
   * Create scoped logger instance
   * @param {string} scope - Scope name (e.g., 'Director', 'StageManager')
   * @param {Object} [options={}] - Additional config
   * @returns {Object} Scoped logger with same API
   */
  createScoped: (scope, options = {}) => Lumberjack.createScoped(scope, options),

  get enabled() {
    return Lumberjack.getInstance().enabled;
  },
  set enabled(value) {
    Lumberjack.getInstance().enabled = value;
  },
};

export default lumberjack;

// Export classes for advanced usage and custom instances
export { Lumberjack, LumberjackStyle, LumberjackStyles };
