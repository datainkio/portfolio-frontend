/**
 * StageManager - Master Scroll Coordination & Visual Effects Controller
 *
 * CRITICAL WARNING: This is the SPINE of the entire site's animation system.
 * If you modify this without understanding the complete visual pipeline, you WILL break:
 * - Site-wide scroll smoothing and parallax effects (ScrollSmoother)
 * - Cross-section animation coordination and timeline synchronization
 * - Video background integration and overlay visual effects system
 * - Biography section fade-in animations and scroll-triggered reveals
 * - Hero section blowaway animations and element positioning
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: Specific DOM structure with smooth-wrapper/smooth-content containers
 * - CSS: Background video, overlay gels, and pixelator visual effects
 * - Video: sizzle.mov file must exist and be properly encoded for web
 * - Animation: GSAP ScrollSmoother + ScrollTrigger coordination across all sections
 * - Performance: ScrollSmoother affects entire site scroll behavior and rendering
 *
 * ARCHITECTURE NOTES:
 * - Creates and manages overlay-view container for all visual effects
 * - Coordinates with section controllers (Hero, Work, Biography) via scroll triggers
 * - Uses GSAP ScrollSmoother for site-wide smooth scrolling experience
 * - Manages complex animation timelines with precise scroll trigger coordination
 *
 * VISUAL EFFECTS SYSTEM:
 * - Background video with autoplay/loop for immersive experience
 * - Gel overlays (primary/secondary) for color transitions and branding
 * - Pixelator background effects for textural visual interest
 * - Biography list items with staggered fade-in animations
 *
 * DEBUGGING GOTCHAS:
 * - ScrollSmoother can conflict with other scroll libraries - check for interference
 * - Video element requires proper CORS and encoding for cross-browser compatibility
 * - Overlay positioning depends on CSS classes and Tailwind utilities
 * - Animation timelines use complex trigger relationships that can cascade failures
 * - Pin spacing affects document flow and can cause unexpected layout shifts
 *
 * DO NOT REMOVE: ScrollSmoother.create() - controls entire site scroll experience
 * DO NOT CHANGE: Element IDs without updating HTML structure accordingly
 *
 * @fileoverview Master stage coordination with scroll smoothing and visual effects
 * @requires gsap/all.js - Complete GSAP animation suite
 * @requires ScrollSmoother.js - Site-wide smooth scrolling and momentum effects
 * @requires ScrollTrigger.js - Scroll-based animation triggers and element pinning
 */

import { gsap } from '/assets/js/gsap/all.js';
import { ScrollSmoother } from '/assets/js/gsap/ScrollSmoother.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';

// CRITICAL: Must register plugins before any ScrollSmoother or animation creation
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * STAGE CONFIGURATION CONSTANTS
 *
 * CRITICAL: These IDs must match the HTML structure exactly or the entire
 * animation system will fail to initialize properly.
 *
 * DOM DEPENDENCIES:
 * - HEADER_ID: Main header element for hero animations
 * - WORK_ID: Work section container for project animations
 * - VIDEO_URL: Background video file - must be web-optimized MP4
 *
 * WARNING: Changing these without updating HTML will break section coordination
 *
 * SMOOTH SCROLL AUTO-DETECTION:
 * ScrollSmoother is automatically enabled if BOTH smooth-wrapper and smooth-content
 * elements exist in the DOM. This allows pages to opt-in to smooth scrolling by
 * including the required HTML structure, or opt-out by omitting it.
 *
 * To enable ScrollSmoother on a page:
 * - Add #smooth-wrapper as outer container
 * - Add #smooth-content as inner scrollable content
 *
 * To disable ScrollSmoother on a page:
 * - Simply omit these elements - native browser scroll will be used
 * - All scroll triggers continue to work regardless of ScrollSmoother state
 */
const HEADER_ID = 'main-header'; // Main header element - hero section anchor
const WORK_ID = 'work'; // Work section element - project animations anchor
const VIDEO_URL = './video/sizzle.mov'; // Background video - MUST exist and be web-compatible

