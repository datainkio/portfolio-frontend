/**
 * Work Section Choreographer
 *
 * CRITICAL WARNING: This class orchestrates complex animations and visual effects for project category sections.
 * If you modify this without understanding the complete animation pipeline, you WILL break:
 * - Work section intro fade-in animations
 * - Scroll-triggered project category entrance animations
 * - Printer mark overlays on project categories
 * - Event-driven choreography coordination with other sections
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: #work section with .project-category children
 * - CSS: PrintMarks styles in styles/backgrounds/PrintMarks.css
 * - Animation: GSAP ScrollTrigger plugin for scroll-based animations
 * - Effects: PrinterMarks.js display system
 * - AnimationBus: Event emission for section coordination
 *
 * ARCHITECTURE NOTES:
 * - Extends BaseSection for standard animation lifecycle
 * - Emits events at animation milestones for sequence coordination
 * - Intro animation: Fade in work section
 * - Scroll-based animations: Individual project category entrances
 * - PrinterMarks: Decorative overlays on project categories
 *
 * ANIMATION LIFECYCLE:
 * 1. Constructor initializes section with BaseSection
 * 2. createIntro() builds fade-in timeline
 * 3. createScrollTriggers() sets up project category animations
 * 4. playIntro() triggered by sequence coordinator
 * 5. Project categories animate in as user scrolls
 *
 * DEBUGGING GOTCHAS:
 * - ScrollTrigger start/end points are viewport-relative ("top 65%")
 * - Transform origins MUST be set before animations or elements will jump
 * - PrinterMarks.add() modifies DOM structure by inserting overlay divs
 * - Event emission timing critical for sequence coordination
 *
 * DO NOT REMOVE: Event emission in animations - required for choreography coordination
 *
 * @fileoverview Work section intro/outro animations with event-driven coordination
 * @requires BaseSection - Foundation class for section controllers
 * @requires ScrollTrigger - Scroll-based animation triggers
 * @requires PrinterMarks - Print industry registration mark overlays
 */

import { BaseSection } from './BaseSection.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import { gsap } from '/assets/js/gsap/all.js';
import * as PrinterMarks from '/assets/js/displays/PrinterMarks.js';

/**
 * WORK ANIMATION CONSTANTS
 *
 * CRITICAL: These values are precisely tuned for work section visual flow.
 * Modify with extreme caution - small changes can break entrance experience.
 *
 * INTRO ANIMATION:
 * - INTRO_DURATION: 1.0s = Duration of work section fade-in
 * - INTRO_Y: 50 = Pixels of upward movement during intro
 * - INTRO_EASE: "power2.out" = Smooth deceleration curve
 *
 * PROJECT CATEGORY ANIMATIONS:
 * - CATEGORY_START: "top 65%" = Category entrance when top hits 65% down viewport
 * - CATEGORY_ROTATION: -10 = Degrees of counter-clockwise rotation for entrance
 * - CATEGORY_X: 10 = Pixels of horizontal offset for entrance
 * - CATEGORY_ORIGIN: "top 80%" = Rotation pivot point
 * - CATEGORY_EASE: "sine.in" = Smooth acceleration curve
 */

// Work section intro settings
const INTRO_DURATION = 1.0;
const INTRO_Y = 50;
const INTRO_EASE = 'power2.out';

// Project category entrance settings
const CATEGORY_START = 'top 65%';
const CATEGORY_ROTATION = -10;
const CATEGORY_X = 10;
const CATEGORY_ORIGIN = 'top 80%';
const CATEGORY_EASE = 'sine.in';

/**
 * Work Section Animation Controller
 *
 * Orchestrates work section intro and project category entrance animations.
 * Applies printer marks to project categories for visual branding.
 *
 * ANIMATION LIFECYCLE:
 * 1. Constructor initializes via BaseSection
 * 2. createIntro() builds fade-in timeline
 * 3. createScrollTriggers() sets up category animations
 * 4. playIntro() executed by sequence coordinator
 * 5. Categories animate in as user scrolls
 *
 * CRITICAL: This class expects #work element with .project-category children in DOM
 */
export default class Work extends BaseSection {
  /**
   * Initialize Work section controller
   *
   * CRITICAL INITIALIZATION: Sets up work section with standard animation lifecycle.
   * Calls BaseSection constructor then builds intro and scroll trigger animations.
   *
   * INITIALIZATION SEQUENCE:
   * 1. Call super() to initialize BaseSection with 'work' ID
   * 2. Apply printer marks to work section element
   * 3. Build intro animation timeline
   * 4. Build scroll-triggered category animations
   *
   * @param {AnimationBus} bus - Event bus for animation coordination
   * @param {ScrollSmoother|null} smoother - ScrollSmoother instance or null
   *
   * DEFENSIVE: Warns if element not found but doesn't crash
   */
  constructor(bus, smoother) {
    // Initialize BaseSection with work section ID
    super('work', bus, smoother);

    if (!this.element) {
      console.warn('[Work] #work element not found - animations disabled');
      return;
    }

    // Apply printer marks overlay to work section
    PrinterMarks.add(this.element);

    // Build animation sequences
    this.createIntro();
    this.createScrollTriggers();
  }

