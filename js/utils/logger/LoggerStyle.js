/** @format */

/**
 * LoggerStyle Class
 *
 * Represents a logger output style with color and optional prefix.
 * Immutable once created for consistent styling across the application.
 */
class LoggerStyle {
  #color;
  #prefix;

  /**
   * Create a logger style
   * @param {string} color - Hex color value for terminal output (e.g., '#6B7280')
   * @param {string} [prefix=''] - Optional prefix string (emoji, symbol, etc.) to prepend to output
   */
  constructor(color, prefix = '') {
    if (!color || typeof color !== 'string' || !color.startsWith('#')) {
      throw new Error('LoggerStyle requires a valid hex color (e.g., "#6B7280")');
    }

    this.#color = color;
    this.#prefix = prefix;

    // Freeze to prevent modification after creation
    Object.freeze(this);
  }

  /**
   * Get the color value
   * @returns {string} Hex color value
   */
  get color() {
    return this.#color;
  }

  /**
   * Get the prefix value
   * @returns {string} Prefix string (emoji, symbol, etc.) or empty string
   */
  get prefix() {
    return this.#prefix;
  }
}

export default LoggerStyle;
