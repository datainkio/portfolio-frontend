/**
 * ---
 * aix:
 *   id: frontend.js.choreography.managers.backgroundlayermanager
 *   role: Frontend runtime module: js/choreography/managers/BackgroundLayerManager.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - managers
 * ---
 */
/**
 * BackgroundLayerManager - Fixed Background Layer Positioning
 *
 * The design calls for a set of HTML elements to behave independently of scroll events.
 * This class ensures background layers (overlay-view, sizzle-background) are properly
 * positioned outside ScrollSmoother's transformed content to maintain position:fixed
 * behavior relative to viewport.
 *
 * PROBLEM:
 * - ScrollSmoother applies transforms to #smooth-content
 * - position:fixed inside transformed elements breaks (anchors to element, not viewport)
 * - Background layers must live outside the transformed container
 *
 * SOLUTION:
 * - Detects if background layers are inside #smooth-content
 * - Moves them to #smooth-wrapper or body
 * - Applies fixed positioning styles
 *
 * USAGE:
 * const manager = new BackgroundLayerManager(['overlay-view', 'sizzle-background']);
 * manager.fix(); // Moves and positions layers
 */
export default class BackgroundLayerManager {
  /**
   * @param {string[]} elementIds - Array of element IDs to manage
   */
  constructor(elementIds = []) {
    this._elementIds = elementIds;
    this._elements = [];
  }

  /**
   * Find all managed elements
   * @private
   */
  _findElements() {
    this._elements = this._elementIds
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null);
  }

  /**
   * Detach background layers from ScrollSmoother content
   * Moves elements to wrapper or body to maintain position:fixed behavior
   * @private
   */
  _detachFromScroller() {
    const scroller = document.getElementById("smooth-content");
    const wrapper = document.getElementById("smooth-wrapper") || document.body;

    this._elements.forEach((el) => {
      // Only move if inside the scroller
      if (scroller && scroller.contains(el) && wrapper) {
        wrapper.appendChild(el);
      }
    });
  }

  /**
   * Apply fixed positioning styles to background layers
   * @private
   */
  _applyFixedStyles() {
    const fixedStyles = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "-10",
    };

    this._elements.forEach((el) => {
      Object.assign(el.style, fixedStyles);
    });
  }

  /**
   * Fix all background layers
   * Call after DOM is ready but before animations start
   */
  fix() {
    this._findElements();
    if (this._elements.length === 0) return;

    this._detachFromScroller();
    this._applyFixedStyles();

    this._elements.forEach((layer) => {
      if (layer) {
        layer.style.position = "fixed";
        layer.style.top = "0";
        layer.style.left = "0";
        layer.style.width = "100%";
        layer.style.height = "100%";
        layer.style.pointerEvents = "none";
        layer.style.zIndex = "-1";
      }
    });
  }

  /**
   * Get managed elements
   * @returns {HTMLElement[]} Array of managed elements
   */
  getElements() {
    return this._elements;
  }
}
