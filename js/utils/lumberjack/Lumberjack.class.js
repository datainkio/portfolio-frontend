/** @format */

import LumberjackStyles from './LumberjackStyles.js';
import {
  INDENT_SIZE,
  MAX_ARRAY_PREVIEW,
  MAX_OBJECT_PREVIEW,
  BASE_STYLE,
  DEFAULT_MODE,
  DEFAULT_STYLE,
} from './constants.js';

// Conditional chalk import - only available in Node.js environment
let chalk = null;
try {
  // Dynamic import for Node.js environment
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    chalk = (await import('chalk')).default;
  }
} catch (err) {
  // Chalk not available - browser environment
  chalk = null;
}

/**
 * Lumberjack - Singleton debug logging utility
 *
 * Terminal/console output with semantic styling, auto-indent, and Error detection.
 * Auto-detects environment: Node.js (terminal with chalk) or browser (console with CSS).
 * Use via singleton: `import lumberjack from './lumberjack/index.js'`
 *
 * @class Lumberjack
 * @singleton
 *
 * @example Terminal mode (Node.js)
 * // Uses chalk for colored terminal output
 * lumberjack.trace('Build started', null, 'brief', 'headsup');
 *
 * @example Browser mode (runtime)
 * // Uses console.log with %c CSS styling
 * lumberjack.trace('Animation init', data, 'verbose', 'success');
 *
 * @example Auto-error detection
 * try {
 *   riskyOp();
 * } catch (err) {
 *   lumberjack.trace('Failed:', err, 'verbose'); // Auto-applies error style + stack trace
 * }
 *
 * @example Hierarchical logging
 * await lumberjack.group(async () => {
 *   lumberjack.trace('Parent', data);
 *   // Auto-indented nested logs
 * });
 *
 * @example Custom styles
 * const purple = new LumberjackStyle('#9333EA', '🎨');
 * lumberjack.trace('Message', data, 'brief', purple);
 *
 * @example Scoped logger
 * const scoped = Lumberjack.createScoped('Director');
 * scoped.trace('Init'); // Output: [Director] Init
 */
class Lumberjack {
  static #instance = null;
  static #initialized = false;
  static #isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  // Private instance fields
  #indentLevel = 0;
  #config = {};

  /**
   * Private constructor - use static methods instead
   * @param {boolean|Object} enabled - Whether logging is enabled, or config object
   */
  constructor(enabled = true) {
    if (Lumberjack.#instance) return Lumberjack.#instance;

    // Handle both boolean and config object parameters
    this.#config =
      typeof enabled === 'object'
        ? { enabled: enabled.enabled ?? true, prefix: '', styles: {}, scope: null, ...enabled }
        : { enabled, prefix: '', styles: {}, scope: null };

    this.enabled = this.#config.enabled;
    this.#indentLevel = 0;
    Lumberjack.#instance = this;

    // Display initialization message only once
    if (!Lumberjack.#initialized) {
      const statusColor = this.enabled
        ? LumberjackStyles.SUCCESS.color
        : LumberjackStyles.ERROR.color;
      const statusText = this.enabled ? 'enabled' : 'disabled';

      if (!Lumberjack.#isBrowser && chalk) {
        console.log(
          `${chalk.hex(LumberjackStyles.HEADSUP.color)('Lumberjack')} initialized: ${chalk.hex(statusColor)(statusText)}`
        );
      } else {
        console.log(
          '%cLumberjack %cinitialized: %c' + statusText,
          `color: ${LumberjackStyles.HEADSUP.color}; font-weight: normal`,
          'color: inherit; font-weight: normal',
          `color: ${statusColor}; font-weight: normal`
        );
      }

      Lumberjack.#initialized = true;
    }
  }

  /**
   * Apply color styling based on environment
   * @private
   */
  #style(color, text, options = {}) {
    if (!Lumberjack.#isBrowser && chalk) {
      let styled = chalk.hex(color)(text);
      if (options.bold) styled = chalk.bold(styled);
      return styled;
    }
    return text;
  }

  /**
   * Get the singleton instance
   * @param {boolean} enabled - Whether logging is enabled (only used on first call)
   * @returns {Lumberjack} The singleton Lumberjack instance
   */
  static getInstance(enabled) {
    if (!Lumberjack.#instance) {
      const isEnabled =
        enabled ??
        (typeof process !== 'undefined' && process.env ? process.env.DEBUG === 'true' : true);
      Lumberjack.#instance = new Lumberjack(isEnabled);
    }
    return Lumberjack.#instance;
  }

