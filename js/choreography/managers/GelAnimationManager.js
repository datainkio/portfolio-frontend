/**
 * GelAnimationManager - Coordinates scroll-driven gel animations
 *
 * Manages Gel instances with staggered scroll animations. Delegates positioning
 * and configuration parsing to utility modules (GelPositioner, GelConfigParser).
 *
 * CONFIG: { target, axis, targetElement, position }
 *
 * - target: viewport fraction (0-1) or auto-calculated from targetElement
 * - axis: 'x' (horizontal/width/xScale) or 'y' (vertical/height/yScale)
 * - targetElement: CSS selector or element to match dimensions/position
 * - position: animation origin/alignment:
 *     - For axis: 'x' (horizontal): 'left', 'center', or 'right' (relative to viewport)
 *     - For axis: 'y' (vertical): 'top', 'center', or 'bottom' (relative to viewport)
 *
 *   Example usage for specifying animation origin:
 *
 *   // Horizontal gel animating from the left edge
 *   { axis: 'x', position: 'left' }
 *
 *   // Horizontal gel animating from the right edge
 *   { axis: 'x', position: 'right' }
 *
 *   // Horizontal gel animating from the horizontal center
 *   { axis: 'x', position: 'center' }
 *
 *   // Vertical gel animating from the top
 *   { axis: 'y', position: 'top' }
 *
 *   // Vertical gel animating from the bottom
 *   { axis: 'y', position: 'bottom' }
 *
 *   // Vertical gel animating from the vertical center
 *   { axis: 'y', position: 'center' }
 *
 * ANIMATION: Gels scale from 1 to target dimension with staggered timing
 *
 * @example
 * const config = {
 *   bgGel_0: { target: 1/6, axis: 'x', position: 'left' },
 *   bgGel_1: { axis: 'y', targetElement: '#hero', position: 'center' },
 *   bgGel_2: { axis: 'x', position: 'right' },
 *   bgGel_3: { axis: 'y', position: 'bottom' }
 * };
 * const manager = new GelAnimationManager(config, reducedMotionHandler);
 * manager.initialize();
 * manager.animate('#smooth-wrapper');
 */

import { gsap } from '/assets/js/gsap/all.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import Gel from '/assets/js/effects/Gel.js';
import GelPositioner from '/assets/js/choreography/utils/GelPositioner.js';
import GelConfigParser from '/assets/js/choreography/utils/GelConfigParser.js';

gsap.registerPlugin(ScrollTrigger);

// Default gel configuration (Tailwind 12-column grid)
const DEFAULT_GEL_CONFIG = {
  bgGel_0: { target: 1 / 6, axis: 'x' }, // 2 columns
  bgGel_1: { target: 7 / 12, axis: 'x' }, // 7 columns
  bgGel_2: { target: 3 / 4, axis: 'x' }, // 9 columns
};

export default class GelAnimationManager {
  /**
   * @param {Object} gelConfig - Map of gel IDs to config objects
   * @param {ReducedMotionHandler} reducedMotionHandler - Reduced motion coordinator
   */
  constructor(gelConfig = DEFAULT_GEL_CONFIG, reducedMotionHandler = null) {
    this._config = gelConfig;
    this._reducedMotionHandler = reducedMotionHandler;
    this._gels = [];
    this._trigger = null;

    if (reducedMotionHandler) {
      this._unsubscribe = reducedMotionHandler.onChange(enabled => {
        if (enabled) {
          this.destroy();
        }
      });
    }
  }

  /**
   * Initialize gel controllers from configuration
   */
  initialize() {
    this._gels = Object.keys(this._config)
      .map(gelId => this._initializeGel(gelId))
      .filter(gel => gel !== null);
  }

  /**
   * Initialize single gel instance
   * @private
   */
  _initializeGel(gelId) {
    const el = document.getElementById(gelId);
    if (!el) return null;

    const parsed = GelConfigParser.parse(this._config[gelId]);
    const { target: configTarget, axis, refEl, position } = parsed;

    // Calculate target as viewport fraction
    let target = configTarget || (refEl ? GelPositioner.calculateTarget(refEl, axis) : 1);

    // Apply CSS positioning
    GelPositioner.apply(el, { axis, refEl, position });

    // Determine transform origin
    const transformOrigin = refEl
      ? GelPositioner.getOriginFromElement(refEl, axis)
      : GelPositioner.getOriginFromPosition(axis, position);

    console.log(`[GelAnimationManager] ${gelId}:`, {
      axis,
      position,
      transformOrigin,
      refEl: refEl?.id || 'none',
    });

    // Create and configure gel
    const gel = new Gel(el, {
      defaultScaleX: axis === 'x' ? 0 : 1,
      defaultScaleY: axis === 'y' ? 0 : 1,
      transformOrigin,
    });

    gel.target = target;
    gel.axis = axis;
    gel.setImmediate('initial', axis === 'y' ? { yScale: 1 } : { xScale: 1 });

    return gel;
  }

  /**
   * Create scroll-driven animation with staggered timing
   * @param {string|undefined} scroller - Scroller selector (undefined for window)
   * @param {string} trigger - Trigger selector
   */
  animate(scroller = undefined, trigger = 'body') {
    if (this._reducedMotionHandler?.isReducedMotion()) return;
    if (this._gels.length === 0) return;

    this._killExistingTrigger();
    this._createScrollTrigger(scroller, trigger);
  }

  /** @private */
  _killExistingTrigger() {
    if (this._trigger) {
      this._trigger.kill();
      this._trigger = null;
    }
  }

  /** @private */
  _createScrollTrigger(scroller, trigger) {
    const stagger = 0.15;

    this._trigger = ScrollTrigger.create({
      trigger,
      start: 'top top',
      end: '+=200vh',
      scrub: true,
      scroller,
      onUpdate: self => this._updateGels(self.progress, stagger),
    });
  }

  /** @private */
  _updateGels(progress, stagger) {
    this._gels.forEach((gel, i) => {
      const gelProgress = this._calculateGelProgress(progress, i, stagger);
      const scale = 1 - gelProgress * (1 - gel.target);
      const scaleState = gel.axis === 'y' ? { yScale: scale } : { xScale: scale };
      gel.setState('scroll-scale', scaleState);
    });
  }

  /** @private */
  _calculateGelProgress(totalProgress, gelIndex, stagger) {
    const gelCount = this._gels.length;
    const gelStart = gelIndex * stagger;
    const gelEnd = 1 - (gelCount - gelIndex - 1) * stagger;
    const progress = (totalProgress - gelStart) / (gelEnd - gelStart);
    return Math.max(0, Math.min(1, progress));
  }

  /** @returns {Gel[]} */
  getGels() {
    return this._gels;
  }

  /** @returns {ScrollTrigger|null} */
  getTrigger() {
    return this._trigger;
  }

  /** Cleanup animations and references */
  destroy() {
    if (this._trigger) {
      this._trigger.kill();
      this._trigger = null;
    }
    this._gels = [];
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

export { DEFAULT_GEL_CONFIG };
