/** @format */

import LoggerStyle from './LoggerStyle.js';

/**
 * LoggerStyles Class
 *
 * Defines semantic style constants for Logger output formatting.
 * Each style includes a color (hex value) and optional emoji icon.
 */
class LoggerStyles {
  /**
   * Standard output - Default informational messages
   * @type {LoggerStyle}
   */
  static STANDARD = new LoggerStyle('#6B7280', '●'); // Gray-500

  /**
   * Heads up output - Important information that needs attention
   * @type {LoggerStyle}
   */
  static HEADSUP = new LoggerStyle('#F59E0B', '⚡'); // Amber-500

  /**
   * Error output - Error messages and failures
   * @type {LoggerStyle}
   */
  static ERROR = new LoggerStyle('#EF4444', '❌'); // Red-500

  /**
   * Success output - Successful operations and confirmations
   * @type {LoggerStyle}
   */
  static SUCCESS = new LoggerStyle('#10B981', '✅'); // Green-500
}

export default LoggerStyles;
