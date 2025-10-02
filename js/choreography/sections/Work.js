/**
 * Work Section Choreographer
 *
 * CRITICAL WARNING: This class orchestrates complex animations and visual effects for project category sections.
 * If you modify this without understanding the complete animation pipeline, you WILL break:
 * - Scroll-triggered section animations
 * - Printer mark overlays on project categories
 * - GSAP timeline synchronization
 * - Visual hierarchy and entrance effects
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: .project-category sections in njk/_includes/organisms/section/project-category.njk
 * - CSS: PrintMarks styles in styles/backgrounds/PrintMarks.css
 * - Animation: GSAP ScrollTrigger plugin (gsap-core.js + ScrollTrigger.js)
 * - Effects: PrinterMarks.js display system and TextParty.js animation library
 *
 * ARCHITECTURE NOTES:
 * - Uses ES6 modules with /assets/js/ absolute paths (client-side routing)
 * - Registers ScrollTrigger plugin globally for timeline coordination
 * - Applies decorative printer marks to each .project-category section
 * - Implements scroll-based entrance animations with transform origins
 *
 * DEBUGGING GOTCHAS:
 * - ScrollTrigger start/end points are viewport-relative ("top 65%", "top bottom")
 * - Transform origins MUST be set before animations or elements will jump
 * - PrinterMarks.add() modifies DOM structure by inserting overlay divs
 * - Animation timelines are paused by default and triggered by scroll
 * - GSAP registration MUST happen before class instantiation
 *
 * DO NOT REMOVE: gsap.registerPlugin(ScrollTrigger) - required for all scroll animations
 *
 * @fileoverview Choreographs work section animations with printer mark overlays and scroll triggers
 * @requires gsap-core.js - Core GSAP animation library
 * @requires ScrollTrigger.js - Scroll-based animation triggers
 * @requires PrinterMarks.js - Print industry registration mark overlays
 * @requires TextParty.js - Text animation effects library (currently commented)
 */

import gsap from "/assets/js/gsap/gsap-core.js";
import ScrollTrigger from "/assets/js/gsap/ScrollTrigger.js";
import * as PrinterMarks from "/assets/js/displays/PrinterMarks.js";
import * as TextParty from "/assets/js/effects/TextParty.js";

// CRITICAL: Must register ScrollTrigger before any timeline creation
gsap.registerPlugin(ScrollTrigger);
/**
 * Work Section Animation Controller
 *
 * Orchestrates visual effects for project category sections including:
 * - Dynamic printer mark overlays on each .project-category section
 * - Scroll-triggered entrance animations with rotation and translation
 * - GSAP timeline coordination for smooth visual flow
 *
 * CRITICAL: Constructor currently has setTitles() and initAnimation() commented out.
 * Uncomment these to enable full animation suite. They're disabled for debugging.
 */
export default class Work {
  /**
   * Initialize Work section choreographer
   *
   * @param {HTMLElement} elem - Container element (currently unused but reserved for future expansion)
   * @returns {HTMLElement} Returns the input element (pass-through pattern)
   *
   * WARNING: Animation methods are currently commented out in constructor.
   * To enable full animation suite, uncomment:
   * - this.setTitles() - Applies printer marks and scroll triggers to project categories
   * - this.initAnimation() - Sets up main work section entrance animation
   */
  constructor(elem) {
    // DEBUGGING: Animation calls commented out - uncomment to enable full effect suite
    // this.setTitles();
    // CRITICAL: Apply printer marks overlay - modifies DOM by inserting .printmarks container
    PrinterMarks.add(elem);
    // this.initAnimation();
    return elem;
  }

  /**
   * Apply printer marks and scroll animations to project category sections
   *
   * CRITICAL FUNCTION: This method transforms static .project-category sections into
   * animated elements with print industry registration marks.
   *
   * WHAT IT DOES:
   * 1. Finds all .project-category sections in the DOM
   * 2. Applies PrinterMarks.add() to each - creates overlay divs with printer registration marks
   * 3. Creates ScrollTrigger instances for entrance animations on each section
   *
   * DEPENDENCY CHAIN (break at your peril):
   * - HTML: .project-category sections must exist in DOM (from project-category.njk template)
   * - CSS: PrintMarks.css styles must be loaded for visual registration marks
   * - JS: ScrollTrigger must be registered before this runs
   *
   * ANIMATION DETAILS:
   * - Trigger point: "top 65%" (when section top hits 65% down viewport)
   * - Animation: this.sectionIntro() creates rotation + translation entrance effect
   * - TextParty.gel() is commented out - uncomment for wandering gel text effects
   *
   * DEBUGGING NOTES:
   * - If printer marks don't appear: check PrintMarks.css is loaded and styles/main.css imports it
   * - If animations don't trigger: verify ScrollTrigger registration and viewport calculations
   * - If sections not found: ensure .project-category class exists in generated HTML
   *
   * @method setTitles
   * @memberof Work
   */
  setTitles() {
    // Find all project category sections - these come from project-category.njk template
    const sections = document.querySelectorAll(".project-category");

    sections.forEach((section) => {
      // Create scroll-triggered entrance animation for this specific section
      ScrollTrigger.create({
        trigger: section, // Element that triggers the animation
        animation: this.sectionIntro(section), // Animation timeline from sectionIntro()
        start: "top 65%", // Trigger when section top hits 65% down viewport

        // FUTURE ENHANCEMENT: Uncomment for wandering gel text effects on headings
        // animation: TextParty.gel(section.querySelector(".wandering-gel"), ["text-secondary/90","text-primary/90",]),
      });
    });
  }

