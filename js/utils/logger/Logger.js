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
 * Features:
 * - Automatic Error detection and formatting
 * - Hierarchical indentation with indent/outdent/group methods
 * - Brief and verbose output modes
 * - Semantic styling (standard, headsup, error, success)
 * - Visual group separators for complex operations
 * - Optional object parameter for message-only logging
 *
 * @example
 * import logger from './js/utils/logger/index.js';
 *
 * // With object parameter
 * logger.trace('User data:', { name: 'John', age: 30 }, 'verbose');
 * logger.trace('Quick check:', someValue); // defaults to 'brief'
 * logger.trace('Error occurred:', error, 'verbose', 'error');
 *
 * // Message-only (no object)
 * logger.trace('Processing started...', undefined, 'brief', 'headsup');
 * logger.trace('Step completed', null, 'brief', 'success');
 *
 * // Hierarchical logging
 * await logger.group(async () => {
 *   logger.trace('Processing...', 'Step 1', 'brief', 'headsup');
 *   // nested operations...
 * });
 */
class Logger {
  static #instance = null;
  static #initialized = false;

  // Private instance fields
  #indentLevel = 0;

  // Constants for formatting
  static #INDENT_SIZE = 2;
  static #MAX_ARRAY_PREVIEW = 3;
  static #MAX_OBJECT_PREVIEW = 3;

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
   * @param {*} [obj] - Optional object(s) to trace (any datatype or array of objects)
   * @param {string} [mode='brief'] - Display mode: 'brief', 'verbose', or 'silent'
   * @param {string} [style='headsup'] - Style type: 'standard', 'headsup', 'error', 'success'
   */
  static trace(message, obj = null, mode = 'brief', style = 'headsup') {
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
   * @returns {string} Space characters for current indentation level
   */
  _getIndent() {
    return ' '.repeat(this.#indentLevel * Logger.#INDENT_SIZE);
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
   * @param {*} [obj] - Optional object(s) to trace (any datatype or array of objects)
   * @param {string} [mode='brief'] - Display mode: 'brief', 'verbose', or 'silent'
   * @param {string} [style='standard'] - Style type: 'standard', 'headsup', 'error', 'success'
   */
  trace(message, obj = null, mode = 'brief', style = 'standard') {
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
    output += chalk.hex(styleObj.color).bold(message);

    // Process object(s) if provided
    if (obj !== null && obj !== undefined) {
      output += ' ';
      if (mode === 'brief') {
        output += this._formatBrief(obj);
      } else if (mode === 'verbose') {
        output += this._formatVerbose(obj, indent);
      }
    }

    // Output to console
    console.log(output);
  }

  /**
   * Get LoggerStyle object based on style name
   * @private
   * @param {string} style - Style name
   * @returns {LoggerStyle} The requested style
   */
  _getStyle(style) {
    return LoggerStyles.getStyle(style);
  }

  /**
   * Format object in brief mode (datatype and value)
   * @private
   * @param {*} obj - Object to format
   * @returns {string} Formatted string with type and value
   */
  _formatBrief(obj) {
    const type = this._getType(obj);
    const value = this._getValue(obj);
    return chalk.hex(LoggerStyles.HEADSUP.color)(`[${type}]`) + ' ' + chalk.white(value);
  }

  /**
   * Format object in verbose mode (datatype, structure, and properties)
   * @private
   * @param {*} obj - Object to format
   * @param {string} baseIndent - Base indentation for this output
   * @returns {string} Formatted multi-line string with full object details
   */
  _formatVerbose(obj, baseIndent = '') {
    const type = this._getType(obj);
    const typeColor = chalk.hex(LoggerStyles.HEADSUP.color);
    const standardColor = chalk.hex(LoggerStyles.STANDARD.color);

    let output = typeColor(`[${type}]`) + '\n';

    if (obj instanceof Error) {
      // Special handling for Error objects - show message, name, and stack
      output += baseIndent + standardColor('  Structure: Error\n');
      output += baseIndent + standardColor('  Properties:\n');
      output +=
        baseIndent +
        standardColor(`    name: `) +
        typeColor(`(string)`) +
        ' ' +
        chalk.white(`"${obj.name}"`) +
        '\n';
      output +=
        baseIndent +
        standardColor(`    message: `) +
        typeColor(`(string)`) +
        ' ' +
        chalk.white(`"${obj.message}"`) +
        '\n';
      if (obj.stack) {
        output +=
          baseIndent +
          standardColor(`    stack: `) +
          typeColor(`(string)`) +
          ' ' +
          chalk.white(`"${obj.stack}"`) +
          '\n';
      }
    } else if (Array.isArray(obj)) {
      output += baseIndent + standardColor('  Structure: Array\n');
      output += baseIndent + standardColor(`  Length: ${obj.length}\n`);
      output += baseIndent + standardColor('  Values:\n');
      obj.forEach((item, index) => {
        const itemType = this._getType(item);
        const itemValue = this._getValue(item);
        output +=
          baseIndent +
          standardColor(`    [${index}] `) +
          typeColor(`(${itemType})`) +
          ' ' +
          chalk.white(itemValue) +
          '\n';
      });
    } else if (typeof obj === 'object' && obj !== null) {
      output += baseIndent + standardColor('  Structure: Object\n');
      output += baseIndent + standardColor('  Properties:\n');
      for (const [key, value] of Object.entries(obj)) {
        const valueType = this._getType(value);
        const valueStr = this._getValue(value);
        output +=
          baseIndent +
          standardColor(`    ${key}: `) +
          typeColor(`(${valueType})`) +
          ' ' +
          chalk.white(valueStr) +
          '\n';
      }
    } else {
      output += baseIndent + standardColor('  Value: ') + chalk.white(this._getValue(obj));
    }

    return output;
  }

  /**
   * Get the datatype of an object
   * @private
   * @param {*} obj - Object to analyze
   * @returns {string} Datatype name ('null', 'undefined', 'error', 'array', 'date', 'regexp', 'object', or primitive type)
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
   * @param {*} obj - Value to convert to string
   * @returns {string} String representation
   */
  _getValue(obj) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (obj instanceof Error) return `"${obj.message}"`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      if (obj.length <= Logger.#MAX_ARRAY_PREVIEW) {
        return `[${obj.map(v => this._getValue(v)).join(', ')}]`;
      }
      return `[${obj.length} items]`;
    }

    if (obj instanceof Date) return obj.toISOString();

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      if (keys.length <= Logger.#MAX_OBJECT_PREVIEW) {
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
