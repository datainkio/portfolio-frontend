/**
 * ---
 * aix:
 *   id: frontend.js.choreography.config
 *   role: Frontend runtime module: js/choreography/config.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - config.js
 * ---
 */
/** @format */

/**
 * Site-Specific Choreography Configuration
 *
 * DOM selectors, asset paths, animation timing, and visual settings that are
 * UNIQUE to this project. Change these values when adapting the choreography
 * system to a different site.
 *
 * For system-level constants (event names, API contracts), see constants.js
 *
 * USAGE PATTERN:
 * import { SELECTORS, ANIMATION_DEFAULTS } from './config.js';
 *
 * // Find DOM elements
 * this.element = document.querySelector(SELECTORS.hero);
 *
 * // Use consistent animation settings
 * gsap.to(target, { duration: ANIMATION_DEFAULTS.duration });
 *
 * @fileoverview Project-specific configuration values
 */

/**
 * DOM Selectors
 *
 * Element IDs and classes specific to this site's template structure.
 * These map to elements created in Nunjucks templates (njk/_includes/).
 *
 * Update these when:
 * - Changing element IDs in templates
 * - Adapting choreography system to new project
 * - Refactoring page structure
 */
export const SELECTORS = {
  video: "sizzle-background",
  bio: "bio",
  awards: "awards",
  work: "work",

  // Scroll smoothing container (optional - enables ScrollSmoother)
  smoothWrapper: "#smooth-wrapper",
  smoothContent: "#smooth-content",

  // Background layers (fixed positioning)
  overlayView: "#overlay-view",
  sizzleBackground: "#sizzle-background",

  // Hero section elements
  hero: "hero",
  heroTitle: "#hero h1",
};

/**
 * Asset Paths
 *
 * File paths for video, images, and media assets used by choreography system.
 * Paths are relative to site root (assets/ directory).
 */
export const ASSET_PATHS = {
  video: {
    sizzle: "/assets/video/sizzle.mp4",
  },
};

/**
 * Animation Default Settings
 *
 * Base timing and easing values used across all sections.
 * Provides consistent animation feel throughout the site.
 *
 * TIMING:
 * - duration: Base animation length in seconds
 * - stagger: Delay between sequential animations (e.g., word reveals)
 *
 * EASING:
 * - in: Accelerating animations (elements exiting)
 * - out: Decelerating animations (elements entering)
 * - inOut: Smooth start and end (continuous motion)
 */
export const ANIMATION_DEFAULTS = {
  duration: 0.6,
  // speed: 0.2,
  stagger: 0.1,
  ease: {
    in: "power3.in",
    out: "power3.out",
    inOut: "power3.inOut",
  },
  translateY: -30,
};

/**
 * ScrollTrigger Default Configuration
 *
 * Base settings for GSAP ScrollTrigger instances.
 * Individual sections can override these values for specific behaviors.
 *
 * SETTINGS:
 * - markers: Show debug markers (start/end points) - set true for development
 * - toggleActions: Behavior format: "onEnter onLeave onEnterBack onLeaveBack"
 * - start: Animation trigger point (e.g., "top center" = element top hits viewport center)
 * - end: Animation end point (e.g., "bottom center" = element bottom hits viewport center)
 */
export const SCROLL_DEFAULTS = {
  markers: false,
  toggleActions: "play none none reverse",
  start: "top center",
  end: "bottom center",
};

/**
 * Gel Arrangement Transition Defaults
 *
 * Timing and easing used when morphing gels between section arrangements.
 * Reduced-motion users are handled by manager-level immediate application.
 */
export const GEL_ARRANGEMENT_TRANSITION = {
  duration: 0.8,
  ease: "power2.inOut",
  refreshOnUpdate: true,
};

/**
 * Initial Gel Arrangement
 *
 * Optional arrangement id applied immediately after gel initialization.
 * Set to one of the keys in GEL_ARRANGEMENTS (e.g. "hero") or null to disable.
 */
export const INITIAL_GEL_ARRANGEMENT_ID = "hero";

/**
 * Color Classes
 *
 * CSS classes for gel color states.
 * These map to design tokens generated from Figma (styles/colors.css).
 *
 * Update these when:
 * - Design system colors change
 * - Adding new gel color variations
 * - Syncing with Figma design tokens
 */
export const COLOR_CLASSES = {
  gel: {
    primary: "bg-gel-primary",
    secondary: "bg-gel-secondary",
    accent: "bg-gel-accent",
  },
};