  /**
   * Create work section intro animation
   *
   * INTRO SEQUENCE: Fades in work section with upward motion for entrance.
   * Uses BaseSection timeline for coordinated playback via playIntro().
   *
   * ANIMATION MECHANICS:
   * - Starts with section invisible (opacity: 0) and below natural position (y: 50)
   * - Animates to visible (opacity: 1) and natural position (y: 0)
   * - Power2.out easing creates smooth deceleration
   *
   * TIMELINE COORDINATION:
   * - Built on this.timeline from BaseSection
   * - playIntro() method controls playback
   * - Events emitted automatically by BaseSection
   *
   * @override BaseSection.createIntro()
   */
  createIntro() {
    if (!this.element) return;

    // Fade in work section with upward motion
    this.timeline.from(this.element, {
      opacity: 0,
      y: INTRO_Y,
      duration: INTRO_DURATION,
      ease: INTRO_EASE,
    });
  }

  /**
   * Create scroll-triggered project category animations
   *
   * SCROLL INTEGRATION: Sets up entrance animations for each .project-category
   * that trigger as user scrolls them into view.
   *
   * ANIMATION MECHANICS:
   * - Each category gets individual ScrollTrigger
   * - Entrance effect: slight rotation + horizontal translation
   * - Transform origin prevents center rotation jumps
   * - Triggers when category top hits 65% down viewport
   *
   * EVENT COORDINATION:
   * - Emits section:work:scroll:enter when work section enters viewport
   * - Emits section:work:scroll:exit when work section exits viewport
   *
   * @override BaseSection.createScrollTriggers()
   */
  createScrollTriggers() {
    if (!this.element) return;

    // Find all project category sections
    const categories = this.element.querySelectorAll('.project-category');

    if (categories.length === 0) {
      console.warn('[Work] No .project-category elements found');
      return;
    }

    // Create scroll-triggered entrance animation for each category
    categories.forEach(category => {
      ScrollTrigger.create({
        trigger: category,
        start: CATEGORY_START,
        animation: gsap.from(category, {
          transformOrigin: CATEGORY_ORIGIN,
          x: CATEGORY_X,
          rotation: CATEGORY_ROTATION,
          ease: CATEGORY_EASE,
        }),
      });
    });

    // Create scroll trigger for work section itself to emit events
    ScrollTrigger.create({
      trigger: this.element,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        this.isScrollActive = true;
        this.bus.emit(`section:${this.id}:scroll:enter`, {
          sectionId: this.id,
          element: this.element,
        });
      },
      onLeave: () => {
        this.isScrollActive = false;
        this.bus.emit(`section:${this.id}:scroll:exit`, {
          sectionId: this.id,
          element: this.element,
        });
      },
    });
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To use Work section in choreography:
 * ```javascript
 * import Work from './sections/Work.js';
 * import { AnimationBus } from './AnimationBus.js';
 *
 * const bus = new AnimationBus();
 * const smoother = ScrollSmoother.create({ ... });
 * const work = new Work(bus, smoother);
 *
 * // Play intro animation
 * await work.playIntro();
 *
 * // Listen for events
 * bus.on('section:work:intro:complete', () => {
 *   console.log('Work intro done!');
 * });
 * ```
 *
 * To customize animation timing:
 * - Modify constants at top of file (INTRO_DURATION, CATEGORY_ROTATION, etc.)
 * - Adjust CATEGORY_START for different scroll trigger points
 * - Change easing functions for different motion feel
 *
 * To debug animation issues:
 * 1. Enable AnimationBus debug mode: bus.enableDebug(true)
 * 2. Check console for event emission
 * 3. Verify #work and .project-category elements exist in DOM
 * 4. Use ScrollTrigger.defaults({ markers: true }) to visualize triggers
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Each .project-category creates individual ScrollTrigger - test with many categories
 * - Printer marks add DOM elements - monitor performance with many sections
 * - Intro animation runs once when triggered by sequence
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Extends BaseSection for standard lifecycle
 * - Emits events via AnimationBus for sequence coordination
 * - Works with or without ScrollSmoother
 * - Coordinates with other section controllers via events
 * - PrinterMarks.add() modifies DOM structure - ensure CSS loaded
 *
 * @fileend Work.js - Work section intro/outro animation controller
 */