/**
 * StageManager - Master Animation Coordinator
 *
 * Orchestrates the complete visual experience including scroll smoothing,
 * background video, overlay effects, and cross-section animation timing.
 *
 * INITIALIZATION SEQUENCE (order is critical):
 * 1. initView() - Sets up DOM structure and visual effects elements
 * 2. initAnimation() - Configures ScrollSmoother and animation triggers
 *
 * MANAGED ELEMENTS:
 * - _container: ScrollSmoother content wrapper (smooth-content)
 * - _view: Overlay container for all visual effects (overlay-view)
 * - _video: Background video element with autoplay configuration
 * - _smoother: ScrollSmoother instance (null if not available)
 *
 * CRITICAL: Constructor initialization must complete before section controllers
 * can properly coordinate their animations with the stage system.
 */
export default class StageManager {
  /**
   * Initialize StageManager with complete visual effects system
   *
   * CRITICAL INITIALIZATION: Sets up the foundation for all site animations.
   * Must complete successfully before any section controllers can function.
   *
   * INITIALIZATION ORDER:
   * 1. Declare internal element references
   * 2. initView() - Create DOM structure and visual effects
   * 3. initAnimation() - Configure scroll system and animation triggers
   *
   * WARNING: If initView() or initAnimation() fail, the entire animation
   * system will be broken. No error handling currently implemented.
   */
  constructor() {
    // Internal element references - initialized in initView()
    this._container; // ScrollSmoother content container
    this._view; // Overlay container for visual effects
    this._video; // Background video element
    this._smoother = null; // ScrollSmoother instance (null if not available)

    // CRITICAL: Initialization order matters - view must exist before animations
    this.initView(); // Create DOM structure and visual effects
    this.initAnimation(); // Configure ScrollSmoother and animation triggers
  }

  /**
   * Initialize DOM structure and visual effects system
   *
   * CRITICAL FUNCTION: Creates the complete visual foundation for the site.
   * This method builds the overlay system that provides background video,
   * gel effects, and pixelator styling that appears behind all content.
   *
   * DOM STRUCTURE CREATED:
   * 1. Finds smooth-content container (required for overlay system)
   * 2. Creates overlay-view container with full-screen positioning
   * 3. Adds background video with autoplay configuration
   * 4. Applies pixelator background effects
   * 5. Adds primary and secondary gel overlays for visual branding
   *
   * VISUAL EFFECTS STACK (z-index order):
   * - Background: Video element (bottom layer)
   * - Middle: Pixelator effects
   * - Foreground: Gel overlays (primary/secondary)
   * - Content: Site content appears above overlay-view (-z-10)
   *
   * DEPENDENCY REQUIREMENTS:
   * - #smooth-content element MUST exist in HTML for overlay system
   * - VIDEO_URL file MUST be accessible and web-compatible
   * - Tailwind CSS classes MUST be available for positioning
   * - CSS classes for bg-gel-primary, bg-gel-secondary, bg-pixelator MUST exist
   *
   * WARNING: If smooth-content doesn't exist, overlay system won't initialize.
   * If video file is missing, background video won't load but won't break site.
   */
  initView() {
    // CRITICAL: Find content container for overlay system
    this._container = document.getElementById('smooth-content');
    if (!this._container) {
      console.warn('smooth-content element not found - overlay system disabled');
      return;
    }

    // Create overlay container for all visual effects
    // Positioned behind content with -z-10 to act as background system
    this._view = document.createElement('div');
    this._view.id = 'overlay-view';
    this._view.classList.add('absolute', 'inset-0', 'w-full', 'h-dvh', '-z-10');

    // Insert at beginning so it appears behind all content
    this._container.prepend(this._view);

    // Build visual effects stack (order matters for layering)
    this._video = this.addVideo(this._view, VIDEO_URL); // Background video layer
    this.addPixelator(this._view); // Pixelator texture effects
    this.addOverlay(this._view, 'bg-gel-primary', 'primary'); // Primary gel overlay
    this.addOverlay(this._view, 'bg-gel-secondary', 'secondary'); // Secondary gel overlay
  }

