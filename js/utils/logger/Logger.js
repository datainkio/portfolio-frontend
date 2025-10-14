/** @format */

import chalk from 'chalk';
import LoggerStyles from './LoggerStyles.js';

/**
 * Logger Utility Class (Singleton)
 *
 * A debugging utility that outputs to both terminal and console with configurable verbosity.
 * Implemented as a singleton to ensure consistent logging state across the application.
 * Uses LoggerStyles for semantic color formatting.
 *
 * @example
 * import logger from './js/utils/logger/index.js';
 *
 * logger.trace('User data:', { name: 'John', age: 30 }, 'verbose');
 * logger.trace('Quick check:', someValue); // defaults to 'brief'
 * logger.trace('Hidden:', secretData, 'silent');
 *
 * // Toggle logging
 * logger.enabled = false; // Disable all logging
 * logger.enabled = true;  // Re-enable logging
 */
class Logger {
  static #instance = null;
  static #initialized = false;
  #indentLevel = 0;

  /**
   * Private constructor - use static methods instead
   * @param {boolean} enabled - Whether logging is enabled (default: true)
   */
  constructor(enabled = true) {
    if (Logger.#instance) {
      return Logger.#instance;
    }

    this.enabled = enabled;
    this.#indentLevel = 0;
    Logger.#instance = this;

    // Display initialization message only once
    if (!Logger.#initialized) {
      const status = this.enabled
        ? chalk.hex(LoggerStyles.SUCCESS)('enabled')
        : chalk.hex(LoggerStyles.ERROR)('disabled');
      const message = `${chalk.hex(LoggerStyles.HEADSUP).bold('Logger')} initialized: ${status}`;

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
   * @param {string} style - Style type: 'standard', 'headsup', 'error', 'success' (default: 'headsup')
   */
  static trace(message, obj, mode = 'brief', style = 'headsup') {
    const instance = Logger.getInstance();
    return instance.trace(message, obj, mode, style);
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
   * Increase indentation level
   */
  indent() {
    this.#indentLevel++;
  }

  /**
   * Decrease indentation level
   */
  outdent() {
    if (this.#indentLevel > 0) {
      this.#indentLevel--;
    }
  }

  /**
   * Reset indentation to zero
   */
  resetIndent() {
    this.#indentLevel = 0;
  }

  /**
   * Get current indentation string
   * @private
   */
  _getIndent() {
    return '  '.repeat(this.#indentLevel);
  }

  /**
   * Execute function with increased indentation
   * Adds separators and newlines before and after the group for visual separation
   * @param {Function} fn - Function to execute
   */
  async group(fn) {
    const isTopLevel = this.#indentLevel === 0;

    if (this.enabled && isTopLevel) {
      console.log(''); // Add newline before separator
      console.log(LoggerStyles.SEPARATOR);
      console.log(''); // Add newline after separator
    }

    this.indent();
    try {
      await fn();
    } finally {
      this.outdent();

      if (this.enabled && isTopLevel) {
        console.log(''); // Add newline before closing separator
        console.log(LoggerStyles.SEPARATOR);
        console.log(''); // Add newline after closing separator
      }
    }
  }

  /**
   * Trace and display object information
   * @param {string} message - User-defined message to display
   * @param {*} obj - Object(s) to trace (any datatype or array of objects)
   * @param {string} mode - Display mode: 'brief', 'verbose', or 'silent' (default: 'brief')
   * @param {string} style - Style type: 'standard', 'headsup', 'error', 'success' (default: 'standard')
   */
  trace(message, obj, mode = 'brief', style = 'standard') {
    // If logging is disabled, do nothing
    if (!this.enabled) {
      return;
    }

    // Silent mode - output nothing
    if (mode === 'silent') {
      return;
    }

    // Get style object based on style name
    const styleObj = this._getStyle(style);

    // Build output based on mode
    let output = '';

    // Add indentation
    const indent = this._getIndent();
    output += indent;

    // Add icon prefix if available
    if (styleObj.icon) {
      output += styleObj.icon.trim() + ' ';
    }

    // Add message prefix with appropriate color
    output += chalk.hex(styleObj.color).bold(message) + ' ';

    // Process object(s)
    if (mode === 'brief') {
      output += this._formatBrief(obj);
    } else if (mode === 'verbose') {
      output += this._formatVerbose(obj, indent);
    }

    // Output to console
    console.log(output);
  }

  /**
   * Get LoggerStyle object based on style name
   * @private
   */
  _getStyle(style) {
    switch (style.toLowerCase()) {
      case 'standard':
        return LoggerStyles.STANDARD;
      case 'headsup':
        return LoggerStyles.HEADSUP;
      case 'error':
        return LoggerStyles.ERROR;
      case 'success':
        return LoggerStyles.SUCCESS;
      default:
        return LoggerStyles.STANDARD;
    }
  }

  /**
   * Format object in brief mode (datatype and value)
   * @private
   */
  _formatBrief(obj) {
    const type = this._getType(obj);
    const value = this._getValue(obj);
    return chalk.hex(LoggerStyles.HEADSUP)(`[${type}]`) + ' ' + chalk.white(value);
  }

  /**
   * Format object in verbose mode (datatype, structure, and properties)
   * @private
   * @param {*} obj - Object to format
   * @param {string} baseIndent - Base indentation for this output
   */
  _formatVerbose(obj, baseIndent = '') {
    const type = this._getType(obj);
    let output = chalk.hex(LoggerStyles.HEADSUP)(`[${type}]`) + '\n';

    if (obj instanceof Error) {
      // Special handling for Error objects - show message, name, and stack
      output += baseIndent + chalk.hex(LoggerStyles.STANDARD)('  Structure: Error\n');
      output += baseIndent + chalk.hex(LoggerStyles.STANDARD)('  Properties:\n');
      output +=
        baseIndent +
        chalk.hex(LoggerStyles.STANDARD)(`    name: `) +
        chalk.hex(LoggerStyles.HEADSUP)(`(string)`) +
        ' ' +
        chalk.white(`"${obj.name}"`) +
        '\n';
      output +=
        baseIndent +
        chalk.hex(LoggerStyles.STANDARD)(`    message: `) +
        chalk.hex(LoggerStyles.HEADSUP)(`(string)`) +
        ' ' +
        chalk.white(`"${obj.message}"`) +
        '\n';
      if (obj.stack) {
        output +=
          baseIndent +
          chalk.hex(LoggerStyles.STANDARD)(`    stack: `) +
          chalk.hex(LoggerStyles.HEADSUP)(`(string)`) +
          ' ' +
          chalk.white(`"${obj.stack}"`) +
          '\n';
      }
    } else if (Array.isArray(obj)) {
      output += baseIndent + chalk.hex(LoggerStyles.STANDARD)('  Structure: Array\n');
      output += baseIndent + chalk.hex(LoggerStyles.STANDARD)(`  Length: ${obj.length}\n`);
      output += baseIndent + chalk.hex(LoggerStyles.STANDARD)('  Values:\n');
      obj.forEach((item, index) => {
        const itemType = this._getType(item);
        const itemValue = this._getValue(item);
        output +=
          baseIndent +
          chalk.hex(LoggerStyles.STANDARD)(`    [${index}] `) +
          chalk.hex(LoggerStyles.HEADSUP)(`(${itemType})`) +
          ' ' +
          chalk.white(itemValue) +
          '\n';
      });
    } else if (typeof obj === 'object' && obj !== null) {
      output += baseIndent + chalk.hex(LoggerStyles.STANDARD)('  Structure: Object\n');
      output += baseIndent + chalk.hex(LoggerStyles.STANDARD)('  Properties:\n');
      for (const [key, value] of Object.entries(obj)) {
        const valueType = this._getType(value);
        const valueStr = this._getValue(value);
        output +=
          baseIndent +
          chalk.hex(LoggerStyles.STANDARD)(`    ${key}: `) +
          chalk.hex(LoggerStyles.HEADSUP)(`(${valueType})`) +
          ' ' +
          chalk.white(valueStr) +
          '\n';
      }
    } else {
      output +=
        baseIndent +
        chalk.hex(LoggerStyles.STANDARD)('  Value: ') +
        chalk.white(this._getValue(obj));
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
    if (obj instanceof Error) return 'error';
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
    if (obj instanceof Error) return `"${obj.message}"`;
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

// Export the Logger class
export { Logger, LoggerStyles };
