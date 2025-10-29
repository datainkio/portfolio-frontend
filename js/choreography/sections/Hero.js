/** @format */

/**
 * Hero Section Choreographer
 *
 * CRITICAL WARNING: This class orchestrates the hero section's complex scroll-based animations.
 * If you modify this without understanding the complete GSAP pipeline, you WILL break:
 * - Hero title blowaway animation with rotation and translation
 * - Scroll-pinned video background behavior
 * - ScrollTrigger timeline synchronization across the entire site
 * - Parallax effects and smooth scrolling coordination
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: Hero section container with video and title elements
 * - CSS: Transform origins and positioning for rotation animations
 * - Animation: GSAP ScrollTrigger + ScrollSmoother plugins with precise timing
 * - Performance: Scroll scrubbing tied directly to user input - impacts site performance
 *
 * ARCHITECTURE NOTES:
 * - Uses GSAP all.js bundle instead of individual modules (performance optimization)
 * - Registers ScrollTrigger AND ScrollSmoother globally (affects all site animations)
 * - Animation constants defined at module level for easy tuning
 * - Getter methods provide controlled access to internal timeline and elements
 *
 * DEBUGGING GOTCHAS:
 * - ScrollSmoother can conflict with other scroll libraries - check for interference
 * - Pin spacing affects document flow and can cause layout shifts
 * - Transform origins must be precise or title will rotate from wrong pivot point
 * - Scrub values tie animation to scroll speed - test on different devices/browsers
 * - Timeline IDs ("hero", "heroOutro") are used for debugging and coordination
 *
 * DO NOT REMOVE: gsap.registerPlugin() calls - required for all scroll-based animations
 *
 * @fileoverview Choreographs hero section scroll animations with pinned video and rotating title
 * @requires gsap/all.js - Complete GSAP animation suite
 * @requires ScrollSmoother.js - Smooth scrolling and momentum effects
 * @requires ScrollTrigger.js - Scroll-based animation triggers and pinning
 */

import { gsap } from '/assets/js/gsap/all.js';
import { ScrollSmoother } from '/assets/js/gsap/ScrollSmoother.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';

// CRITICAL: Must register plugins before any timeline or animation creation
// ScrollSmoother affects entire site scroll behavior - coordinate with other systems
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * HERO ANIMATION CONSTANTS
 *
 * CRITICAL: These values are precisely tuned for the hero section's visual flow.
 * Modify with extreme caution - small changes can break the entire entrance experience.
 *
 * SCROLL TRIGGER TIMING:
 * - START: "top top" = Animation begins when hero top hits viewport top
 * - END: "bottom 75%" = Animation ends when hero bottom hits 75% down viewport
 * - These create the scroll range where the blowaway animation occurs
 *
 * ANIMATION MECHANICS:
 * - SCRUB: 1 = Animation progress tied 1:1 with scroll position (no lag)
 * - SCROLL: 5 = Parallax multiplier (currently unused but reserved)
 * - Values affect performance and visual smoothness across devices
 *
 * TRANSFORM BEHAVIOR:
 * - TRANSFORM_ORIGIN: "bottom 25%" = Title rotates from bottom-left area
 * - ROTATION: -35 = Degrees of counter-clockwise rotation for dramatic exit
 * - DESTINATION: -96 = Final X position (negative = leftward movement off-screen)
 * - EASE: "sine.in" = Smooth acceleration curve for natural motion
 *
 * WARNING: Changing these without testing across viewport sizes will break visual flow
 */

// ScrollTrigger timing configuration
const START = 'top top'; // Animation start point - hero top hits viewport top
const END = 'bottom 75%'; // Animation end point - hero bottom hits 75% down viewport
const SCRUB = 1; // Animation tied 1:1 to scroll position (no lag/delay)

// Parallax and motion settings
const SCROLL = 5; // Parallax speed multiplier (reserved for future parallax effects)

