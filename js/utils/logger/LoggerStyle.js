/** @format */

/**
 * LoggerStyle Class
 *
 * Represents a logger output style with color and optional icon.
 * Immutable once created for consistent styling across the application.
 */
class LoggerStyle {
  #color;
  #icon;

  /**
   * Create a logger style
   * @param {string} color - Hex color value for terminal output (e.g., '#6B7280')
   * @param {string} [icon=''] - Optional emoji icon to prefix output
   */
  constructor(color, icon = '') {
    if (!color || typeof color !== 'string' || !color.startsWith('#')) {
      throw new Error('LoggerStyle requires a valid hex color (e.g., "#6B7280")');
    }

    this.#color = color;
    this.#icon = icon;

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
   * Get the icon value
   * @returns {string} Emoji icon or empty string
   */
  get icon() {
    return this.#icon;
  }
}

export default LoggerStyle;
