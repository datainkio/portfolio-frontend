/**
 * ---
 * aix:
 *   id: frontend.js.effects.gel.gelmask
 *   role: Frontend runtime module: js/effects/gel/GelMask.js
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
 * GelMask - Manages SVG mask creation and CSS mask application/removal.
 */
export default class GelMask {
  constructor(view, geometry, maskStyle) {
    this.view = view;
    this.geometry = geometry;
    this.maskStyle = maskStyle;
    this.maskId = null;
    this.maskEl = null;
    this.svg = null;
    this.polygon = null;
    this.backgroundRect = null;
    this._applied = false;
    this.inverted = false;
  }

  /**
   * Ensure mask DOM exists and geometry is wired to polygon.
   */
  ensure() {
    if (this.svg && this.polygon) return;

    const existingSvg = this.svg;
    if (existingSvg) {
      this.svg = existingSvg;
      this.polygon = existingSvg.querySelector('polygon');
      this.backgroundRect =
        existingSvg.querySelector('rect[data-role="gel-mask-bg"]') || this._createBackgroundRect();
      const maskEl = existingSvg.querySelector('mask');
      if (maskEl?.id) {
        this.maskId = maskEl.id;
        this.maskEl = maskEl;
      }
      this.geometry.setMaskElements(this.svg, this.polygon, this.backgroundRect);
      this._updateMaskDimensions();
      return;
    }

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('gel-mask');
    Object.assign(svg.style, {
      position: 'absolute',
      width: '0',
      height: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
    });
    const defs = document.createElementNS(ns, 'defs');
    const mask = document.createElementNS(ns, 'mask');
    mask.id = `mask-${this.view.id || Math.random()}`;
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
    mask.setAttribute('mask-type', 'alpha');
    this.maskEl = mask;
    this.backgroundRect = this._createBackgroundRect();
    mask.appendChild(this.backgroundRect);
    const polygon = document.createElementNS(ns, 'polygon');
    polygon.setAttribute('fill', '#FFFFFF');
    this.geometry.setMaskElements(svg, polygon, this.backgroundRect);
    mask.appendChild(polygon);
    defs.appendChild(mask);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    this.maskId = mask.id;
    this.svg = svg;
    this.polygon = polygon;
    this._updateMaskDimensions();
    this._applyPolarity();
  }

  /**
   * Create or fetch the background rect used to control inversion.
   * @private
   */
  _createBackgroundRect() {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.dataset.role = 'gel-mask-bg';
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'black');
    rect.setAttribute('fill-opacity', '0'); // transparent background by default
    rect.setAttribute('vector-effect', 'non-scaling-stroke');
    rect.style.pointerEvents = 'none';
    return rect;
  }

  /**
   * Set mask polarity: normal shows inside polygon, inverted hides polygon area.
   */
  invert(enabled = true) {
    this.inverted = !!enabled;
    this._applyPolarity();
  }

  _applyPolarity() {
    if (!this.backgroundRect || !this.polygon) return;
    if (this.inverted) {
      this.backgroundRect.setAttribute('fill-opacity', '1'); // show everything
      this.polygon.setAttribute('fill-opacity', '0'); // cut out polygon area
    } else {
      this.backgroundRect.setAttribute('fill-opacity', '0'); // hide outside
      this.polygon.setAttribute('fill-opacity', '1'); // show polygon
    }
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
      mask: maskUrl,
      WebkitMask: maskUrl,
      maskImage: maskUrl, // fallback
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
      mask: 'none',
      WebkitMask: 'none',
      WebkitMaskImage: 'none',
    });
    this._applied = false;
  }

  destroy() {
    this.remove();
    this.svg = null;
    this.polygon = null;
    this.maskEl = null;
  }

  /**
   * Keep the mask element sized to the view when using userSpaceOnUse.
   */
  updateMaskDimensions() {
    this._updateMaskDimensions();
  }

  _updateMaskDimensions() {
    if (!this.maskEl) return;
    const rect = this.view.getBoundingClientRect();
    const width = rect.width || this.view.offsetWidth || 0;
    const height = rect.height || this.view.offsetHeight || 0;
    this.maskEl.setAttribute('x', 0);
    this.maskEl.setAttribute('y', 0);
    this.maskEl.setAttribute('width', width);
    this.maskEl.setAttribute('height', height);
  }
}
