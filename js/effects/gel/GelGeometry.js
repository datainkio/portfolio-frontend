/**
 * ---
 * aix:
 *   id: frontend.js.effects.gel.gelgeometry
 *   role: Frontend runtime module: js/effects/gel/GelGeometry.js
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
 * GelGeometry - Handles polygon geometry, measurement, and viewBox updates.
 * Keeps masking math isolated from visual state and mask application concerns.
 */
export default class GelGeometry {
  constructor(view) {
    this.view = view;
    this.corners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 },
    };
    this.svg = null;
    this.polygons = [];
    this.backgroundRect = null;
  }

  /**
   * Store mask elements so geometry refreshes update the right nodes.
   */
  setMaskElements(svg, ...nodes) {
    this.svg = svg;
    this.polygons = nodes.filter(Boolean).filter(node => node.tagName === 'polygon');
    this.backgroundRect = nodes.find(node => node.tagName === 'rect') || this.backgroundRect;
    this.refresh();
  }

  /**
   * Update SVG viewBox to match element dimensions.
   */
  updateViewBox() {
    if (!this.svg) return;
    const { width, height } = this._measure();
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.setAttribute('preserveAspectRatio', 'none');
    if (this.backgroundRect) {
      this.backgroundRect.setAttribute('width', width);
      this.backgroundRect.setAttribute('height', height);
    }
    return { width, height };
  }

  /**
   * Update polygon points based on current corners.
   */
  updatePolygonPoints() {
    if (!this.polygons.length) return;
    const { width, height } = this._measure();
    const pts = [
      this.corners.topLeft,
      this.corners.topRight,
      this.corners.bottomRight,
      this.corners.bottomLeft,
    ].map(({ x, y }) => `${(x / 100) * width},${(y / 100) * height}`);
    this.polygons.forEach(poly => poly.setAttribute('points', pts.join(' ')));
  }

  /**
   * Reset to rectangle corners.
   */
  resetCorners() {
    Object.assign(this.corners, {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 },
    });
    this.updatePolygonPoints();
  }

  /**
   * Refresh viewBox and polygon positions.
   */
  refresh() {
    this.updateViewBox();
    this.updatePolygonPoints();
  }

  /**
   * Measure the element dimensions.
   * @private
   */
  _measure() {
    const rect = this.view.getBoundingClientRect();
    const width = rect.width || this.view.offsetWidth || 100;
    const height = rect.height || this.view.offsetHeight || 100;
    return { width, height };
  }
}
