/** @format */

import chalk from 'chalk';

/**
 * Logger Utility Class (Singleton)
 *
 * A debugging utility that outputs to both terminal and console with configurable verbosity.
 * Implemented as a singleton to ensure consistent logging state across the application.
 *
 * @example
 * import Logger from './js/utils/Logger.js';
 *
 * Logger.trace('User data:', { name: 'John', age: 30 }, 'verbose');
 * Logger.trace('Quick check:', someValue); // defaults to 'brief'
 * Logger.trace('Hidden:', secretData, 'silent');
 *
 * // Toggle logging
 * Logger.enabled = false; // Disable all logging
 * Logger.enabled = true;  // Re-enable logging
 */
class Logger {
  static #instance = null;
  static #initialized = false;

  /**
   * Private constructor - use static methods instead
   * @param {boolean} enabled - Whether logging is enabled (default: true)
   */
  constructor(enabled = true) {
    if (Logger.#instance) {
      return Logger.#instance;
    }

    this.enabled = enabled;
    Logger.#instance = this;

    // Display initialization message only once
    if (!Logger.#initialized) {
      const status = this.enabled ? chalk.green('enabled') : chalk.red('disabled');
      const message = `${chalk.cyan.bold('Logger')} initialized: ${status}`;

      console.log(message);
      Logger.#initialized = true;
    }
  }

  /**
   * Get the singleton instance
   * @param {boolean} enabled - Whether logging is enabled (only used on first call)
   * @returns {Logger} The singleton Logger instance
   */
  static getInstance(enabled) {
    if (!Logger.#instance) {
      // Use provided value, or check environment, or default to true
      const isEnabled = enabled !== undefined ? enabled : process.env.DEBUG === 'true';
      Logger.#instance = new Logger(isEnabled);
    }
    return Logger.#instance;
  }

  /**
   * Static trace method for convenience
   * @param {string} message - User-defined message to display
   * @param {*} obj - Object(s) to trace (any datatype or array of objects)
   * @param {string} mode - Display mode: 'brief', 'verbose', or 'silent' (default: 'brief')
   */
  static trace(message, obj, mode = 'brief') {
    const instance = Logger.getInstance();
    return instance.trace(message, obj, mode);
  }

  /**
   * Static getter/setter for enabled state
   */
  static get enabled() {
    return Logger.getInstance().enabled;
  }

  static set enabled(value) {
    Logger.getInstance().enabled = value;
  }

  /**
   * Trace and display object information
   * @param {string} message - User-defined message to display
   * @param {*} obj - Object(s) to trace (any datatype or array of objects)
   * @param {string} mode - Display mode: 'brief', 'verbose', or 'silent' (default: 'brief')
   */
  trace(message, obj, mode = 'brief') {
    // If logging is disabled, do nothing
    if (!this.enabled) {
      return;
    }

    // Silent mode - output nothing
    if (mode === 'silent') {
      return;
    }

    // Build output based on mode
    let output = '';

    // Add message prefix unless in silent mode
    output += chalk.yellow.bold(message) + ' ';

    // Process object(s)
    if (mode === 'brief') {
      output += this._formatBrief(obj);
    } else if (mode === 'verbose') {
      output += this._formatVerbose(obj);
    }

    // Output to console and terminal
    console.log(output);
  }

  /**
   * Format object in brief mode (datatype and value)
   * @private
   */
  _formatBrief(obj) {
    const type = this._getType(obj);
    const value = this._getValue(obj);
    return chalk.cyan(`[${type}]`) + ' ' + chalk.white(value);
  }

  /**
   * Format object in verbose mode (datatype, structure, and properties)
   * @private
   */
  _formatVerbose(obj) {
    const type = this._getType(obj);
    let output = chalk.cyan(`[${type}]`) + '\n';

    if (Array.isArray(obj)) {
      output += chalk.gray('  Structure: Array\n');
      output += chalk.gray(`  Length: ${obj.length}\n`);
      output += chalk.gray('  Values:\n');
      obj.forEach((item, index) => {
        const itemType = this._getType(item);
        const itemValue = this._getValue(item);
        output +=
          chalk.gray(`    [${index}] `) +
          chalk.cyan(`(${itemType})`) +
          ' ' +
          chalk.white(itemValue) +
          '\n';
      });
    } else if (typeof obj === 'object' && obj !== null) {
      output += chalk.gray('  Structure: Object\n');
      output += chalk.gray('  Properties:\n');
      for (const [key, value] of Object.entries(obj)) {
        const valueType = this._getType(value);
        const valueStr = this._getValue(value);
        output +=
          chalk.gray(`    ${key}: `) +
          chalk.cyan(`(${valueType})`) +
          ' ' +
          chalk.white(valueStr) +
          '\n';
      }
    } else {
      output += chalk.gray('  Value: ') + chalk.white(this._getValue(obj));
    }

    return output;
  }

  /**
   * Get the datatype of an object
   * @private
   */
  _getType(obj) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (Array.isArray(obj)) return 'array';
    if (obj instanceof Date) return 'date';
    if (obj instanceof RegExp) return 'regexp';
    if (typeof obj === 'object') return 'object';
    return typeof obj;
  }

  /**
   * Get string representation of value
   * @private
   */
  _getValue(obj) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      if (obj.length <= 3) return `[${obj.map(v => this._getValue(v)).join(', ')}]`;
      return `[${obj.length} items]`;
    }
    if (obj instanceof Date) return obj.toISOString();
    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      if (keys.length <= 3) {
        return `{ ${keys.map(k => `${k}: ${this._getValue(obj[k])}`).join(', ')} }`;
      }
      return `{ ${keys.length} properties }`;
    }
    if (typeof obj === 'string') return `"${obj}"`;
    if (typeof obj === 'function') return `[Function: ${obj.name || 'anonymous'}]`;
    return String(obj);
  }
}

// Export singleton instance getter as default
export default {
  trace: (message, obj, mode = 'brief') => Logger.getInstance().trace(message, obj, mode),
  get enabled() {
    return Logger.getInstance().enabled;
  },
  set enabled(value) {
    Logger.getInstance().enabled = value;
  },
};

// Also export the class for advanced usage
export { Logger };
