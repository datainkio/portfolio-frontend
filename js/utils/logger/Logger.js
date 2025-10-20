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
 * - Automatic Error detection and formatting (auto-applies 'error' style when obj is Error)
 * - Hierarchical indentation with indent/outdent/group methods
 * - Brief and verbose output modes
 * - Semantic styling (standard, headsup, error, success)
 * - Custom styles with LoggerStyle instances
 * - Visual group separators for complex operations
 * - Optional object parameter for message-only logging
 *
 * @example
 * import logger from './js/utils/logger/index.js';
 * import { LoggerStyle } from './js/utils/logger/index.js';
 *
 * // With object parameter
 * logger.trace('User data:', { name: 'John', age: 30 }, 'verbose');
 * logger.trace('Quick check:', someValue); // defaults to 'brief'
 *
 * // Error auto-detection (automatically uses 'error' style)
 * try {
 *   somethingRisky();
 * } catch (err) {
 *   logger.trace('Operation failed:', err); // auto-detects Error, uses error style
 *   logger.trace('With verbose:', err, 'verbose'); // shows full stack trace
 * }
 *
 * // Explicit style override (bypasses auto-detection)
 * logger.trace('Custom styling:', error, 'brief', 'success'); // uses success style even for Error
 *
 * // Custom styles with LoggerStyle
 * const customStyle = new LoggerStyle('#9333EA', '🎨'); // Purple with art palette prefix
 * logger.trace('Custom message:', data, 'brief', customStyle);
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
  #config = {};

  // Constants for formatting
  static #INDENT_SIZE = 2;
  static #MAX_ARRAY_PREVIEW = 3;
  static #MAX_OBJECT_PREVIEW = 3;

  /**
   * Private constructor - use static methods instead
   * @param {boolean|Object} enabled - Whether logging is enabled, or config object
   */
  constructor(enabled = true) {
    if (Logger.#instance) {
      return Logger.#instance;
    }

    // Handle both boolean and config object parameters
    if (typeof enabled === 'object') {
      this.#config = {
        enabled: enabled.enabled ?? true,
        prefix: enabled.prefix ?? '',
        styles: enabled.styles ?? {},
        scope: enabled.scope ?? null,
        ...enabled,
      };
      this.enabled = this.#config.enabled;
    } else {
      this.enabled = enabled;
      this.#config = {
        enabled: enabled,
        prefix: '',
        styles: {},
        scope: null,
      };
    }

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
   * Configure the Logger instance with new options
   * Allows runtime configuration changes while maintaining singleton benefits
   *
   * @param {Object} options - Configuration options
   * @param {boolean} [options.enabled] - Enable/disable logging
   * @param {string} [options.prefix] - Default prefix for all messages
   * @param {Object} [options.styles] - Custom style overrides
   * @param {string} [options.scope] - Default scope for logging
   * @returns {Logger} The configured Logger instance
   *
   * @example
   * Logger.configure({
   *   enabled: true,
   *   prefix: '[BUILD]',
   *   scope: 'TailwindCSS'
   * });
   */
  static configure(options = {}) {
    const instance = Logger.getInstance();
    Object.assign(instance.#config, options);

    // Update enabled state if provided
    if (options.enabled !== undefined) {
      instance.enabled = options.enabled;
    }

    return instance;
  }

  /**
   * Create a scoped logger that prefixes all messages with scope information
   * Maintains singleton benefits while allowing service-specific customization
   *
   * @param {string} scope - The scope name (e.g., 'Tailwind', 'Figma', 'NavigationBuilder')
   * @param {Object} [options] - Additional configuration for the scoped logger
   * @returns {Object} Scoped logger interface with all Logger methods
   *
   * @example
   * const tailwindLogger = Logger.createScoped('Tailwind');
   * const figmaLogger = Logger.createScoped('Figma', { prefix: '🎨' });
   *
   * tailwindLogger.trace('CSS compilation started'); // "[Tailwind] CSS compilation started"
   * figmaLogger.trace('Design tokens fetched');      // "🎨 [Figma] Design tokens fetched"
   */
  static createScoped(scope, options = {}) {
    const instance = Logger.getInstance();
    const scopePrefix = options.prefix ? `${options.prefix} [${scope}]` : `[${scope}]`;

    return {
      // Core logging method with scope prefix
      trace: (message, obj = null, mode = 'brief', style = 'standard') => {
        const scopedMessage = `${scopePrefix} ${message}`;
        return instance.trace(scopedMessage, obj, mode, style);
      },

      // Indentation methods
      indent: () => instance.indent(),
      outdent: () => instance.outdent(),
      resetIndent: () => instance.resetIndent(),

      // Group operations with scope awareness
      group: async fn => {
        instance.trace(`${scopePrefix} Starting grouped operation`, null, 'brief', 'headsup');
        const result = await instance.group(fn);
        instance.trace(`${scopePrefix} Completed grouped operation`, null, 'brief', 'success');
        return result;
      },

      // Script outline with scope prefix
      showScriptOutline: (operationName, outline) => {
        const scopedOperationName = `${scope}: ${operationName}`;
        return instance.showScriptOutline(scopedOperationName, outline);
      },

      // Configuration access
      get enabled() {
        return instance.enabled;
      },
      set enabled(value) {
        instance.enabled = value;
      },

      // Expose scope information
      scope,
      config: { ...instance.#config, scope },
    };
  }

  /**
   * Static trace method for convenience
   * @param {string} message - User-defined message to display
   * @param {*} [obj] - Optional object(s) to trace (any datatype or array of objects)
   * @param {string} [mode='brief'] - Display mode: 'brief', 'verbose', or 'silent'
   * @param {string|LoggerStyle} [style='headsup'] - Style type: 'standard', 'headsup', 'error', 'success', or a custom LoggerStyle instance
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
   * Display a script execution outline showing the planned script sequence
   * Provides transparency about what scripts will be called and in what order
   *
   * @param {string} operationName - Name of the overall operation (e.g., "Full Build Process")
   * @param {Array<Object>} scriptSequence - Array of script objects with name, description, dependencies
   * @param {string} [mode='brief'] - Display mode: 'brief' or 'verbose'
   * @param {string|LoggerStyle} [style='headsup'] - Style for the outline headers
   *
   * @example
   * logger.showScriptOutline('Full Build Process', [
   *   { name: 'clean', description: 'Clear build directory', script: 'clearSiteFolder.js' },
   *   { name: 'build:design', description: 'Sync Figma design tokens', script: 'fetchFigma.js', triggers: ['buildCSS.js'] },
   *   { name: 'build:11ty', description: 'Generate static site', script: 'eleventy --quiet' }
   * ]);
   */
  showScriptOutline(operationName, scriptSequence, mode = 'brief', style = 'headsup') {
    if (!this.enabled) return;

    const styleObj = this._getStyle(style);
    const headerColor = styleObj.color;
    const prefixIcon = styleObj.prefix || '📋';

    // Header section
    console.log(chalk.hex(headerColor).bold(`\n${prefixIcon} ${operationName.toUpperCase()}`));
    console.log(chalk.gray('─'.repeat(50)));

    this.trace(
      'Script Execution Plan:',
      `${scriptSequence.length} scripts will be executed in sequence`,
      'brief',
      'headsup'
    );

    // Script sequence outline
    this.group(() => {
      scriptSequence.forEach((script, index) => {
        const stepNumber = `${index + 1}.`;

        if (mode === 'verbose') {
          // Detailed view with script files and descriptions
          this.trace(
            `${stepNumber} ${script.name}`,
            script.description || 'No description provided',
            'brief',
            'standard'
          );

          if (script.script) {
            this.indent();
            this.trace('Executes:', script.script, 'brief', 'standard');
            this.outdent();
          }

          if (script.triggers && script.triggers.length > 0) {
            this.indent();
            this.trace('Triggers:', script.triggers.join(', '), 'brief', 'standard');
            this.outdent();
          }

          if (script.dependencies && script.dependencies.length > 0) {
            this.indent();
            this.trace('Requires:', script.dependencies.join(', '), 'brief', 'standard');
            this.outdent();
          }
        } else {
          // Brief view with just step names and descriptions
          const description = script.description ? ` - ${script.description}` : '';
          this.trace(`${stepNumber} ${script.name}${description}`, null, 'brief', 'standard');
        }
      });
    });

    // Footer with execution note
    this.trace(
      'Execution will begin:',
      'Scripts will run in the order shown above',
      'brief',
      'headsup'
    );
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
   * @param {string|LoggerStyle} [style='standard'] - Style type: 'standard', 'headsup', 'error', 'success', or a custom LoggerStyle instance
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

    // Auto-detect Error objects and use 'error' style if style is default 'standard'
    if (style === 'standard' && obj instanceof Error) {
      style = 'error';
    }

    // Get style object (handles both string names and LoggerStyle instances)
    const styleObj = this._getStyle(style);

    // Build output based on mode
    let output = '';

    // Add indentation
    const indent = this._getIndent();
    output += indent;

    // Add configured prefix first (from Logger configuration)
    if (this.#config.prefix && this.#config.prefix.trim() !== '') {
      output += `${this.#config.prefix.trim()} `;
    }

    // Add style prefix if available (check for non-empty string, allow whitespace-only)
    if (styleObj.prefix !== '' && styleObj.prefix !== undefined && styleObj.prefix !== null) {
      // Replace newlines in prefix with newline + indent to maintain indentation
      const indentedPrefix = styleObj.prefix.replace(/\n/g, '\n' + indent);
      output += indentedPrefix;
      // Only add space if prefix doesn't end with whitespace
      if (!styleObj.prefix.match(/\s$/)) {
        output += ' ';
      }
    }

    // Add message prefix with appropriate color
    output += chalk.hex(styleObj.color).bold(message);

    // Process object(s) if provided
    if (obj !== null && obj !== undefined) {
      output += ' ';
      if (mode === 'brief') {
        output += this._formatBrief(obj, styleObj.color);
      } else if (mode === 'verbose') {
        output += this._formatVerbose(obj, indent, styleObj.color);
      }
    }

    // Output to console
    console.log(output);
  }

  /**
   * Get LoggerStyle object based on style name or return custom LoggerStyle
   * @private
   * @param {string|LoggerStyle} style - Style name or LoggerStyle instance
   * @returns {LoggerStyle} The requested style
   */
  _getStyle(style) {
    // If it's already a LoggerStyle instance, return it
    if (style && typeof style === 'object' && style.color && style.prefix !== undefined) {
      return style;
    }

    // Otherwise, look up by name
    return LoggerStyles.getStyle(style);
  }

  /**
   * Format object in brief mode (value only)
   * @private
   * @param {*} obj - Object to format
   * @param {string} color - Hex color to use for formatting
   * @returns {string} Formatted string with value only
   */
  _formatBrief(obj, color) {
    const value = this._getValue(obj, false); // Don't quote strings in brief mode
    return chalk.hex(color)(value);
  }

  /**
   * Format object in verbose mode (datatype, structure, and properties)
   * @private
   * @param {*} obj - Object to format
   * @param {string} baseIndent - Base indentation for this output
   * @param {string} color - Hex color to use for formatting
   * @returns {string} Formatted multi-line string with full object details
   */
  _formatVerbose(obj, baseIndent = '', color) {
    const type = this._getType(obj);
    const styleColor = chalk.hex(color);

    let output = styleColor(`[${type}]`) + '\n';

    if (obj instanceof Error) {
      // Special handling for Error objects - show message, name, and stack
      output += baseIndent + styleColor('  Structure: Error\n');
      output += baseIndent + styleColor('  Properties:\n');
      output +=
        baseIndent +
        styleColor(`    name: `) +
        styleColor(`(string)`) +
        ' ' +
        styleColor(`"${obj.name}"`) +
        '\n';
      output +=
        baseIndent +
        styleColor(`    message: `) +
        styleColor(`(string)`) +
        ' ' +
        styleColor(`"${obj.message}"`) +
        '\n';
      if (obj.stack) {
        output +=
          baseIndent +
          styleColor(`    stack: `) +
          styleColor(`(string)`) +
          ' ' +
          styleColor(`"${obj.stack}"`) +
          '\n';
      }
    } else if (Array.isArray(obj)) {
      output += baseIndent + styleColor('  Structure: Array\n');
      output += baseIndent + styleColor(`  Length: ${obj.length}\n`);
      output += baseIndent + styleColor('  Values:\n');
      obj.forEach((item, index) => {
        const itemType = this._getType(item);
        const itemValue = this._getValue(item);
        output +=
          baseIndent +
          styleColor(`    [${index}] `) +
          styleColor(`(${itemType})`) +
          ' ' +
          styleColor(itemValue) +
          '\n';
      });
    } else if (typeof obj === 'object' && obj !== null) {
      output += baseIndent + styleColor('  Structure: Object\n');
      output += baseIndent + styleColor('  Properties:\n');
      for (const [key, value] of Object.entries(obj)) {
        const valueType = this._getType(value);
        const valueStr = this._getValue(value);
        output +=
          baseIndent +
          styleColor(`    ${key}: `) +
          styleColor(`(${valueType})`) +
          ' ' +
          styleColor(valueStr) +
          '\n';
      }
    } else {
      output += baseIndent + styleColor('  Value: ') + styleColor(this._getValue(obj));
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
   * @param {boolean} [quoteStrings=true] - Whether to wrap strings in quotes
   * @returns {string} String representation
   */
  _getValue(obj, quoteStrings = true) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (obj instanceof Error) return quoteStrings ? `"${obj.message}"` : obj.message;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      if (obj.length <= Logger.#MAX_ARRAY_PREVIEW) {
        return `[${obj.map(v => this._getValue(v, quoteStrings)).join(', ')}]`;
      }
      return `[${obj.length} items]`;
    }

    if (obj instanceof Date) return obj.toISOString();

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      if (keys.length <= Logger.#MAX_OBJECT_PREVIEW) {
        return `{ ${keys.map(k => `${k}: ${this._getValue(obj[k], quoteStrings)}`).join(', ')} }`;
      }
      return `{ ${keys.length} properties }`;
    }

    if (typeof obj === 'string') return quoteStrings ? `"${obj}"` : obj;
    if (typeof obj === 'function') return `[Function: ${obj.name || 'anonymous'}]`;

    return String(obj);
  }
}

// Export the Logger class
export { Logger, LoggerStyles };
