/** @format */

/**
 * Animation Director - Master Choreography Controller
 *
 * CRITICAL WARNING: This is the MASTER ORCHESTRATOR for the entire site's animation system.
 * If you modify this file without understanding the complete choreography pipeline, you WILL break:
 * - Site-wide animation initialization and timing coordination
 * - Section-based scroll animations (Hero, Work, Biography)
 * - StageManager scroll event coordination across all sections
 * - GSAP timeline synchronization and animation lifecycle management
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: Specific element IDs (main-header, work, biography) MUST exist in DOM
 * - CSS: Animation styles and transforms for each section controller
 * - Animation: Complete GSAP timeline coordination across Hero/Work/Biography sections
 * - Performance: StageManager handles scroll optimization - impacts entire site performance
 *
 * ARCHITECTURE NOTES:
 * - Uses window.onload for DOM-ready initialization (not DOMContentLoaded)
 * - Each section controller (Hero, Work, Biography) manages its own animation timelines
 * - StageManager coordinates scroll events and prevents animation conflicts
 * - Animation lifecycle callbacks (onStart, onUpdate, onComplete) for debugging
 *
 * INITIALIZATION SEQUENCE:
 * 1. window.onload ensures DOM is fully loaded before animation setup
 * 2. Section controllers instantiated with specific DOM element references
 * 3. StageManager created to coordinate scroll-based animation triggers
 * 4. Lifecycle callbacks provide debugging hooks for animation events
 *
 * DEBUGGING GOTCHAS:
 * - Element IDs are hardcoded - must match HTML structure exactly
 * - Section controllers may have animations disabled (commented out in constructors)
 * - StageManager instance not stored - no way to access or debug after creation
 * - Lifecycle callbacks are basic logging - may need enhancement for production
 *
 * DO NOT CHANGE: Element IDs without updating corresponding HTML structure
 * DO NOT REMOVE: StageManager instantiation - coordinates all scroll animations
 *
 * @fileoverview Master animation director coordinating Hero, Work, Biography section choreography
 * @requires StageManager.js - Scroll event coordination and animation management
 * @requires Hero.js - Hero section animation controller with scroll triggers
 * @requires Work.js - Work section animation controller with printer marks
 * @requires Biography.js - Biography section animation controller with slideshow
 */

import StageManager from "/assets/js/choreography/StageManager.js";
import Hero from "/assets/js/choreography/sections/Hero.js";
import Work from "/assets/js/choreography/sections/Work.js";
import Biography from "/assets/js/choreography/sections/Biography.js";

/**
 * MASTER ANIMATION INITIALIZATION
 *
 * CRITICAL: This function orchestrates the entire site's animation system initialization.
 * Called on window.onload to ensure DOM is fully loaded before animation setup begins.
 *
 * INITIALIZATION SEQUENCE (order matters for proper coordination):
 * 1. Hero section controller - manages landing page scroll animations and video pinning
 * 2. Work section controller - manages project category animations with printer marks
 * 3. Biography section controller - manages personal history slideshow animations
 * 4. StageManager - coordinates scroll events and prevents animation conflicts
 *
 * ELEMENT DEPENDENCIES:
 * - "main-header" ID: Must exist for Hero section initialization
 * - "work" ID: Must exist for Work section initialization
 * - "biography" ID: Must exist for Biography section initialization
 * - Missing any of these IDs will cause section controller failures
 *
 * COORDINATION NOTES:
 * - Each section controller manages its own GSAP timelines and ScrollTriggers
 * - StageManager prevents scroll event conflicts between sections
 * - Section controllers may have animations disabled for debugging
 *
 * WARNING: Uses window.onload instead of DOMContentLoaded - waits for all assets
 * This ensures images/videos are loaded before animation calculations begin.
 */
window.onload = function () {
  // Debug marker - "Que?" indicates animation system initialization
  console.log("Que?");

  // CRITICAL: Initialize section controllers with specific DOM elements
  // These IDs must match the HTML structure exactly or controllers will fail

  const HERO = new Hero(document.getElementById("main-header")); // Hero landing page animations
  const WORK = new Work(document.getElementById("work")); // Project section animations
  const BIOGRAPHY = new Biography(document.getElementById("biography")); // Biography slideshow animations

  // CRITICAL: StageManager MUST be instantiated last to coordinate all section animations
  // Manages scroll event optimization and prevents animation timeline conflicts
  const SM = new StageManager(); // Master scroll coordination system

  // TODO: Store section controller references for external access/debugging
  // Currently no way to access HERO, WORK, BIOGRAPHY, or SM after initialization
};

