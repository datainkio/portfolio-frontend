// Gel.js - Modular controller for gel overlay element
// Manages visual state via CSS color classes and horizontal scale (xScale)

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
    this.transformOrigin = options.transformOrigin || 'left center';
    this.currentState = null;

    gsap.set(this.view, {
      transformOrigin: this.transformOrigin,
      scaleX: options.defaultScaleX ?? 1,
    });
  }

  /**
   * Set gel state (animated)
   * @param {string} name
   * @param {{ colorClass?: string, xScale?: number }} config
   */
  setState(name, config = {}) {
    const { colorClass, xScale } = config;

    if (colorClass) {
      this.view.classList.remove(...this.colorClasses);
      this.view.classList.add(colorClass);
    }

    if (typeof xScale === 'number') {
      gsap.to(this.view, {
        scaleX: xScale,
        duration: 0.35,
        ease: 'power2.out',
      });
    }

    this.currentState = name;
  }

  /**
   * Set gel state instantly (no animation)
   * @param {string} name
   * @param {{ colorClass?: string, xScale?: number }} config
   */
  setImmediate(name, config = {}) {
    const { colorClass, xScale } = config;

    if (colorClass) {
      this.view.classList.remove(...this.colorClasses);
      this.view.classList.add(colorClass);
    }

    if (typeof xScale === 'number') {
      gsap.set(this.view, {
        scaleX: xScale,
        transformOrigin: this.transformOrigin,
      });
    }

    this.currentState = name;
  }
}
