/** @format */

import { Logger, LoggerStyles } from './Logger.js';
import LoggerStyle from './LoggerStyle.js';

// Export singleton instance as default
export default {
  trace: (message, obj = null, mode = 'brief', style = 'standard') =>
    Logger.getInstance().trace(message, obj, mode, style),
  indent: () => Logger.getInstance().indent(),
  outdent: () => Logger.getInstance().outdent(),
  resetIndent: () => Logger.getInstance().resetIndent(),
  group: fn => Logger.getInstance().group(fn),
  get enabled() {
    return Logger.getInstance().enabled;
  },
  set enabled(value) {
    Logger.getInstance().enabled = value;
  },
};

// Export classes and styles for advanced usage
export { Logger, LoggerStyle, LoggerStyles };