/**
 * ANIMATION LIFECYCLE CALLBACK FUNCTIONS
 *
 * These functions provide hooks for animation events across the choreography system.
 * Currently used for debugging but can be enhanced for production animation coordination.
 *
 * CALLBACK INTEGRATION:
 * - Called by GSAP timelines and ScrollTrigger events in section controllers
 * - Provide visibility into animation state changes for debugging
 * - Can be extended for analytics, performance monitoring, or animation chaining
 *
 * ENHANCEMENT OPPORTUNITIES:
 * - Add animation performance timing
 * - Implement animation state management
 * - Add error handling for failed animations
 * - Create animation event bus for cross-section coordination
 */

/**
 * Animation start event callback
 *
 * Called when any animation timeline begins execution.
 * Currently provides basic logging for debugging animation triggers.
 *
 * @param {string} id - Animation timeline ID for identification
 *
 * USAGE: Add onStart: () => onStart("timelineId") to GSAP timeline configs
 */
function onStart(id) {
  console.log(id + ".onStart");

  // TODO: Add animation start analytics or state management
  // TODO: Implement animation conflict detection
}

/**
 * Animation update event callback
 *
 * Called during animation progress updates.
 * Currently provides basic logging for debugging animation flow.
 *
 * @param {Object} obj - Animation object or progress data
 *
 * WARNING: Called frequently during animations - keep processing minimal
 * to avoid performance impact on animation smoothness.
 */
function onUpdate(obj) {
  console.log(obj + ".onUpdate");

  // TODO: Add animation progress monitoring
  // TODO: Implement performance tracking for animation optimization
}

/**
 * Animation completion event callback
 *
 * Called when animation timelines finish execution.
 * Includes special handling for "fadeInChars" animation with TextParty integration.
 *
 * @param {string} id - Animation timeline ID for identification
 *
 * SPECIAL CASE: "fadeInChars" triggers additional TextParty.gel() animation
 * (currently commented out - likely for debugging or missing dependencies)
 */
function onComplete(id) {
  console.log(id + ".onComplete");

  // Special handling for character fade-in animation completion
  if (id == "fadeInChars") {
    // FUTURE ENHANCEMENT: TextParty gel animation on main title
    // Commented out - may require Config.WGParams and TextParty.gel() implementation
    // addTimeline(TextParty.gel("main-title", Config.WGParams));
  }

  // TODO: Add animation completion analytics
  // TODO: Implement animation chaining for complex sequences
  // TODO: Add cleanup for completed animations if needed
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To enable full animation system:
 * 1. Ensure HTML elements exist: main-header, work, biography
 * 2. Verify section controllers (Hero, Work, Biography) have animations enabled
 * 3. Check StageManager is properly coordinating scroll events
 * 4. Test animation lifecycle callbacks across different sections
 *
 * To debug animation issues:
 * - Check browser console for lifecycle callback logs
 * - Verify DOM elements exist before section controller initialization
 * - Test scroll performance and animation synchronization
 * - Monitor for ScrollTrigger conflicts between sections
 *
 * To extend animation system:
 * - Add animation state management to lifecycle callbacks
 * - Implement cross-section animation coordination
 * - Add performance monitoring and optimization
 * - Create animation presets and configuration management
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Coordinates with main.js or app initialization system
 * - May be loaded via script tag or ES6 module import
 * - Section controllers integrate with GSAP ScrollTrigger system
 * - StageManager coordinates with browser scroll events
 *
 * PERFORMANCE CONSIDERATIONS:
 * - window.onload waits for all assets - may delay animation start
 * - Consider DOMContentLoaded for faster initialization if assets not critical
 * - Lifecycle callbacks called frequently - keep processing minimal
 * - StageManager optimizes scroll events to prevent performance issues
 *
 * @fileend Director.js - Master animation choreography controller
 */
