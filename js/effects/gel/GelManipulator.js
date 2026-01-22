/**
 * ---
 * aix:
 *   id: frontend.js.effects.gel.gelmanipulator
 *   role: Frontend runtime module: js/effects/gel/GelManipulator.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - effects
 *     - gel
 * ---
 */
/** @format */

/**
 * GelManipulator - Utility for positioning and manipulating gel elements
 *
 * Pure positioning and sizing logic for overlay elements.
 * No choreography dependencies—can be used in any context requiring
 * element alignment and viewport-relative positioning.
 *
 * Supports two positioning modes:
 * 1. Element matching - matches another element's position and dimensions
 * 2. Viewport-relative - positions relative to viewport with alignment
 */

export default class GelManipulator {
  /**
   * Position element based on configuration
   * @param {HTMLElement} el - Element to position
   * @param {Object} config - Position configuration
   * @param {string} config.axis - 'x' or 'y'
   * @param {HTMLElement|null} config.refEl - Reference element to match
   * @param {string|null} config.position - Alignment ('top'/'center'/'bottom' or 'left'/'center'/'right')
   */
  static apply(el, config) {
    const { axis, refEl, position } = config;

    if (refEl) {
      this._matchElement(el, refEl, axis);
    } else {
      this._applyViewportPosition(el, axis, position);
    }
  }

  /**
   * Match element's position and size to reference element
   * @private
   */
  static _matchElement(el, refEl, axis) {
    const rect = refEl.getBoundingClientRect();

    el.style.position = 'absolute';

    if (axis === 'y') {
      // Match height and vertical position
      el.style.left = '0';
      el.style.right = '0';
      el.style.width = '100%';
      el.style.height = `${rect.height}px`;
      el.style.top = `${rect.top + window.scrollY}px`;
      el.style.transform = 'none';
    } else {
      // Match width and horizontal position
      el.style.top = '0';
      el.style.bottom = '0';
      el.style.height = '100%';
      el.style.width = `${rect.width}px`;
      el.style.left = `${rect.left + window.scrollX}px`;
      el.style.transform = 'none';
    }
  }

  /**
   * Apply viewport-relative positioning with alignment
   * @private
   */
  static _applyViewportPosition(el, axis, position) {
    el.style.position = 'absolute';

    if (axis === 'y') {
      this._applyVerticalPosition(el, position || 'top');
    } else {
      this._applyHorizontalPosition(el, position || 'left');
    }
  }

  /**
   * Apply vertical positioning (top/center/bottom)
   * @private
   */
  static _applyVerticalPosition(el, position) {
    el.style.left = '0';
    el.style.right = '0';
    el.style.width = '100%';

    switch (position) {
      case 'top':
        el.style.height = '100dvh';
        el.style.top = '0';
        el.style.bottom = 'auto';
        el.style.transform = 'none';
        break;
      case 'bottom':
        el.style.height = '100dvh';
        el.style.top = 'auto';
        el.style.bottom = '0';
        el.style.transform = 'none';
        break;
      case 'center':
        el.style.height = '100dvh';
        el.style.top = '0';
        el.style.bottom = '0';
        el.style.marginTop = 'auto';
        el.style.marginBottom = 'auto';
        el.style.transform = 'none';
        break;
    }
  }

  /**
   * Apply horizontal positioning (left/center/right)
   * @private
   */
  static _applyHorizontalPosition(el, position) {
    el.style.top = '0';
    el.style.bottom = '0';
    el.style.height = '100%';

    switch (position) {
      case 'left':
        el.style.width = '100dvw';
        el.style.left = '0';
        el.style.right = 'auto';
        el.style.transform = 'none';
        break;
      case 'right':
        el.style.width = '100dvw';
        el.style.left = 'auto';
        el.style.right = '0';
        el.style.transform = 'none';
        break;
      case 'center':
        el.style.width = '100dvw';
        el.style.left = '0';
        el.style.right = '0';
        el.style.marginLeft = 'auto';
        el.style.marginRight = 'auto';
        el.style.transform = 'none';
        break;
    }
  }

  /**
   * Get transform origin based on reference element
   * @param {HTMLElement} refEl - Reference element
   * @param {string} axis - 'x' or 'y'
   * @returns {string} Transform origin value
   */
  static getOriginFromElement(refEl, axis) {
    return axis === 'y' ? 'center top' : 'left center';
  }

  /**
   * Get transform origin based on axis and position
   * @param {string} axis - 'x' or 'y'
   * @param {string|null} position - Alignment value
   * @returns {string} Transform origin value
   */
  static getOriginFromPosition(axis, position) {
    if (axis === 'y') {
      const pos = position || 'top';
      return `center ${pos}`;
    } else {
      const pos = position || 'left';
      return `${pos} center`;
    }
  }

  /**
   * Calculate target dimension as fraction of viewport
   * @param {HTMLElement} refEl - Reference element
   * @param {string} axis - 'x' or 'y'
   * @returns {number} Target as fraction of viewport (0-1)
   */
  static calculateTarget(refEl, axis) {
    if (axis === 'y') {
      return refEl.offsetHeight / window.innerHeight;
    } else {
      return refEl.offsetWidth / window.innerWidth;
    }
  }
}
