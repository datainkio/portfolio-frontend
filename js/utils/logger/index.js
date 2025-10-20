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
  clearConsole: () => Logger.getInstance().clearConsole(),
  group: fn => Logger.getInstance().group(fn),
  showScriptOutline: (operationName, scriptSequence, mode = 'brief', style = 'headsup') =>
    Logger.getInstance().showScriptOutline(operationName, scriptSequence, mode, style),
  get enabled() {
    return Logger.getInstance().enabled;
  },
  set enabled(value) {
    Logger.getInstance().enabled = value;
  },
};

// Export classes and styles for advanced usage
export { Logger, LoggerStyle, LoggerStyles };
