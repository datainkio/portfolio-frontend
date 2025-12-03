/**
 * GelConfigParser - Parses and normalizes gel configuration
 *
 * Handles backward compatibility and extracts configuration values
 * into a normalized format.
 */

export default class GelConfigParser {
  /**
   * Parse gel configuration into normalized format
   * @param {number|Object} config - Raw configuration
   * @returns {Object} Normalized config with { target, axis, refEl, position }
   */
  static parse(config) {
    // Legacy format: just a number (target fraction)
    if (typeof config === 'number') {
      return {
        target: config,
        axis: 'x',
        refEl: null,
        position: null,
      };
    }

    // Modern format: object with properties
    const { target, axis = 'x', targetElement, position } = config;

    // Resolve reference element if provided
    const refEl = targetElement
      ? typeof targetElement === 'string'
        ? document.querySelector(targetElement)
        : targetElement
      : null;

    return {
      target: target ?? null,
      axis,
      refEl,
      position: position ?? null,
    };
  }

  /**
   * Validate parsed configuration
   * @param {Object} parsed - Parsed configuration
   * @param {string} gelId - Gel element ID (for error messages)
   * @returns {boolean} True if valid
   */
  static validate(parsed, gelId) {
    const { target, refEl } = parsed;

    // Must have either target or refEl
    if (target === null && refEl === null) {
      console.warn(
        `GelConfigParser: No target or targetElement for ${gelId}, defaulting to full size`
      );
      return false;
    }

    // If targetElement was specified but not found, warn
    if (target === null && refEl === null) {
      console.warn(`GelConfigParser: targetElement not found for ${gelId}`);
      return false;
    }

    return true;
  }
}
