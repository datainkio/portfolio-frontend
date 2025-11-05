/** @format */

/**
 * LumberjackStyle - Immutable style configuration
 *
 * Represents color + optional prefix for lumberjack output.
 *
 * @example
 * const purple = new LumberjackStyle('#9333EA', '🎨');
 * lumberjack.trace('Message', data, 'brief', purple);
 *
 * @example Built-in styles (preferred)
 * import { LumberjackStyles } from './lumberjack/index.js';
 * LumberjackStyles.ERROR   // Red with ❌
 * LumberjackStyles.SUCCESS // Green with ✅
 * LumberjackStyles.HEADSUP // Amber with ⚡
 * LumberjackStyles.STANDARD // Gray, no prefix
 */
class LumberjackStyle {
  #color;
  #prefix;

  /**
   * @param {string} color - Hex color (e.g., '#6B7280')
   * @param {string} [prefix=''] - Emoji/symbol prefix
   */
  constructor(color, prefix = '') {
    if (!color || typeof color !== 'string' || !color.startsWith('#')) {
      throw new Error('LumberjackStyle requires valid hex color (e.g., "#6B7280")');
    }

    this.#color = color;
    this.#prefix = prefix;

    Object.freeze(this);
  }

  /** @returns {string} Hex color */
  get color() {
    return this.#color;
  }

  /** @returns {string} Prefix emoji/symbol */
  get prefix() {
    return this.#prefix;
  }
}

export default LumberjackStyle;
