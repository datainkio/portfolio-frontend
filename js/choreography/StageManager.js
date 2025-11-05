/**
 * StageManager - Master Scroll & Visual Effects Controller
 *
 * Orchestrates site-wide scroll smoothing, background video, overlay effects,
 * and cross-section animation timing. The backbone of the site's animation system.
 *
 * KEY RESPONSIBILITIES:
 * - ScrollSmoother initialization (auto-detected from HTML structure)
 * - Background video and overlay system management
 * - Cross-section scroll trigger coordination
 * - Biography list item reveal animations
 *
 * CRITICAL DEPENDENCIES:
 * - HTML: #smooth-wrapper, #smooth-content containers (optional for smooth scroll)
 * - Video: /assets/video/sizzle.mp4 (web-optimized MP4)
 * - CSS: .bg-video, .bg-gel-*, .bg-pixelator classes
 * - Sections: #main-header, #biography elements
 *
 * @requires gsap/all.js - GSAP animation library
 * @requires ScrollSmoother.js - Site-wide smooth scrolling
 * @requires ScrollTrigger.js - Scroll-based animation triggers
 */

import { gsap } from '/assets/js/gsap/all.js';
import { ScrollSmoother } from '/assets/js/gsap/ScrollSmoother.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import lumberjack from '/assets/js/utils/lumberjack/index.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

/**
 * Configuration constants
 *
 * VIDEO_URL: Background video file (must be web-optimized MP4)
 * HEADER_ID/WORK_ID: Section elements for scroll triggers
 *
 * ScrollSmoother auto-enables when BOTH #smooth-wrapper and #smooth-content exist.
 * Omit these elements to use native browser scroll.
 */
const HEADER_ID = 'main-header';
const WORK_ID = 'work';
const VIDEO_URL = '/assets/video/sizzle.mp4';

/**
 * StageManager - Master Animation Coordinator
 *
 * Manages scroll smoothing, background video, overlay effects, and animation timing.
 *
 * Initialization: initView() → initTriggers()
 * Properties: _container, _view, _video, _smoother
 */
export default class StageManager {
  constructor() {
    this._container = null; // ScrollSmoother content container
    this._view = null; // Overlay container for visual effects
    this._video = null; // Background video element
    this._smoother = null; // ScrollSmoother instance (null if disabled)

    this.initView(); // Create DOM structure and visual effects
    this.initTriggers(); // Configure scroll system and animations
  }

  /**
   * Initialize background effects system
   *
   * Finds overlay-view element (created by NJK template) and stores references.
   * Requires #overlay-view and #smooth-content elements. Gracefully fails if missing.
   *
   * Visual stack (z-index order):
   * - overlay-view: Grid pattern background (-z-10)
   * - video: Background video (inside overlay-view)
   * - site content: Above overlay
   */
  initView() {
    lumberjack.trace('Initializing background effects system', null, 'brief', 'headsup');

    this._container = document.getElementById('smooth-content');
    if (!this._container) {
      lumberjack.trace(
        'smooth-content element not found - overlay system disabled',
        null,
        'brief',
        'error'
      );
      return;
    }

    this._view = document.getElementById('overlay-view');
    if (!this._view) {
      lumberjack.trace(
        'overlay-view element not found - ensure overlay-view.njk is included',
        null,
        'brief',
        'error'
      );
      return;
    }

    lumberjack.trace('Background effects system initialized', null, 'brief', 'success');
  }

  /**
   * Initialize scroll system and animations
   *
   * Auto-detects ScrollSmoother availability (#smooth-wrapper + #smooth-content).
   * Sets up scroll triggers for overlay pinning, hero outro, and biography reveals.
   *
   * Works with or without ScrollSmoother - all triggers are independent.
   */
  initTriggers() {
    // Auto-detect ScrollSmoother requirements
    const smoothWrapper = document.getElementById('smooth-wrapper');
    const smoothContent = document.getElementById('smooth-content');
    const canEnableSmoothScroll = smoothWrapper && smoothContent;

    if (canEnableSmoothScroll) {
      this._smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        effects: false, // Disable parallax, only smooth scrolling
      });
      lumberjack.trace('ScrollSmoother enabled', null, 'brief', 'success');
    } else {
      lumberjack.trace('ScrollSmoother disabled - using native scroll', null, 'brief', 'standard');
    }
  }

  /**
   * Get ScrollSmoother instance
   * @returns {ScrollSmoother|null} Instance or null if disabled
   */
  getSmoother() {
    return this._smoother;
  }
}
