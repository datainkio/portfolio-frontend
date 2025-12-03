// Gel.js - Modular controller for gel overlay element
// Manages visual state via CSS color classes and SVG mask scaling

import { gsap } from '/assets/js/gsap/all.js';
import { ScrollSmoother } from '/assets/js/gsap/ScrollSmoother.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export default class Gel {
  /**
   * @param {HTMLElement} view - The gel DOM element
   * @param {Object} options
   * @param {string[]} [options.colorClasses]
   * @param {number} [options.defaultScaleX]
   * @param {number} [options.defaultScaleY]
   * @param {string} [options.transformOrigin]
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

    // Create SVG mask if it doesn't exist
    this._ensureMask();

    gsap.set(this.maskRect, {
      transformOrigin: this.transformOrigin,
      scaleX: options.defaultScaleX ?? 1,
      scaleY: options.defaultScaleY ?? 1,
      skewX: options.defaultSkewX ?? 0,
    });
  }

  /**
   * Create or find SVG mask for the gel element
   * @private
   */
  _ensureMask() {
    let svg = this.view.querySelector('svg');

    // If no SVG exists, create the mask structure
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.pointerEvents = 'none';

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
      const maskId = `mask-${this.view.id || Math.random().toString(36).substr(2, 9)}`;
      mask.id = maskId;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');

      mask.appendChild(rect);
      defs.appendChild(mask);
      svg.appendChild(defs);

      // Apply mask to the view element
      this.view.style.maskImage = `url(#${maskId})`;
      this.view.style.webkitMaskImage = `url(#${maskId})`;

      this.view.appendChild(svg);
      this.maskRect = rect;
    } else {
      // Find existing rect in SVG
      this.maskRect = svg.querySelector('rect');
      if (!this.maskRect) {
        throw new Error('SVG must contain a rect element for masking');
      }
    }
  }

  /**
   * Set gel state (animated)
   * @param {string} name
   * @param {{ colorClass?: string, xScale?: number, yScale?: number, skewX?: number }} config
   */
  setState(name, config = {}) {
    const { colorClass, xScale, yScale, skewX } = config;

    if (colorClass) {
      this.view.classList.remove(...this.colorClasses);
      this.view.classList.add(colorClass);
    }

    const tween = {};
    if (typeof xScale === 'number') tween.scaleX = xScale;
    if (typeof yScale === 'number') tween.scaleY = yScale;
    if (typeof skewX === 'number') tween.skewX = skewX;
    if (Object.keys(tween).length) {
      gsap.to(this.maskRect, {
        ...tween,
        transformOrigin: this.transformOrigin,
        duration: 0.35,
        ease: 'power2.out',
      });
    }

    this.currentState = name;
  }

  /**
   * Set gel state instantly (no animation)
   * @param {string} name
   * @param {{ colorClass?: string, xScale?: number, yScale?: number, skewX?: number }} config
   */
  setImmediate(name, config = {}) {
    const { colorClass, xScale, yScale, skewX } = config;

    if (colorClass) {
      this.view.classList.remove(...this.colorClasses);
      this.view.classList.add(colorClass);
    }

    const setVals = { transformOrigin: this.transformOrigin };
    if (typeof xScale === 'number') setVals.scaleX = xScale;
    if (typeof yScale === 'number') setVals.scaleY = yScale;
    if (typeof skewX === 'number') setVals.skewX = skewX;
    if (Object.keys(setVals).length > 1) {
      gsap.set(this.maskRect, setVals);
    }

    this.currentState = name;
  }
}