// Title blowaway animation parameters
const TRANSFORM_ORIGIN = 'bottom 25%'; // Rotation pivot point - prevents center rotation
const ROTATION = -35; // Counter-clockwise rotation in degrees for dramatic exit
const DESTINATION = -96; // Final X position - negative moves title leftward off-screen
const EASE = 'sine.in'; // Smooth acceleration curve for natural motion feel

/**
 * Hero Section Animation Controller
 *
 * Orchestrates the hero section's scroll-based "blowaway" animation where the title
 * rotates and slides off-screen as user scrolls. Coordinates with video pinning.
 *
 * ANIMATION LIFECYCLE:
 * 1. Constructor stores container reference
 * 2. outro() method triggers blowaway animation (currently commented out)
 * 3. blowaway() creates GSAP timeline with ScrollTrigger
 * 4. Getter methods provide controlled access to timeline and elements
 *
 * CRITICAL: This class expects specific DOM structure with title and video elements
 * available as this.TITLE and this.VIDEO (currently undefined - needs initialization)
 */
export default class Hero {
  /**
   * Initialize Hero animation controller
   *
   * @param {HTMLElement} elem - Hero section container element
   * @returns {Hero} Returns this instance for method chaining
   *
   * WARNING: Constructor only stores container reference.
   * Missing initialization of this.TITLE and this.VIDEO elements.
   * These must be set before calling blowaway() or animations will fail.
   */
  constructor(elem) {
    this.CONTAINER = elem;

    // TODO: Initialize required elements - currently missing!
    // this.TITLE = elem.querySelector('.hero-title'); // Add title element reference
    // this.VIDEO = elem.querySelector('.hero-video'); // Add video element reference

    return this;
  }

  /**
   * Trigger hero section exit animation
   *
   * Entry point for hero outro sequence. Currently has blowaway() commented out,
   * likely for debugging or performance testing.
   *
   * USAGE: Called by main choreography system when hero section should animate out.
   * Uncomment this.blowaway() to enable full exit animation with title rotation.
   *
   * @method outro
   * @memberof Hero
   */
  outro() {
    // DEBUGGING: Blowaway animation commented out - uncomment to enable hero exit effect
    // this.blowaway();
  }

  /**
   * Create hero title "blowaway" animation with scroll trigger
   *
   * COMPLEX ANIMATION: Creates dramatic exit effect where hero title rotates and slides
   * off-screen as user scrolls. Uses ScrollTrigger for scroll-based animation control.
   *
   * ANIMATION MECHANICS:
   * - Creates GSAP timeline with "hero" ID for debugging/coordination
   * - Uses gsap.to() to animate FROM natural state TO final transformed state
   * - Transform origin ensures rotation pivots from bottom-left of title
   * - Combines rotation + translation for dynamic "blowaway" effect
   *
   * SCROLL INTEGRATION:
   * - Animation progress tied directly to scroll position via ScrollTrigger
   * - Trigger configuration from this.trigger getter (includes video pinning)
   * - Scrub value makes animation feel responsive to user scroll speed
   *
   * CRITICAL DEPENDENCY: Requires this.TITLE element to be initialized!
   * Currently undefined - will throw error if called without proper setup.
   *
   * @returns {gsap.core.Timeline} GSAP timeline instance for external control
   *
   * WARNING: this.TITLE is undefined! Initialize in constructor before calling.
   */
  blowaway() {
    // Create timeline with ID for debugging and external coordination
    this.TL = gsap.timeline({ id: 'hero' });

    // CRITICAL BUG: this.TITLE is undefined! Will throw error when called.
    // Initialize title element in constructor: this.TITLE = elem.querySelector('.hero-title');

    // Animate title from natural state to dramatically rotated/translated final state
    this.TL.to(this.TITLE, {
      id: 'heroOutro', // Animation ID for debugging and control
      scrollTrigger: this.trigger, // Scroll trigger configuration (includes video pinning)
      transformOrigin: TRANSFORM_ORIGIN, // "bottom 25%" - rotation pivot point
      rotation: ROTATION, // -35° counter-clockwise rotation
      x: DESTINATION, // -96px horizontal translation (off-screen left)
      ease: EASE, // "sine.in" smooth acceleration curve
    });

    return this.TL;
  }

