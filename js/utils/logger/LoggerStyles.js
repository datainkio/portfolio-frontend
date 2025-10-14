/** @format */

import LoggerStyle from './LoggerStyle.js';

/**
 * LoggerStyles - Semantic Style Constants
 *
 * Provides predefined, immutable style constants for consistent Logger output formatting.
 * Each style combines a Tailwind-inspired color with an optional semantic icon.
 *
 * Color Palette:
 * - Gray-500 (#6B7280): Neutral informational messages
 * - Amber-500 (#F59E0B): Attention-grabbing warnings/alerts
 * - Red-500 (#EF4444): Error messages and failures
 * - Green-500 (#10B981): Success confirmations
 */
class LoggerStyles {
  /**
   * Decorative separator line for visual grouping
   * @type {string}
   */
  static SEPARATOR = '::::::::::::::::::';

  /**
   * Standard output style - Default informational messages
   * No icon for minimal clutter, gray color for subtle emphasis
   * @type {LoggerStyle}
   */
  static STANDARD = new LoggerStyle('#6B7280');

  /**
   * Heads-up output style - Important information requiring attention
   * Lightning bolt icon for urgency, amber color for visibility
   * @type {LoggerStyle}
   */
  static HEADSUP = new LoggerStyle('#F59E0B', '⚡');

  /**
   * Error output style - Error messages and operation failures
   * X mark icon for clear error indication, red color for severity
   * @type {LoggerStyle}
   */
  static ERROR = new LoggerStyle('#EF4444', '❌');

  /**
   * Success output style - Successful operations and confirmations
   * Check mark icon for positive feedback, green color for success
   * @type {LoggerStyle}
   */
  static SUCCESS = new LoggerStyle('#10B981', '✅');

  /**
   * Get style by name (case-insensitive)
   * @param {string} styleName - Name of style ('standard', 'headsup', 'error', 'success')
   * @returns {LoggerStyle} The requested style or STANDARD if not found
   */
  static getStyle(styleName) {
    const normalized = styleName?.toLowerCase();
    switch (normalized) {
      case 'standard':
        return this.STANDARD;
      case 'headsup':
        return this.HEADSUP;
      case 'error':
        return this.ERROR;
      case 'success':
        return this.SUCCESS;
      default:
        return this.STANDARD;
    }
  }
}

export default LoggerStyles;
