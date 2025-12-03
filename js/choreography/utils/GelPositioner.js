/**
 * GelPositioner - Utility for positioning and sizing gel elements
 *
 * Handles CSS positioning logic for gel elements based on configuration.
 * Supports two positioning modes:
 * 1. Element matching - matches another element's position and dimensions
 * 2. Viewport-relative - positions relative to viewport with alignment
 */

export default class GelPositioner {
  /**
   * Position gel element based on configuration
   * @param {HTMLElement} el - Gel element to position
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
   * Match gel element's position and size to reference element
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
    el.style.height = '100dvh';

    switch (position) {
      case 'top':
        el.style.top = '0';
        el.style.bottom = 'auto';
        el.style.transform = 'none';
        break;
      case 'bottom':
        el.style.top = 'auto';
        el.style.bottom = '0';
        el.style.transform = 'none';
        break;
      case 'center':
        el.style.top = '50%';
        el.style.bottom = 'auto';
        el.style.transform = 'translateY(-50%)';
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
    el.style.width = '100dvw';
    el.style.height = '100%';

    switch (position) {
      case 'left':
        el.style.left = '0';
        el.style.right = 'auto';
        el.style.transform = 'none';
        break;
      case 'right':
        el.style.left = 'auto';
        el.style.right = '0';
        el.style.transform = 'none';
        break;
      case 'center':
        el.style.left = '50%';
        el.style.right = 'auto';
        el.style.transform = 'translateX(-50%)';
        break;
    }
  }

  /**
   * Get transform origin based on reference element
   * @param {HTMLElement} refEl - Reference element
   * @param {string} axis - 'x' or 'y'
   * @returns {string} Transform origin
   */
  static getOriginFromElement(refEl, axis) {
    return axis === 'y' ? 'center top' : 'left center';
  }

  /**
   * Get transform origin based on axis and position
   * @param {string} axis - 'x' or 'y'
   * @param {string|null} position - Alignment
   * @returns {string} Transform origin
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
   * @returns {number} Target as fraction of viewport
   */
  static calculateTarget(refEl, axis) {
    if (axis === 'y') {
      return refEl.offsetHeight / window.innerHeight;
    } else {
      return refEl.offsetWidth / window.innerWidth;
    }
  }
}