  /**
   * ScrollTrigger configuration for hero blowaway animation
   *
   * COMPLEX SCROLL SETUP: Defines how scroll position controls hero animation timing.
   * Includes video pinning for immersive parallax effect during title animation.
   *
   * TRIGGER MECHANICS:
   * - trigger: Uses hero container as scroll detection element
   * - pin: Pins video element during animation (keeps video fixed while title moves)
   * - pinSpacing: true maintains document flow spacing during pin
   * - start/end: Define scroll range where animation occurs
   * - scrub: Ties animation progress directly to scroll position
   *
   * SCROLL RANGE CALCULATION:
   * - START: "top top" = Animation begins when container top hits viewport top
   * - END: "bottom 75%" = Animation ends when container bottom hits 75% down viewport
   * - This creates smooth transition as user scrolls through hero section
   *
   * CRITICAL BUG: this.VIDEO is undefined! Will cause pinning errors.
   * Initialize video element or remove pin property to prevent crashes.
   *
   * @returns {Object} ScrollTrigger configuration object
   *
   * WARNING: this.VIDEO undefined - fix before enabling or remove pin property
   */
  get trigger() {
    return {
      trigger: this.CONTAINER, // Element that activates scroll detection
      pin: this.VIDEO, // BUG: this.VIDEO undefined! Will cause errors
      pinSpacing: true, // Maintain document flow during pin animation
      start: START, // "top top" - animation start point
      end: END, // "bottom 75%" - animation end point
      scrub: SCRUB, // 1 = animation tied 1:1 to scroll position
    };
  }

  /**
   * Get GSAP timeline instance for external control
   *
   * Provides access to the hero animation timeline for coordination with other
   * animations or manual timeline control.
   *
   * @returns {gsap.core.Timeline|undefined} GSAP timeline or undefined if blowaway() not called
   */
  get timeline() {
    return this.TL;
  }

  /**
   * Get hero container element
   *
   * @returns {HTMLElement} Hero section container element
   */
  get container() {
    return this.CONTAINER;
  }

  /**
   * Get gel element reference
   *
   * WARNING: this.GEL is undefined! Likely unused or requires initialization.
   * May be reserved for future gel animation effects.
   *
   * @returns {HTMLElement|undefined} Gel element or undefined
   */
  get gel() {
    return this.GEL; // BUG: this.GEL is undefined - initialize if needed
  }

  /**
   * Get hero title element
   *
   * CRITICAL BUG: this.TITLE is undefined! Must be initialized in constructor
   * before animations can work properly.
   *
   * @returns {HTMLElement|undefined} Hero title element or undefined
   */
  get text() {
    return this.TITLE; // BUG: this.TITLE is undefined - initialize in constructor
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To enable full Hero section animation:
 * 1. Initialize this.TITLE and this.VIDEO elements in constructor
 * 2. Uncomment this.blowaway() in outro() method
 * 3. Ensure hero HTML structure has title and video elements with appropriate selectors
 * 4. Test scroll timing across different viewport sizes and scroll speeds
 *
 * To fix current bugs:
 * - Add this.TITLE = elem.querySelector('.hero-title') in constructor
 * - Add this.VIDEO = elem.querySelector('.hero-video') in constructor
 * - Initialize this.GEL if gel effects are needed, or remove getter
 *
 * To customize animation:
 * - Modify constants at top of file for different timing/motion
 * - Adjust transform origin for different rotation pivot points
 * - Change easing functions for different motion feel
 *
 * PERFORMANCE CONSIDERATIONS:
 * - ScrollSmoother affects entire site - coordinate with other scroll libraries
 * - Pinning can cause layout shifts - test on mobile devices
 * - Scrub animations are tied to scroll - ensure smooth performance on low-end devices
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Timeline ID "hero" used for debugging and coordination with other animations
 * - ScrollTrigger registration affects all site scroll animations
 * - May be controlled by main choreography system or page-level animation coordinator
 *
 * @fileend Hero.js - Hero section scroll animation choreographer
 */
