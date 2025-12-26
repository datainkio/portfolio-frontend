/** @format */

import { gsap } from '/assets/js/gsap/all.js';

/**
 * GelVisualState - Handles color classes and transform-based scaling.
 */
export default class GelVisualState {
  constructor(view, { colorClasses, transformOrigin }) {
    this.view = view;
    this.colorClasses = colorClasses;
    this.transformOrigin = transformOrigin;
    this.currentColorState = null;
  }

  setScale({ x = 1, y = 1, origin = this.transformOrigin } = {}) {
    // console.log('Setting gel scale:', { x, y, origin });
    gsap.set(this.view, {
      scaleX: x,
      scaleY: y,
      transformOrigin: origin,
    });
  }

  setColorState(colorState) {
    if (!colorState || !this.colorClasses.includes(colorState)) return;
    if (this.currentColorState === colorState) return;

    this.colorClasses.forEach(cls => this.view.classList.toggle(cls, cls === colorState));
    this.currentColorState = colorState;
  }
}
