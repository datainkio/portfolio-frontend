/** @format */

/**
 * LoggerStyle Class
 *
 * Represents a single logger style with color and optional icon.
 */
class LoggerStyle {
  /**
   * Create a logger style
   * @param {string} color - Hex color value for terminal output
   * @param {string} [icon=''] - Optional emoji icon to prefix output
   */
  constructor(color, icon = '') {
    this.color = color;
    this.icon = icon;
  }
}

export default LoggerStyle;
