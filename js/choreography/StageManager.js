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
import Gel from '/assets/js/effects/Gel.js';

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
const SMOOTHER_EFFECTS = true; // Disable parallax effects for performance

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
    this._gel = null; // Gel controller instance
    this._smoother = null; // ScrollSmoother instance (null if disabled)
    this._sizzle = null; // Sizzle background element
    this._gelTrigger = null; // ScrollTrigger instance for gel animation
    this._reducedMotion = false; // prefers-reduced-motion flag
    this._mql = null; // MediaQueryList for PRM

    this._setupReducedMotionHandling();
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
    // lumberjack.trace('Initializing background effects system', null, 'brief', 'headsup');
    this._container = document.getElementById('smooth-content');
    this._view = document.getElementById('overlay-view');
    this._sizzle = document.getElementById('sizzle-background');
    this._detachBackgroundLayerIfInsideScroller();
    this._fixOverlayLayer();
    // Cache background video if present in overlay-view
    if (this._view) {
      this._video = this._view.querySelector('video') || null;
    }
    // Apply reduced-motion adjustments now that refs exist
    this.applyReducedMotionMode();
    // lumberjack.trace('Background effects system initialized', null, 'brief', 'success');
    // Find gel element created by Nunjucks atom (e.g., bg-gel-primary)
    const gelEl =
      document.querySelector('#gel-bg-gel-primary') ||
      document.querySelector('.bg-gel-primary') ||
      document.querySelector('.bg-gel-secondary') ||
      document.querySelector('.bg-gel-accent');
    if (gelEl) {
      this._gel = new Gel(gelEl, {
        defaultScaleX: 1,
        transformOrigin: 'left center',
      });
      // Initialize to primary, full width
      this._gel.setImmediate('initial', { colorClass: 'bg-gel-primary', xScale: 1 });
    }
  }

  /**
   * If overlay/sizzle live inside the ScrollSmoother content (which is transformed),
   * move them to the wrapper or body so position:fixed anchors to the viewport.
   */
  _detachBackgroundLayerIfInsideScroller() {
    const scroller = document.getElementById('smooth-content');
    const wrapper = document.getElementById('smooth-wrapper') || document.body;
    const els = [this._view, this._sizzle];
    els.forEach(el => {
      if (!el) return;
      if (scroller && scroller.contains(el) && wrapper) {
        wrapper.appendChild(el);
      }
    });
  }

  _fixOverlayLayer() {
    const els = [this._view, this._sizzle];
    let any = false;
    els.forEach(el => {
      if (!el) return;
      any = true;
      Object.assign(el.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '-10',
      });
    });
    if (!any) return;
  }

  _setupReducedMotionHandling() {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const query = '(prefers-reduced-motion: reduce)';
    this._mql = window.matchMedia(query);
    this._reducedMotion = !!this._mql.matches;
    const handler = e => {
      this._reducedMotion = !!e.matches;
      this.applyReducedMotionMode();
    };
    if (this._mql.addEventListener) this._mql.addEventListener('change', handler);
    else if (this._mql.addListener) this._mql.addListener(handler);
  }

  applyReducedMotionMode() {
    if (this._reducedMotion) {
      // Pause background video
      if (this._video) {
        try {
          this._video.pause();
        } catch (e) {
          /* noop */
        }
        this._video.removeAttribute && this._video.removeAttribute('autoplay');
      }
      // Kill smoother if active
      if (this._smoother && this._smoother.kill) {
        this._smoother.kill();
        this._smoother = null;
      }
      // Kill gel trigger if exists
      if (this._gelTrigger && this._gelTrigger.kill) {
        this._gelTrigger.kill();
        this._gelTrigger = null;
      }
    } else {
      // Attempt to resume background video (muted autoplay typical)
      if (this._video && this._video.muted) {
        try {
          this._video.play();
        } catch (e) {
          /* autoplay may be blocked */
        }
      }
      // Re-establish triggers if needed
      this.initTriggers();
    }
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
    // Detect smoother (auto if wrapper+content exist)
    const wrapper = document.querySelector('#smooth-wrapper');
    const content = document.querySelector('#smooth-content');
    const smootherAvailable = !!(wrapper && content);

    if (!this._reducedMotion && smootherAvailable && !this._smoother) {
      this._smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: SMOOTHER_EFFECTS,
      });
    }

    // Initialize gel animation
    if (!this._reducedMotion) {
      this.animateGel();
    }
  }

  /**
   * Animate gel element offscreen on scroll
   *
   * Slides the gel element out of view as the user scrolls down.
   * Animation is scrubbed to scroll position for smooth interaction.
   */

  animateGel() {
    const header = document.getElementById(HEADER_ID);
    if (this._gelTrigger && this._gelTrigger.kill) {
      this._gelTrigger.kill();
      this._gelTrigger = null;
    }
    if (!header || !this._gel) return;

    const scroller = this._smoother ? '#smooth-wrapper' : undefined;

    // Scrub gel scale with scroll position starting from document top
    // Independent of Hero's pin state - triggers on absolute scroll position
    this._gelTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=200vh',
      scrub: true,
      scroller,
      onUpdate: self => {
        const progress = self.progress; // 0 → 1
        const xScale = 1 - progress; // shrink to the left
        this._gel.setState('scroll-scale', { xScale });

        if (progress > 0.85) {
          this._gel.setState('accent', { colorClass: 'bg-gel-secondary' });
        } else {
          this._gel.setState('primary', { colorClass: 'bg-gel-primary' });
        }
      },
      // markers: true,
    });
  }

  /**
   * Get ScrollSmoother instance
   * @returns {ScrollSmoother|null} Instance or null if disabled
   */
  getSmoother() {
    return this._smoother;
  }
}
