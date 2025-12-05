/** @format */

/**
 * Gel - Visual controller for gel overlay elements
 *
 * Manages SVG polygon masking, corner manipulation, color states,
 * and GSAP animations for background gel layers.
 *
 * @requires GSAP - Animation library
 */

import { gsap } from '/assets/js/gsap/all.js';

export default class Gel {
  /**
   * @param {HTMLElement} view - The gel DOM element
   * @param {Object} options
   * @param {string[]} [options.colorClasses] - Available color classes
   * @param {string} [options.transformOrigin] - SVG transform origin point
   */
  constructor(view, options = {}) {
    if (!view) throw new Error('Gel requires a DOM element as its view');

    this.view = view;
    this.colorClasses = options.colorClasses || [
      'bg-gel-primary',
      'bg-gel-secondary',
      'bg-gel-accent',
    ];
    this.transformOrigin = options.transformOrigin || 'right center';
    this.currentState = null;
    this.targetElement = options.targetElement || null;

    // Track polygon corner positions (percentages 0-100)
    this.corners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 },
    };

    // Animation properties

    this._ensureMask();
  }

  /**
   * Create or find SVG mask for the gel element
   * @private
   */
  _ensureMask() {
    let svg = this.view.querySelector('svg');
    if (!svg) {
      const ns = 'http://www.w3.org/2000/svg';
      svg = document.createElementNS(ns, 'svg');
      svg.classList.add('gel-mask');
      Object.assign(svg.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      });
      const defs = document.createElementNS(ns, 'defs');
      const mask = document.createElementNS(ns, 'mask');
      mask.id = `mask-${this.view.id || Math.random()}`;
      const polygon = document.createElementNS(ns, 'polygon');
      polygon.setAttribute('fill', 'white');
      this._updatePolygonPoints(polygon);
      mask.appendChild(polygon);
      defs.appendChild(mask);
      svg.appendChild(defs);
      this.view.appendChild(svg);
      this.maskPolygon = polygon;
      this.maskId = mask.id;
      this.svg = svg;
    } else {
      this.maskPolygon = svg.querySelector('polygon');
      const maskId = svg.querySelector('mask')?.id;
      if (maskId) this.maskId = maskId;
      this.svg = svg;
    }
    this._updateViewBox();
    if (this.maskId) {
      this.view.style.maskImage = `url(#${this.maskId})`;
      this.view.style.webkitMaskImage = `url(#${this.maskId})`;
    }
  }

  /**
   * Update SVG viewBox to match element dimensions
   * @private
   */
  _updateViewBox() {
    if (!this.svg) return;

    const width = this.view.offsetWidth || 100;
    const height = this.view.offsetHeight || 100;

    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.setAttribute('preserveAspectRatio', 'none');
  }

  /**
   * Update polygon points based on corners object
   * Converts percentage-based corners to pixel coordinates based on element size
   * @private
   * @param {SVGPolygonElement} polygon - Polygon element to update
   */
  _updatePolygonPoints(polygon = this.maskPolygon) {
    if (!polygon) return;

    const width = this.view.offsetWidth || 100;
    const height = this.view.offsetHeight || 100;
    const pts = [
      this.corners.topLeft,
      this.corners.topRight,
      this.corners.bottomRight,
      this.corners.bottomLeft,
    ].map(({ x, y }) => `${(x / 100) * width},${(y / 100) * height}`);
    polygon.setAttribute('points', pts.join(' '));
  }

  /**
   * Animate a corner to new position
   * @param {string} corner - Corner name: 'topLeft', 'topRight', 'bottomRight', 'bottomLeft'
   * @param {number} x - X coordinate (0-100, percentage)
   * @param {number} y - Y coordinate (0-100, percentage)
   * @param {number} [duration=0.6] - Animation duration in seconds
   * @param {string} [ease='power3.out'] - GSAP easing function
   */
  setCorner(corner, x, y, duration = 0.6, ease = 'power3.out') {
    if (!this.corners[corner]) {
      console.warn(`Gel: Invalid corner name "${corner}"`);
      return;
    }

    gsap.to(this.corners[corner], {
      x,
      y,
      duration,
      ease,
      onUpdate: () => this._updatePolygonPoints(),
      overwrite: 'auto',
    });
  }

  /**
   * Set corner position immediately without animation
   * @param {string} corner - Corner name
   * @param {number} x - X coordinate (0-100)
   * @param {number} y - Y coordinate (0-100)
   */
  setCornerImmediate(corner, x, y) {
    if (!this.corners[corner]) {
      console.warn(`Gel: Invalid corner name "${corner}"`);
      return;
    }

    Object.assign(this.corners[corner], { x, y });
    this._updatePolygonPoints();
  }

  /**
   * Reset all corners to rectangle shape
   */
  resetCorners() {
    Object.assign(this.corners, {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 },
    });
    this._updatePolygonPoints();
  }

  /**
   * Refresh viewBox and polygon after element positioning changes
   * Call this after using GelManipulator to position the gel element
   */
  refresh() {
    this._updateViewBox();
    this._updatePolygonPoints();
  }

  /**
   * Change visual state via color classes
   * @param {string} stateName - State identifier
   * @param {Object} stateConfig - Configuration (unused, for future extensibility)
   */
  setState(stateName, stateConfig = {}) {
    if (this.currentState === stateName) return;

    // Remove previous state classes
    this.colorClasses.forEach(cls => this.view.classList.remove(cls));

    // Apply new state class if it exists in colorClasses
    if (this.colorClasses.includes(stateName)) {
      this.view.classList.add(stateName);
    }

    this.currentState = stateName;
  }

  /**
   * Change the target element for this gel
   * @param {HTMLElement} element - New target element to track
   */
  setTarget(element) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn('Gel: Invalid target element provided');
      return;
    }
    this.targetElement = element;
  }

  /**
   * Update gel's position and size to match its target element
   * @param {number} [duration=0] - Animation duration (0 for immediate)
   * @param {string} [ease='power2.out'] - GSAP easing function
   */
  matchTarget(duration = 0, ease = 'power2.out') {
    if (!this.targetElement) {
      console.warn('Gel: No target element set. Use setTarget() first.');
      return;
    }

    const targetRect = this.targetElement.getBoundingClientRect();
    const props = {
      position: 'fixed',
      left: `${targetRect.left}px`,
      top: `${targetRect.top}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`,
    };

    if (duration > 0) {
      gsap.to(this.view, {
        ...props,
        duration,
        ease,
        onComplete: () => this.refresh(),
      });
    } else {
      Object.assign(this.view.style, props);
      this.refresh();
    }
  }
}