  /**
   * Initialize scroll system and master animation coordination
   *
   * COMPLEX ANIMATION SETUP: Configures the complete scroll-based animation system
   * that coordinates all section animations, overlay effects, and scroll smoothing.
   *
   * SCROLLSMOOTHER AUTO-DETECTION:
   * - Automatically checks for #smooth-wrapper AND #smooth-content in DOM
   * - If BOTH exist: Initializes ScrollSmoother with smooth scrolling
   * - If EITHER missing: Falls back to native browser scroll
   * - All scroll triggers work regardless of ScrollSmoother state
   *
   * SCROLLSMOOTHER CONFIGURATION (when enabled):
   * - Wrapper: #smooth-wrapper (outer container for scroll detection)
   * - Content: #smooth-content (inner container that gets smoothly scrolled)
   * - Effects: Disabled to prevent parallax (only smooth scrolling enabled)
   * - Smooth: Currently commented out (1.5 would slow scroll smoothing)
   *
   * ANIMATION COORDINATION:
   * 1. ScrollSmoother provides foundation for smooth scroll experience (optional)
   * 2. View pinning creates fixed background during scroll sections
   * 3. Title outro animations with rotation and translation effects
   * 4. Biography list item staggered fade-in reveals
   *
   * CRITICAL DEPENDENCIES:
   * - Section elements (biography, main-header) must exist for triggers
   * - CSS classes must support transform animations and overlay positioning
   *
   * WARNING: ScrollSmoother affects entire site scroll behavior when enabled.
   * Conflicts with other scroll libraries can cause performance issues.
   */
  initAnimation() {
    // AUTO-DETECT: Check if both required elements exist for ScrollSmoother
    const smoothWrapper = document.getElementById('smooth-wrapper');
    const smoothContent = document.getElementById('smooth-content');
    const canEnableSmoothScroll = smoothWrapper && smoothContent;

    // CONDITIONAL: Initialize ScrollSmoother only if both elements exist
    // This allows pages to opt-in/opt-out of smooth scrolling via HTML structure
    if (canEnableSmoothScroll) {
      this._smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper', // Outer scroll container - detected above
        content: '#smooth-content', // Inner content container - detected above
        // smooth: 1.5,                // Speed multiplier (higher = slower) - commented for default
        effects: false, // Disable parallax effects - only use smooth scrolling
      });
      console.log('ScrollSmoother enabled - smooth scrolling active');
    } else {
      console.log(
        'ScrollSmoother disabled - missing required elements (smooth-wrapper and/or smooth-content)'
      );
      console.log('Using native browser scroll - all scroll triggers still functional');
    }

    /**
     * OVERLAY VIEW PINNING SYSTEM
     *
     * Creates fixed background effect where overlay-view stays pinned during
     * scroll until biography section completes. This creates immersive experience
     * where background video and effects remain stationary while content scrolls over.
     *
     * CRITICAL: Works with or without ScrollSmoother - triggers are independent
     * DEFENSIVE: Only creates pin if overlay view exists
     */
    if (this._view) {
      // Pin overlay-view during biography section scroll
      // Creates fixed background effect for immersive visual experience
      ScrollTrigger.create({
        trigger: '#biography', // Biography section triggers the pin
        pin: this._view, // Pin the overlay-view (background effects)
        start: 'top bottom', // Pin starts when biography top hits viewport bottom
        end: 'bottom bottom', // Pin ends when biography bottom hits viewport bottom
        scrub: 1, // Animation tied 1:1 to scroll position
      });
    }

    /**
     * HERO TITLE OUTRO ANIMATION SYSTEM
     *
     * Creates dramatic "paper sliding off" effect where hero title and primary overlay
     * rotate and translate off-screen as user scrolls past hero section.
     *
     * CRITICAL: Works with or without ScrollSmoother - triggers are independent
     */

    // ScrollTrigger configuration for hero title exit animation
    const title_trigger = {
      trigger: '#main-header h1', // H1 element inside main header triggers animation
      start: 'center center', // Animation starts when H1 center hits viewport center
      end: 'bottom center', // Animation ends when H1 bottom hits viewport center
      scrub: 1, // Animation progress tied 1:1 to scroll position
    };

    // Create timeline for coordinated title and overlay exit animation
    const title_outro = gsap.timeline({ paused: true });

    // Simple opacity fade - commented out in favor of dramatic rotation effect
    title_outro.to('#main-header', {
      id: 'heroOutro',
      scrollTrigger: title_trigger,
      opacity: 0,
      ease: 'sine.out',
    });

    /**
     * BIOGRAPHY LIST ITEM REVEAL SYSTEM
     *
     * Creates staggered fade-in effect for biography content where each list item
     * starts invisible and fades in as user scrolls it into view. Provides
     * progressive content revelation for better reading experience.
     *
     * ANIMATION MECHANICS:
     * - All items start with opacity: 0 (invisible)
     * - Individual ScrollTriggers created for each item
     * - Fade-in triggered when item center hits viewport center
     * - Optional fade-out on scroll-back (currently disabled)
     *
     * CRITICAL: Works with or without ScrollSmoother - triggers are independent
     */

    // Initialize all biography list items as invisible, then reveal on scroll
    document.querySelectorAll('#biography li').forEach(item => {
      // Set initial state: invisible
      gsap.set(item, { opacity: 0 });

      // Create individual ScrollTrigger for each list item
      ScrollTrigger.create({
        trigger: item, // Each list item triggers its own animation
        start: 'center center', // Fade-in when item center hits viewport center
        onEnter: () =>
          gsap.to(item, {
            opacity: 1, // Fade to fully visible
            duration: 0.5, // 0.5 second fade duration
          }),

        // OPTIONAL: Uncomment to fade out when scrolling back up
        // onLeaveBack: () => gsap.to(item, { opacity: 0, duration: 0.5 })
      });
    });
  }

  /**
   * Get ScrollSmoother instance
   *
   * Provides access to the ScrollSmoother instance for external control.
   * Returns null if ScrollSmoother is not available (missing required DOM elements).
   *
   * @returns {ScrollSmoother|null} ScrollSmoother instance or null if not available
   *
   * USAGE:
   * const smoother = stageManager.getSmoother();
   * if (smoother) {
   *   smoother.scrollTo(0, true); // Scroll to top smoothly
   *   smoother.paused(true);      // Pause smooth scrolling
   * }
   *
   * DEFENSIVE: Always check for null before calling ScrollSmoother methods
   */
  getSmoother() {
    return this._smoother;
  }

  /**
   * Apply pixelator background effect
   *
   * Adds visual texture effect to the provided element using CSS class.
   * Creates pixel-grid or dithered background pattern for visual interest.
   *
   * @param {HTMLElement} elem - Element to apply pixelator effect to
   * @returns {HTMLElement} The modified element for method chaining
   *
   * WARNING: Requires bg-pixelator CSS class to be defined in stylesheets
   */
  addPixelator(elem) {
    elem.classList.add('bg-pixelator', 'absolute', 'inset-0');
    return elem;
  }

  /**
   * Create and add gel overlay element
   *
   * Creates a new div element with gel color styling and unique ID.
   * Used for primary/secondary color overlays in the visual effects system.
   *
   * @param {HTMLElement} elem - Parent element to append overlay to
   * @param {string} color - CSS class for gel color (bg-gel-primary, bg-gel-secondary)
   * @param {string} id - Unique identifier for the overlay (primary, secondary)
   * @returns {HTMLElement} Created overlay element
   *
   * WARNING: Requires gel color CSS classes to be defined in stylesheets
   */
  addOverlay(elem, color, id) {
    let overlay = elem.appendChild(this.addGel(document.createElement('div'), color));
    overlay.id = 'overlay-' + id; // Creates IDs like "overlay-primary"
    return overlay;
  }

  /**
   * Apply gel styling to element
   *
   * Adds gel effect CSS class to element for visual branding colors.
   * Simple utility method for consistent gel effect application.
   *
   * @param {HTMLElement} elem - Element to apply gel styling to
   * @param {string} family - CSS class name for gel family (bg-gel-primary, etc.)
   * @returns {HTMLElement} The modified element for method chaining
   */
  addGel(elem, family) {
    elem.classList.add(family);
    return elem;
  }

  /**
   * Create and configure background video element
   *
   * CRITICAL FUNCTION: Creates the hero background video with all necessary
   * attributes for autoplay, accessibility, and cross-browser compatibility.
   *
   * VIDEO CONFIGURATION:
   * - autoplay: Starts playing immediately (requires muted for browser policies)
   * - loop: Continuous playback for background effect
   * - muted: Required for autoplay in most browsers
   * - playsinline: Prevents fullscreen on iOS devices
   * - aria-hidden: Marks as decorative for screen readers
   *
   * BROWSER COMPATIBILITY:
   * - Uses MP4 source for broad browser support
   * - Autoplay policies vary by browser - muted is essential
   * - Mobile devices may have additional restrictions
   *
   * @param {HTMLElement} elem - Parent element to append video to
   * @param {string} url - Path to video file (must be web-optimized MP4)
   * @returns {HTMLVideoElement} Created video element
   *
   * CRITICAL: Video file must exist and be properly encoded or background will be empty.
   * Consider fallback image if video fails to load.
   */
  addVideo(elem, url) {
    // Create video element with all required attributes for background playback
    const video = document.createElement('video');
    video.setAttribute('autoplay', ''); // Start playing immediately
    video.setAttribute('loop', ''); // Continuous background playback
    video.setAttribute('muted', ''); // Required for autoplay policies
    video.setAttribute('playsinline', ''); // Prevent iOS fullscreen behavior
    video.setAttribute('aria-hidden', 'true'); // Hide from screen readers (decorative)
    video.classList.add('bg-video'); // CSS class for background video styling

    // Create MP4 source for broad browser compatibility
    const sourceMP4 = document.createElement('source');
    sourceMP4.src = url; // Video file path - MUST exist
    sourceMP4.type = 'video/mp4'; // MIME type for MP4 format

    video.appendChild(sourceMP4);
    elem.appendChild(video);

    return video;
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * ENABLING/DISABLING SCROLLSMOOTHER:
 * ScrollSmoother is now AUTO-DETECTED based on HTML structure:
 *
 * TO ENABLE on a page:
 * - Include #smooth-wrapper as outer container in your HTML
 * - Include #smooth-content as inner scrollable content
 * - Both elements MUST exist for ScrollSmoother to activate
 *
 * TO DISABLE on a page:
 * - Simply omit smooth-wrapper and/or smooth-content elements
 * - Native browser scroll will be used automatically
 * - All scroll triggers continue to work normally
 *
 * CHECKING SCROLLSMOOTHER STATE:
 * - Use getSmoother() to get the instance (returns null if disabled)
 * - Always check for null before calling ScrollSmoother methods:
 *   const smoother = stageManager.getSmoother();
 *   if (smoother) { smoother.scrollTo(0); }
 *
 * To ensure proper StageManager functionality:
 * 1. For overlay system: #smooth-content element must exist
 * 2. For ScrollSmoother: BOTH #smooth-wrapper and #smooth-content must exist
 * 3. Video file (sizzle.mov) must exist and be web-optimized
 * 4. CSS classes must be defined: bg-video, bg-pixelator, bg-gel-primary, bg-gel-secondary
 * 5. Section elements (main-header, biography) must exist for animation triggers
 *
 * To debug StageManager issues:
 * - Check browser console for ScrollSmoother status messages
 * - Verify both smooth-wrapper and smooth-content exist if smooth scroll expected
 * - Verify video file loads properly (network tab in dev tools)
 * - Test scroll smoothing performance across different devices
 * - Monitor animation timeline coordination with section controllers
 *
 * To customize visual effects:
 * - Modify gel overlay colors by updating CSS classes
 * - Adjust video by replacing sizzle.mov with different background video
 * - Change pixelator effects by modifying bg-pixelator CSS
 * - Tune animation timing by adjusting ScrollTrigger start/end points
 * - Control ScrollSmoother availability via HTML structure (add/remove wrapper/content)
 *
 * PERFORMANCE CONSIDERATIONS:
 * - ScrollSmoother affects entire site scroll performance when enabled
 * - Video autoplay impacts page load time and bandwidth
 * - Multiple ScrollTriggers for biography items - test with many items
 * - Pin animations can cause layout shifts on mobile devices
 * - Pages without smooth-wrapper/smooth-content have better performance (native scroll)
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Coordinates with Hero, Work, Biography section controllers
 * - Provides foundation for Director.js master choreographer
 * - Must initialize before other animation systems for proper coordination
 * - ScrollSmoother affects all scroll-based animations site-wide (when enabled)
 * - ScrollTriggers work independently of ScrollSmoother state
 *
 * @fileend StageManager.js - Master scroll coordination and visual effects controller
 */