  /**
   * Configure the Lumberjack instance with new options
   * @param {Object} options - Configuration options
   * @returns {Lumberjack} The configured Lumberjack instance
   */
  static configure(options = {}) {
    const instance = Lumberjack.getInstance();
    Object.assign(instance.#config, options);
    if (options.enabled !== undefined) instance.enabled = options.enabled;
    return instance;
  }

  /**
   * Create a scoped logger that prefixes all messages with scope information
   * Maintains singleton benefits while allowing service-specific customization
   *
   * @param {string} scope - The scope name (e.g., 'Tailwind', 'Figma', 'NavigationBuilder')
   * @param {Object} [options] - Additional configuration for the scoped logger
   * @param {string} [options.prefix] - Optional emoji/icon prefix before scope name
   * @param {string} [options.color] - Optional hex color for the scope string (e.g., '#10B981')
   * @returns {Object} Scoped logger interface with all Lumberjack methods
   *
   * @example
   * const tailwindLogger = Lumberjack.createScoped('Tailwind');
   * const figmaLogger = Lumberjack.createScoped('Figma', { prefix: '🎨', color: '#10B981' });
   *
   * tailwindLogger.trace('CSS compilation started'); // "[Tailwind] CSS compilation started"
   * figmaLogger.trace('Design tokens fetched');      // "🎨 [Figma] Design tokens fetched" (green scope)
   */
  static createScoped(scope, options = {}) {
    const instance = Lumberjack.getInstance();
    const { color: scopeColor, prefix } = options;
    const rawScopePrefix = prefix ? `${prefix} [${scope}]` : `[${scope}]`;

    return {
      trace: (message, obj = null, mode = DEFAULT_MODE, style = DEFAULT_STYLE) => {
        if (scopeColor && Lumberjack.#isBrowser) {
          return instance._traceScopedBrowser(
            rawScopePrefix,
            message,
            obj,
            mode,
            style,
            scopeColor
          );
        }

        const scopedMessage =
          scopeColor && !Lumberjack.#isBrowser && chalk
            ? `${chalk.hex(scopeColor)(rawScopePrefix)} ${message}`
            : `${rawScopePrefix} ${message}`;

        return instance.trace(scopedMessage, obj, mode, style);
      },

      indent: () => instance.indent(),
      outdent: () => instance.outdent(),
      resetIndent: () => instance.resetIndent(),

      group: async fn => {
        instance.trace(`${rawScopePrefix} Starting grouped operation`, null, 'brief', 'headsup');
        const result = await instance.group(fn);
        instance.trace(`${rawScopePrefix} Completed grouped operation`, null, 'brief', 'success');
        return result;
      },

      showScriptOutline: (operationName, outline) =>
        instance.showScriptOutline(`${scope}: ${operationName}`, outline),

      get enabled() {
        return instance.enabled;
      },
      set enabled(value) {
        instance.enabled = value;
      },

      scope,
      config: { ...instance.#config, scope },
    };
  }

  /**
   * Static trace method for convenience
   */
  static trace(message, obj = null, mode = DEFAULT_MODE, style = 'headsup') {
    return Lumberjack.getInstance().trace(message, obj, mode, style);
  }

  /**
   * Static getter/setter for enabled state
   */
  static get enabled() {
    return Lumberjack.getInstance().enabled;
  }

  static set enabled(value) {
    Lumberjack.getInstance().enabled = value;
  }

  indent() {
    this.#indentLevel++;
  }

  outdent() {
    this.#indentLevel = Math.max(0, this.#indentLevel - 1);
  }

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
   * @param {string|LumberjackStyle} [style='headsup'] - Style for the outline headers
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
    const prefixIcon = styleObj.prefix || '📋';
    const divider = '─'.repeat(50);

    if (!Lumberjack.#isBrowser && chalk) {
      console.log('\n' + chalk.hex(styleObj.color)(prefixIcon) + ` ${operationName.toUpperCase()}`);
      console.log(chalk.gray(divider));
    } else {
      console.log(
        '\n%c' + prefixIcon + '%c ' + operationName.toUpperCase(),
        `color: ${styleObj.color}; font-weight: normal`,
        BASE_STYLE
      );
      console.log('%c' + divider, 'color: #808080; font-weight: normal');
    }

    this.trace(
      'Script Execution Plan:',
      `${scriptSequence.length} scripts will be executed in sequence`,
      'brief',
      'headsup'
    );

    this.group(() => {
      scriptSequence.forEach((script, index) => {
        const stepNumber = `${index + 1}.`;

        if (mode === 'verbose') {
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

          if (script.triggers?.length) {
            this.indent();
            this.trace('Triggers:', script.triggers.join(', '), 'brief', 'standard');
            this.outdent();
          }

          if (script.dependencies?.length) {
            this.indent();
            this.trace('Requires:', script.dependencies.join(', '), 'brief', 'standard');
            this.outdent();
          }
        } else {
          const description = script.description ? ` - ${script.description}` : '';
          this.trace(`${stepNumber} ${script.name}${description}`, null, 'brief', 'standard');
        }
      });
    });

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
    return ' '.repeat(this.#indentLevel * INDENT_SIZE);
  }

  /**
   * Execute function with increased indentation
   * Adds separators and newlines before and after the group for visual separation
   * @param {Function} fn - Function to execute
   */
  async group(fn) {
    const isTopLevel = this.#indentLevel === 0;

    if (this.enabled && isTopLevel) {
      console.log('\n' + LumberjackStyles.SEPARATOR + '\n');
    }

    this.indent();
    try {
      await fn();
    } finally {
      this.outdent();
      if (this.enabled && isTopLevel) {
        console.log('\n' + LumberjackStyles.SEPARATOR + '\n');
      }
    }
  }

  /**
   * Trace and display object information
   * @param {string} message - User-defined message to display
   * @param {*} [obj] - Optional object(s) to trace (any datatype or array of objects)
   * @param {string} [mode='brief'] - Display mode: 'brief', 'verbose', or 'silent'
   * @param {string|LumberjackStyle} [style='standard'] - Style type: 'standard', 'headsup', 'error', 'success', or a custom LumberjackStyle instance
   */
  trace(message, obj = null, mode = 'brief', style = 'standard') {
    if (!this.enabled || mode === 'silent') return;

    // Auto-detect Error objects
    if (style === 'standard' && obj instanceof Error) style = 'error';

    const styleObj = this._getStyle(style);
    const indent = this._getIndent();
    const configPrefix = this.#config.prefix?.trim();
    const hasPrefix = styleObj.prefix && styleObj.prefix !== '';

    if (!Lumberjack.#isBrowser && chalk) {
      // Terminal mode
      let output = indent;
      if (configPrefix) output += `${configPrefix} `;
      if (hasPrefix) {
        output += chalk.hex(styleObj.color)(styleObj.prefix.replace(/\n/g, '\n' + indent));
        if (!styleObj.prefix.match(/\s$/)) output += ' ';
      }
      output += message;

      if (obj != null) {
        output +=
          ' ' +
          (mode === 'brief'
            ? this._getValue(obj, false)
            : '\n' + this._formatVerbosePlain(obj, indent));
      }

      console.log(output);
    } else {
      // Browser mode
      const parts = [];
      const styles = [];

      if (indent || configPrefix) {
        parts.push('%c' + indent + (configPrefix ? `${configPrefix} ` : ''));
        styles.push(BASE_STYLE);
      }

      if (hasPrefix) {
        parts.push('%c' + styleObj.prefix.replace(/\n/g, '\n' + indent));
        styles.push(`color: ${styleObj.color}; font-weight: normal`);
        if (!styleObj.prefix.match(/\s$/)) {
          parts.push('%c ');
          styles.push(BASE_STYLE);
        }
      }

      parts.push('%c' + message);
      styles.push(BASE_STYLE);

      if (obj != null) {
        parts.push(
          '%c ' +
            (mode === 'brief'
              ? this._getValue(obj, false)
              : '\n' + this._formatVerbosePlain(obj, indent))
        );
        styles.push(baseStyle);
      }

      console.log(parts.join(''), ...styles);
    }
  }

  /**
   * Special trace method for scoped loggers in browser with custom scope color
   * @private
   * @param {string} scopePrefix - The scope prefix string (e.g., "[Director]")
   * @param {string} message - The message to display
   * @param {*} obj - Optional object to trace
   * @param {string} mode - Display mode
   * @param {string} style - Style type
   * @param {string} scopeColor - Hex color for the scope
   */
  _traceScopedBrowser(scopePrefix, message, obj, mode, style, scopeColor) {
    if (!this.enabled || mode === 'silent') return;
    if (style === 'standard' && obj instanceof Error) style = 'error';

    const styleObj = this._getStyle(style);
    const indent = this._getIndent();
    const parts = [];
    const styles = [];

    if (indent) {
      parts.push('%c' + indent);
      styles.push(BASE_STYLE);
    }

    const configPrefix = this.#config.prefix?.trim();
    if (configPrefix) {
      parts.push('%c' + configPrefix + ' ');
      styles.push(BASE_STYLE);
    }

    if (styleObj.prefix) {
      parts.push('%c' + styleObj.prefix.replace(/\n/g, '\n' + indent));
      styles.push(`color: ${styleObj.color}; font-weight: normal`);
      if (!styleObj.prefix.match(/\s$/)) {
        parts.push('%c ');
        styles.push(BASE_STYLE);
      }
    }

    parts.push('%c' + scopePrefix);
    styles.push(`color: ${scopeColor}; font-weight: normal`);

    parts.push('%c ' + message);
    styles.push(BASE_STYLE);

    if (obj != null) {
      parts.push(
        '%c ' +
          (mode === 'brief'
            ? this._getValue(obj, false)
            : '\n' + this._formatVerbosePlain(obj, indent))
      );
      styles.push(BASE_STYLE);
    }

    console.log(parts.join(''), ...styles);
  }

  _getStyle(style) {
    return style?.color && style.prefix !== undefined ? style : LumberjackStyles.getStyle(style);
  }

  _formatBriefPlain(obj) {
    return this._getValue(obj, false);
  }

  _formatVerbosePlain(obj, baseIndent = '') {
    return this._formatVerbose(obj, baseIndent, '#000000');
  }

  _formatVerbose(obj, baseIndent = '', color) {
    const type = this._getType(obj);
    const styleColor = text => (!Lumberjack.#isBrowser && chalk ? chalk.hex(color)(text) : text);

    let output = styleColor(`[${type}]`) + '\n';

    if (obj instanceof Error) {
      output += baseIndent + styleColor('  Structure: Error\n');
      output += baseIndent + styleColor('  Properties:\n');
      output += baseIndent + styleColor(`    name: (string) "${obj.name}"\n`);
      output += baseIndent + styleColor(`    message: (string) "${obj.message}"\n`);
      if (obj.stack) {
        output += baseIndent + styleColor(`    stack: (string) "${obj.stack}"\n`);
      }
    } else if (Array.isArray(obj)) {
      output += baseIndent + styleColor(`  Structure: Array\n  Length: ${obj.length}\n  Values:\n`);
      obj.forEach((item, index) => {
        output +=
          baseIndent +
          styleColor(`    [${index}] (${this._getType(item)}) ${this._getValue(item)}\n`);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      output += baseIndent + styleColor('  Structure: Object\n  Properties:\n');
      for (const [key, value] of Object.entries(obj)) {
        output +=
          baseIndent +
          styleColor(`    ${key}: (${this._getType(value)}) ${this._getValue(value)}\n`);
      }
    } else {
      output += baseIndent + styleColor(`  Value: ${this._getValue(obj)}`);
    }

    return output;
  }

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

  _getValue(obj, quoteStrings = true) {
    if (obj == null) return String(obj);
    if (obj instanceof Error) return quoteStrings ? `"${obj.message}"` : obj.message;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.length <= MAX_ARRAY_PREVIEW
        ? `[${obj.map(v => this._getValue(v, quoteStrings)).join(', ')}]`
        : `[${obj.length} items]`;
    }

    if (obj instanceof Date) return obj.toISOString();

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      return keys.length <= MAX_OBJECT_PREVIEW
        ? `{ ${keys.map(k => `${k}: ${this._getValue(obj[k], quoteStrings)}`).join(', ')} }`
        : `{ ${keys.length} properties }`;
    }

    if (typeof obj === 'string') return quoteStrings ? `"${obj}"` : obj;
    if (typeof obj === 'function') return `[Function: ${obj.name || 'anonymous'}]`;

    return String(obj);
  }
}

// Export the Lumberjack class
export { Lumberjack, LumberjackStyles };