  /**
   * Create entrance animation timeline for individual project sections
   *
   * Generates a subtle entrance effect with rotation and horizontal translation.
   * Used by setTitles() to create per-section ScrollTrigger animations.
   *
   * ANIMATION MECHANICS:
   * - gsap.from() animates FROM these values TO their natural state (0, 0, 0°)
   * - Transform origin "top 80%" ensures rotation pivots near section top
   * - x: 10 creates slight rightward offset that animates to natural position
   * - rotation: -10 creates counter-clockwise tilt that straightens on entry
   * - ease: "sine.in" provides smooth acceleration into natural state
   *
   * CRITICAL: Transform origin MUST be set or elements will rotate around center,
   * causing visual jumps and awkward motion paths.
   *
   * @param {HTMLElement} section - The .project-category section to animate
   * @returns {gsap.core.Timeline} GSAP animation timeline ready for ScrollTrigger
   *
   * WARNING: Modifying these values affects visual flow of entire work section.
   * Test thoroughly across different viewport sizes and scroll speeds.
   */
  sectionIntro(section) {
    return gsap.from(section, {
      transformOrigin: "top 80%", // Rotation pivot point - prevents center rotation jumps
      x: 10, // Horizontal offset - animates from 10px right to natural position
      rotation: -10, // Rotation offset - animates from -10° tilt to straight
      ease: "sine.in", // Smooth acceleration curve for natural entrance feel
    });
  }

  /**
   * Initialize main work section entrance animation with scroll pinning
   *
   * COMPLEX ANIMATION SETUP: Creates a pinned scroll animation for the main #work section.
   * This is separate from individual project category animations in setTitles().
   *
   * SCROLL TRIGGER CONFIGURATION:
   * - trigger: "#work" - Element that activates the animation
   * - pin: this._view - Pins the trigger element during animation (NOTE: this._view undefined!)
   * - pinSpacing: true - Maintains document flow spacing while pinned
   * - start: "top bottom" - Begins when #work top hits viewport bottom
   * - end: "top 25%" - Ends when #work top hits 25% down viewport
   * - scrub: 1 - Animation progress tied directly to scroll position
   *
   * CRITICAL BUG: this._view is undefined! This will cause errors if uncommented.
   * Should probably be `this.elem` or remove pinning entirely.
   *
   * ANIMATION DETAILS:
   * - Uses same entrance effect as sectionIntro() (rotation + translation)
   * - Timeline is paused by default, controlled by ScrollTrigger
   * - ID "workIntro" allows for timeline debugging and control
   *
   * @method initAnimation
   * @memberof Work
   *
   * WARNING: Contains undefined variable this._view in pin configuration!
   * Fix before enabling or remove pin/pinSpacing properties.
   */
  initAnimation() {
    // ScrollTrigger configuration for main work section entrance
    // CRITICAL BUG: this._view is undefined - will throw error if pin is used
    const work_trigger = {
      trigger: "#work", // Main work section element
      pin: this._view, // BUG: this._view undefined! Fix before enabling
      pinSpacing: true, // Maintain spacing during pin animation
      start: "top bottom", // Start when #work top hits viewport bottom
      end: "top 25%", // End when #work top hits 25% down viewport
      scrub: 1, // Animation progress tied to scroll position
    };

    // Create paused timeline for work section entrance
    // Animation mirrors sectionIntro() but applies to entire #work container
    const work_intro = gsap.timeline({ paused: true });
    work_intro.from("#work", {
      id: "workIntro", // Timeline identifier for debugging
      scrollTrigger: work_trigger, // Attach scroll trigger configuration
      transformOrigin: "top 80%", // Rotation pivot - prevents center rotation
      x: 10, // Horizontal offset for entrance effect
      rotation: -10, // Rotation offset for subtle tilt entrance
      ease: "sine.in", // Smooth acceleration curve
    });
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To enable full Work section animation suite:
 * 1. Uncomment this.setTitles() and this.initAnimation() in constructor
 * 2. Fix this._view undefined bug in initAnimation() (use this.elem or remove pin)
 * 3. Ensure PrintMarks.css is imported in styles/main.css
 * 4. Verify .project-category sections exist in generated HTML
 *
 * To customize animations:
 * - Modify sectionIntro() values for different entrance effects
 * - Adjust ScrollTrigger start/end points for timing changes
 * - Uncomment TextParty.gel() for additional text effects
 *
 * To debug animation issues:
 * - Check browser console for ScrollTrigger errors
 * - Use GSAP timeline IDs ("workIntro") for debugging
 * - Verify transform origins are appropriate for your design
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Called by main choreography system (likely from main.js or similar)
 * - Coordinates with PrinterMarks display system
 * - May integrate with other section animators (Intro.js, etc.)
 *
 * @fileend Work.js - Work section animation choreographer
 */

// TODO: Initialize the view by setting up the container and adding static elements
// This comment suggests additional setup code was planned but not implemented
