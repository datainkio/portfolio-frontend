/**
 * ---
 * aix:
 *   id: frontend.js.choreography.config.runtime
 *   role: Frontend runtime module: js/choreography/config/runtime.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - config
 *     - runtime.js
 * ---
 */
/** @format */

/**
 * Site-Specific Choreography Runtime Configuration
 *
 * DOM selectors, asset paths, animation timing, and visual settings that are
 * UNIQUE to this project. Change these values when adapting the choreography
 * system to a different site.
 *
 * For event contracts, see events.js
 *
 * USAGE PATTERN:
 * import { SELECTORS, ANIMATION_DEFAULTS } from './runtime.js';
 *
 * // Find DOM elements
 * this.element = document.querySelector(SELECTORS.hero);
 *
 * // Use consistent animation settings
 * gsap.to(target, { duration: ANIMATION_DEFAULTS.duration });
 *
 * @fileoverview Project-specific runtime configuration values
 */

/**
 * ACCESSIBILITY SETTINGS
 *
 * Reduced motion settings for users who prefer less animation.
 * These values are used by the ReducedMotionHandler to adjust animation behavior.
 */
export const ACCESSIBILITY_SETTINGS = {
  prefersReducedMotion: false, // default; will be updated by ReducedMotionHandler
  reducedMotionDuration: 0.1, // seconds
  reducedMotionStagger: 0.05, // seconds
  reducedMotionEase: "none", // no easing for reduced motion
};

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
  organizations: "organizations",
  bio: "bio",
  awards: "awards",
  // Home template renders the projects section with id="projects".
  work: "projects",

  smoothWrapper: "#smooth-wrapper",
  smoothContent: "#smooth-content",

  overlayView: "#overlay-view",
  sizzleBackground: "#sizzle-background",

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
 */
export const ANIMATION_DEFAULTS = {
  duration: 0.6,
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
 */
export const SCROLL_DEFAULTS = {
  start: "top center",
  end: "bottom center",
  pinSpacing: false,
  onEnter: () => {},
  onLeave: () => {},
  onEnterBack: () => {},
  onLeaveBack: () => {},
  onRefresh: () => {},
  onUpdate: () => {},
  once: true,
  scrub: false,
  snap: false,
  pin: false,
  anticipatePin: 0,
  invalidateOnRefresh: true,
  fastScrollEnd: true,
  toggleActions: "play reverse none none",
  markers: false,
};

/**
 * Hero Trigger Defaults
 */
export const HERO_TRIGGER = {
  start: "bottom 45%",
  end: "bottom 25%",
  markers: false,
  pin: false,
  once: false,
};

/**
 * Bio Reveal Trigger Defaults
 */
export const BIO_TRIGGER = {
  start: "top center",
  end: "top 25%",
  pin: true,
  once: false,
  // markers: true,
};

export const BIO_HIDE_TRIGGER = {
  start: "bottom center",
  end: "top center",
  once: false,
  // markers: true,
};

/**
 * Gel Arrangement Transition Defaults
 */
export const GEL_ARRANGEMENT_TRANSITION = {
  duration: 0.8,
  ease: "power2.inOut",
  refreshOnUpdate: true,
};

/**
 * Color Classes
 */
export const COLOR_CLASSES = {
  gel: {
    primary: "bg-gel-primary",
    secondary: "bg-gel-secondary",
    accent: "bg-gel-accent",
  },
};
