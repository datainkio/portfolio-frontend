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
   * Create DOM structure and visual effects system
   *
   * Builds overlay-view container with background video and grid pattern.
   * Requires #smooth-content element. Gracefully fails if missing.
   *
   * Visual stack (z-index order):
   * - overlay-view: Grid pattern background (-z-10)
   * - video: Background video (inside overlay-view)
   * - site content: Above overlay
   */
  initView() {
    console.log('StageManager: Initializing background effects system');

    this._container = document.getElementById('smooth-content');
    if (!this._container) {
      console.warn('smooth-content element not found - overlay system disabled');
      return;
    }

    // Create overlay container with grid pattern (bg-video class)
    this._view = document.createElement('div');
    this._view.id = 'overlay-view';
    this._view.classList.add('absolute', 'inset-0', 'w-full', 'h-dvh', '-z-10', 'bg-video');
    this._container.prepend(this._view);

    // Add background video
    this._video = this.addVideo(this._view, VIDEO_URL);

    // Additional overlays (currently disabled)
    // this.addPixelator(this._view);
    // this.addOverlay(this._view, 'bg-gel-primary', 'primary');
    // this.addOverlay(this._view, 'bg-gel-secondary', 'secondary');
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
      console.log('ScrollSmoother enabled');
    } else {
      console.log('ScrollSmoother disabled - using native scroll');
    }

    // Pin overlay-view during biography section for fixed background effect
    if (this._view) {
      ScrollTrigger.create({
        trigger: '#biography',
        pin: this._view,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
      });
    }

    // Hero title fade-out animation
    gsap.timeline({ paused: true }).to('#main-header', {
      id: 'heroOutro',
      scrollTrigger: {
        trigger: '#main-header h1',
        start: 'center center',
        end: 'bottom center',
        scrub: 1,
      },
      opacity: 0,
      ease: 'sine.out',
    });

    // Biography list item staggered reveals
    document.querySelectorAll('#biography li').forEach(item => {
      gsap.set(item, { opacity: 0 });
      ScrollTrigger.create({
        trigger: item,
        start: 'center center',
        onEnter: () => gsap.to(item, { opacity: 1, duration: 0.5 }),
        // onLeaveBack: () => gsap.to(item, { opacity: 0, duration: 0.5 })
      });
    });
  }

  /**
   * Get ScrollSmoother instance
   * @returns {ScrollSmoother|null} Instance or null if disabled
   */
  getSmoother() {
    return this._smoother;
  }

  /**
   * Add pixelator background effect
   * @param {HTMLElement} elem - Element to apply effect to
   * @returns {HTMLElement} Modified element
   */
  addPixelator(elem) {
    elem.classList.add('bg-pixelator', 'absolute', 'inset-0');
    return elem;
  }

  /**
   * Create gel overlay element
   * @param {HTMLElement} elem - Parent element
   * @param {string} color - CSS class (bg-gel-primary, bg-gel-secondary)
   * @param {string} id - Unique identifier (primary, secondary)
   * @returns {HTMLElement} Created overlay
   */
  addOverlay(elem, color, id) {
    let overlay = elem.appendChild(this.addGel(document.createElement('div'), color));
    overlay.id = 'overlay-' + id;
    return overlay;
  }

  /**
   * Apply gel styling to element
   * @param {HTMLElement} elem - Element to style
   * @param {string} family - CSS class name
   * @returns {HTMLElement} Modified element
   */
  addGel(elem, family) {
    elem.classList.add(family);
    return elem;
  }

  /**
   * Create background video element
   *
   * Configured for autoplay with muted, loop, and playsinline attributes.
   * Sets MIME type based on file extension (.mov → video/quicktime, .mp4 → video/mp4).
   *
   * @param {HTMLElement} elem - Parent element
   * @param {string} url - Video file path (web-optimized MP4 recommended)
   * @returns {HTMLVideoElement} Created video element
   */
  addVideo(elem, url) {
    console.log('Adding background video from URL:', url);

    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');

    const source = document.createElement('source');
    source.src = url;

    // Set MIME type based on file extension
    if (url.endsWith('.mov')) {
      source.type = 'video/quicktime';
    } else if (url.endsWith('.mp4')) {
      source.type = 'video/mp4';
    } else {
      source.type = 'video/mp4';
    }

    video.appendChild(source);
    elem.appendChild(video);

    return video;
  }
}

/**
 * USAGE GUIDE
 *
 * ScrollSmoother Control:
 * - Auto-enabled when BOTH #smooth-wrapper and #smooth-content exist in HTML
 * - Omit these elements to use native browser scroll
 * - Check availability: stageManager.getSmoother() (returns null if disabled)
 *
 * Requirements:
 * - #smooth-content element (for overlay system)
 * - Video file at /assets/video/sizzle.mp4 (web-optimized MP4)
 * - CSS classes: .bg-video, .bg-pixelator, .bg-gel-primary, .bg-gel-secondary
 * - Section elements: #main-header, #biography (for scroll triggers)
 *
 * Debugging:
 * - Check console for ScrollSmoother status messages
 * - Verify video loads in network tab
 * - Confirm smooth-wrapper/smooth-content exist for smooth scroll
 *
 * Customization:
 * - Replace video: Update VIDEO_URL constant
 * - Modify gel overlays: Update CSS classes
 * - Adjust timing: Modify ScrollTrigger start/end points
 * - Toggle ScrollSmoother: Add/remove wrapper/content elements in HTML
 */
