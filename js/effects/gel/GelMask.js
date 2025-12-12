/** @format */

/**
 * GelMask - Manages SVG mask creation and CSS mask application/removal.
 */
export default class GelMask {
  constructor(view, geometry, maskStyle) {
    this.view = view;
    this.geometry = geometry;
    this.maskStyle = maskStyle;
    this.maskId = null;
    this.svg = null;
    this.polygon = null;
    this._applied = false;
  }

  /**
   * Ensure mask DOM exists and geometry is wired to polygon.
   */
  ensure() {
    if (this.svg && this.polygon) return;

    const existingSvg = this.view.querySelector('svg');
    if (existingSvg) {
      this.svg = existingSvg;
      this.polygon = existingSvg.querySelector('polygon');
      const maskId = existingSvg.querySelector('mask')?.id;
      if (maskId) this.maskId = maskId;
      this.geometry.setMaskElements(this.svg, this.polygon);
      return;
    }

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
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
    this.geometry.setMaskElements(svg, polygon);
    mask.appendChild(polygon);
    defs.appendChild(mask);
    svg.appendChild(defs);
    this.view.appendChild(svg);

    this.maskId = mask.id;
    this.svg = svg;
    this.polygon = polygon;
  }

  /**
   * Apply CSS mask styles to the view.
   */
  apply() {
    this.ensure();
    if (!this.maskId || this._applied) return;

    const maskUrl = `url(#${this.maskId})`;
    Object.assign(this.view.style, {
      ...this.maskStyle,
      maskImage: maskUrl,
      WebkitMaskImage: maskUrl,
    });
    this._applied = true;
  }

  /**
   * Remove mask styles, revealing the full background.
   */
  remove() {
    Object.assign(this.view.style, {
      ...this.maskStyle,
      maskImage: 'none',
      WebkitMaskImage: 'none',
    });
    this._applied = false;
  }

  destroy() {
    this.remove();
    this.svg = null;
    this.polygon = null;
  }
}
