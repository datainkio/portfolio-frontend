/**
 * ---
 * aix:
 *   id: frontend.js.choreography.managers.gelanimationmanager
 *   role: Frontend runtime module: js/choreography/managers/GelAnimationManager.js
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
 * GelAnimationManager - Scroll-driven gel animation coordinator
 * 
 * - [ ] Does this need to create a scroll trigger, or just manage gel instances and let sequences create triggers as needed?
 * - [ ] If the goal is to sync gel animations with sections, does it make sense to create configurations that can be animated?
 * 
 * Initializes Gel instances from DOM elements and creates scroll-triggered
 * animations. Delegates positioning logic to GelManipulator and uses the
 * imported GEL_CONFIG for per-element settings.
 *
 * INITIALIZATION:
 * - Scans DOM for elements with class .bg-gel
 * - Matches each element's ID with config entry (e.g., id="bg-gel-0" → config['bg-gel-0'])
 * - Creates Gel instance per element with positioning and animation setup
 *
 * CONFIGURATION FORMAT:
 * ```javascript
 * {
 *   'bg-gel-0': { target: 1/6, axis: 'x', position: 'left' },
 *   'bg-gel-1': { axis: 'y', targetElement: '#main-title', position: 'center' }
 * }
 * ```
 *
 * CONFIG PROPERTIES:
 * - target: Viewport fraction (0-1) for animation scale endpoint
 * - axis: 'x' (horizontal) or 'y' (vertical) animation direction
 * - targetElement: CSS selector to match element dimensions (overrides target)
 * - position: Alignment origin ('left'/'center'/'right' or 'top'/'center'/'bottom')
 *
 * USAGE:
 * ```javascript
 * import GelAnimationManager from './GelAnimationManager.js';
 * import { GEL_CONFIG } from '../config.js';
 * import { gsap, ScrollTrigger } from '../vendor/gsap.js';
 *
 * const manager = new GelAnimationManager(GEL_CONFIG);
 * manager.initialize();
 * manager.animate('#smooth-wrapper'); // Enable scroll animations
 * ```
 *
 * @fileoverview Gel animation orchestrator for background visual effects
 */

import { gsap, ScrollTrigger } from "/assets/js/choreography/vendor/gsap.js";
import { Gel, GelManipulator } from "/assets/js/effects/gel/index.js";
import { GEL_CONFIG } from "/assets/js/choreography/config.js";

gsap.registerPlugin(ScrollTrigger);

export default class GelAnimationManager {
  /**
   * @param {Object} gelConfig - Map of gel IDs to config objects
   * @param {ReducedMotionHandler} reducedMotionHandler - Reduced motion coordinator
   */
  constructor(gelConfig = GEL_CONFIG, reducedMotionHandler = null) {
    this._config = gelConfig;
    this._reducedMotionHandler = reducedMotionHandler;
    this._gels = [];
    this._gelConfigs = new Map();
    this._trigger = null;
    this._onResize = this._handleResize.bind(this);

    if (reducedMotionHandler) {
      this._unsubscribe = reducedMotionHandler.onChange((enabled) => {
        if (enabled) {
          this.destroy();
        }
      });
    }
  }

  /**
   * Initialize gel controllers from DOM elements with bg-gel class
   */
  initialize() {
    const gelElements = document.querySelectorAll(".bg-gel");
    this._gels = Array.from(gelElements)
      .map((el) => this._initializeGelFromElement(el))
      .filter((gel) => gel !== null);

    // Draw a triangle mask on the third gel because why the hell not
    this._gels[2].setCorner("topLeft", 50, 0, 0.6, "power3.out");
    this._gels[2].setCorner("topRight", 50, 0, 0.6, "power3.out");
    // this._gels[2].setCorner('bottomRight', 100, 100, 0.6, 'power3.out');
    // this._gels[2].setCorner('bottomLeft', 0, 100, 0.6, 'power3.out');

    // Reapply sizing/positioning on resize so viewport-filling gels stay in sync
    window.addEventListener("resize", this._onResize, { passive: true });
  }

  /**
   * Initialize single gel instance from a DOM element
   * @private
   * @param {HTMLElement} el - Gel DOM element
   * @returns {Gel|null}
   */
  _initializeGelFromElement(el) {
    const gelId = el.id;
    if (!gelId || !this._config[gelId]) {
      console.warn(
        "[GelAnimationManager] Missing config for gel element",
        gelId,
      );
      return null;
    }

    const configEntry = this._config[gelId];
    const {
      axis,
      position,
      target: configTarget,
      targetElement,
      masked,
    } = configEntry;
    const refEl = targetElement ? document.querySelector(targetElement) : null;
    const target =
      configTarget ?? (refEl ? GelManipulator.calculateTarget(refEl, axis) : 1);

    GelManipulator.apply(el, { axis, refEl, position });

    const transformOrigin = refEl
      ? GelManipulator.getOriginFromElement(refEl, axis)
      : GelManipulator.getOriginFromPosition(axis, position);

    const gel = new Gel(el, { transformOrigin, masked });
    gel.target = target;
    gel.axis = axis;

    // Refresh viewBox and polygon after positioning
    gel.refresh();
    this._gelConfigs.set(gel, { el, axis, refEl, position });

    return gel;
  }

  /**
   * Create scroll-driven animation with staggered timing
   * @param {string|undefined} scroller - Scroller selector (undefined for window)
   * @param {string} trigger - Trigger selector
   */
  animate(scroller = undefined, trigger = "body") {
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
      start: "top top",
      end: "+=200vh",
      scrub: true,
      scroller,
      onUpdate: (self) => this._updateGels(self.progress, stagger),
    });
  }

  /** @private */
  _updateGels(progress, stagger) {
    this._gels.forEach((gel, i) => {
      const gelProgress = this._calculateGelProgress(progress, i, stagger);
      const scale = 1 - gelProgress * (1 - gel.target);
      const scaleState =
        gel.axis === "y" ? { yScale: scale } : { xScale: scale };
      gel.setScrollScale(scaleState);
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
  // getTrigger() {
  //   return this._trigger;
  // }

  /** Cleanup animations and references */
  destroy() {
    window.removeEventListener("resize", this._onResize);
    if (this._trigger) {
      this._trigger.kill();
      this._trigger = null;
    }
    this._gels = [];
    this._gelConfigs.clear();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  /** @private */
  _handleResize() {
    if (this._gels.length === 0) return;

    this._gelConfigs.forEach(({ el, axis, refEl, position }, gel) => {
      GelManipulator.apply(el, { axis, refEl, position });
      gel.refresh();
    });
  }

  /** Reduce a gel to a viewport fraction (immediate, not scroll-driven) */
  shrinkGelToViewportFraction(
    gelIndex = 0,
    { x = 1, y = 1, origin = "center" } = {},
  ) {
    if (this._reducedMotionHandler?.isReducedMotion()) return;
    const gel = this._gels[gelIndex];
    // console.log('Shrinking gel', gelIndex, 'to width', x, 'and height', y, 'from the', origin);
    if (!gel) return;

    const scaleState = { x: x, y: y, origin: origin };
    gel.setScale(scaleState);
  }
}
