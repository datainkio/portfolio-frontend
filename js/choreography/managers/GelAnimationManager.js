/**
 * GelAnimationManager - Gel Background Animation Controller
 *
 * Manages multiple Gel instances and coordinates their scroll-driven animations.
 * Handles initialization, configuration, and staggered animation on scroll.
 *
 * ARCHITECTURE:
 * - Finds gel elements by ID from configuration
 * - Initializes Gel controllers with target widths
 * - Creates ScrollTrigger for coordinated animation
 * - Staggers gel animations based on scroll progress
 *
 * GEL CONFIGURATION:
 * - Each gel ID maps to target width (as fraction of viewport)
 * - Aligned to Tailwind's 12-column grid system
 * - Default: bgGel_0 (2 cols), bgGel_1 (7 cols), bgGel_2 (9 cols)
 *
 * ANIMATION LOGIC:
 * - Gels start at full width (xScale: 1)
 * - Scale down to target width as user scrolls
 * - Staggered timing creates cascading effect
 * - Scrubbed to scroll position for smooth interaction
 *
 * USAGE:
 * const manager = new GelAnimationManager(gelConfig, reducedMotionHandler);
 * manager.initialize(); // Find and setup gels
 * manager.animate(scrollerElement); // Start scroll animation
 */

import { gsap } from '/assets/js/gsap/all.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import Gel from '/assets/js/effects/Gel.js';

gsap.registerPlugin(ScrollTrigger);

// Default gel configuration: ID mapped to target width (fraction of viewport)
// Aligned to Tailwind's 12-column grid system
const DEFAULT_GEL_CONFIG = {
  bgGel_0: 1 / 6, // 2 columns
  bgGel_1: 7 / 12, // 7 columns
  bgGel_2: 3 / 4, // 9 columns
};

export default class GelAnimationManager {
  /**
   * @param {Object} gelConfig - Map of gel IDs to target widths
   * @param {ReducedMotionHandler} reducedMotionHandler - Reduced motion coordinator
   */
  constructor(gelConfig = DEFAULT_GEL_CONFIG, reducedMotionHandler = null) {
    this._config = gelConfig;
    this._reducedMotionHandler = reducedMotionHandler;
    this._gels = [];
    this._trigger = null;

    // Subscribe to reduced motion changes
    if (reducedMotionHandler) {
      this._unsubscribe = reducedMotionHandler.onChange(enabled => {
        if (enabled) {
          this.destroy();
        }
      });
    }
  }

  /**
   * Find and initialize all gel elements from configuration
   * Sets up Gel controllers with initial state
   */
  initialize() {
    this._gels = Object.keys(this._config)
      .map(gelId => {
        const el = document.getElementById(gelId);
        if (!el) return null;

        const gel = new Gel(el, {
          defaultScaleX: 0,
          transformOrigin: 'left center',
        });

        // Store target width for this gel instance
        gel.targetWidth = this._config[gelId];

        // Initialize to full width (will scale down to target on scroll)
        gel.setImmediate('initial', { xScale: 1 });

        return gel;
      })
      .filter(gel => gel !== null);
  }

  /**
   * Create scroll-driven animation for all gels
   * Uses staggered timing for cascading effect
   *
   * @param {string|undefined} scroller - Scroller element selector (undefined for window)
   * @param {string} trigger - Trigger element selector (default: 'body')
   */
  animate(scroller = undefined, trigger = 'body') {
    // Skip if reduced motion enabled or no gels
    if (this._reducedMotionHandler?.isReducedMotion()) return;
    if (this._gels.length === 0) return;

    // Kill existing trigger if present
    if (this._trigger) {
      this._trigger.kill();
      this._trigger = null;
    }

    const gels = this._gels;
    const gelCount = gels.length;
    const stagger = 0.15; // Fraction of scroll progress per gel

    this._trigger = ScrollTrigger.create({
      trigger,
      start: 'top top',
      end: '+=200vh',
      scrub: true,
      scroller,
      onUpdate: self => {
        const progress = self.progress; // 0 → 1

        gels.forEach((gel, i) => {
          // Each gel starts animating after its staggered offset
          const gelStart = i * stagger;
          const gelEnd = 1 - (gelCount - i - 1) * stagger;

          // Map scroll progress to [0,1] for each gel
          let gelProgress = (progress - gelStart) / (gelEnd - gelStart);
          gelProgress = Math.max(0, Math.min(1, gelProgress));

          // Scale from 1 (full width) to gel's individual target width
          const xScale = 1 - gelProgress * (1 - gel.targetWidth);
          gel.setState('scroll-scale', { xScale });
        });
      },
    });
  }

  /**
   * Get all gel controller instances
   * @returns {Gel[]} Array of Gel controllers
   */
  getGels() {
    return this._gels;
  }

  /**
   * Get ScrollTrigger instance
   * @returns {ScrollTrigger|null} Trigger or null if not created
   */
  getTrigger() {
    return this._trigger;
  }

  /**
   * Cleanup animations and references
   */
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
