/** @format */

import LumberjackStyle from './LumberjackStyle.js';

/**
 * LumberjackStyles - Predefined semantic styles
 *
 * Immutable style constants for consistent output formatting.
 *
 * @example Usage
 * import { LumberjackStyles } from './lumberjack/index.js';
 * lumberjack.trace('Error occurred', err, 'verbose', 'error'); // String shorthand
 * lumberjack.trace('Success!', data, 'brief', LumberjackStyles.SUCCESS); // Direct constant
 *
 * @example Color palette (Tailwind-inspired)
 * STANDARD - Gray-500 (#6B7280), no prefix
 * HEADSUP  - Amber-500 (#F59E0B), ⚡ prefix
 * ERROR    - Red-500 (#EF4444), ❌ prefix
 * SUCCESS  - Green-500 (#10B981), no prefix
 */
class LumberjackStyles {
  static SEPARATOR = '::::::::::::::::::';

  /** @type {LumberjackStyle} Default neutral style */
  static STANDARD = new LumberjackStyle('#6B7280');

  /** @type {LumberjackStyle} Attention/warning style */
  static HEADSUP = new LumberjackStyle('#F59E0B', '⚡');

  /** @type {LumberjackStyle} Error/failure style */
  static ERROR = new LumberjackStyle('#EF4444', '❌');

  /** @type {LumberjackStyle} Success/confirmation style */
  static SUCCESS = new LumberjackStyle('#10B981');

  /**
   * Get style by name (case-insensitive)
   * @param {string} styleName - 'standard'|'headsup'|'error'|'success'
   * @returns {LumberjackStyle} Matching style or STANDARD if not found
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

export default LumberjackStyles;
