/**
 * Biography Section Choreographer
 *
 * CRITICAL WARNING: This class orchestrates biography section list item reveal animations.
 * If you modify this without understanding the complete animation pipeline, you WILL break:
 * - Biography section intro fade-in animations
 * - Individual list item staggered reveal on scroll
 * - Event-driven choreography coordination with other sections
 * - Scroll-based animation triggers for progressive disclosure
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: #biography section with ul > li structure
 * - Animation: GSAP ScrollTrigger plugin for scroll-based animations
 * - AnimationBus: Event emission for section coordination
 *
 * ARCHITECTURE NOTES:
 * - Extends BaseSection for standard animation lifecycle
 * - Emits events at animation milestones for sequence coordination
 * - Intro animation: Fade in biography section
 * - Scroll-based animations: Individual list item reveals as user scrolls
 * - Progressive disclosure: Items invisible until scrolled into view
 *
 * ANIMATION LIFECYCLE:
 * 1. Constructor initializes via BaseSection
 * 2. createIntro() builds fade-in timeline
 * 3. createScrollTriggers() sets up list item reveals
 * 4. playIntro() triggered by sequence coordinator
 * 5. List items fade in as user scrolls them into view
 *
 * DEBUGGING GOTCHAS:
 * - List items start with opacity: 0 - won't be visible until scroll
 * - Each list item gets individual ScrollTrigger - performance with many items
 * - Event emission timing critical for sequence coordination
 * - ScrollTrigger start point "center center" triggers mid-viewport
 *
 * DO NOT REMOVE: Event emission in animations - required for choreography coordination
 *
 * @fileoverview Biography section intro and list item reveal animations
 * @requires BaseSection - Foundation class for section controllers
 * @requires ScrollTrigger - Scroll-based animation triggers
 */

import { BaseSection } from '../base-section/BaseSection.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import { gsap } from '/assets/js/gsap/all.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * BIOGRAPHY ANIMATION CONSTANTS
 *
 * CRITICAL: These values are precisely tuned for biography section visual flow.
 * Modify with extreme caution - small changes can break reading experience.
 *
 * INTRO ANIMATION:
 * - INTRO_DURATION: 1.0s = Duration of biography section fade-in
 * - INTRO_Y: 50 = Pixels of upward movement during intro
 * - INTRO_EASE: "power2.out" = Smooth deceleration curve
 *
 * LIST ITEM ANIMATIONS:
 * - ITEM_START: "center center" = Item reveals when center hits viewport center
 * - ITEM_DURATION: 0.5s = Duration of individual item fade-in
 * - ITEM_EASE: "power2.out" = Smooth deceleration curve
 */

// Biography section intro settings
const INTRO_DURATION = 1.0;
const INTRO_Y = 50;
const INTRO_EASE = 'power2.out';

// List item reveal settings
const ITEM_START = 'center center';
const ITEM_DURATION = 0.5;
const ITEM_EASE = 'power2.out';

/**
 * Biography Section Animation Controller
 *
 * Orchestrates biography section intro and progressive list item reveals.
 * Creates immersive reading experience with scroll-based content disclosure.
 *
 * ANIMATION LIFECYCLE:
 * 1. Constructor initializes via BaseSection
 * 2. createIntro() builds fade-in timeline
 * 3. createScrollTriggers() sets up list item reveals
 * 4. playIntro() executed by sequence coordinator
 * 5. List items fade in as user scrolls
 *
 * CRITICAL: This class expects #biography element with ul > li structure in DOM
 */
export default class Biography extends BaseSection {
  /**
   * Initialize Biography section controller
   *
   * CRITICAL INITIALIZATION: Sets up biography section with standard animation lifecycle.
   * Calls BaseSection constructor then builds intro and scroll trigger animations.
   *
   * INITIALIZATION SEQUENCE:
   * 1. Call super() to initialize BaseSection with 'biography' ID
   * 2. Build intro animation timeline
   * 3. Build scroll-triggered list item reveals
   *
   * @param {AnimationBus} bus - Event bus for animation coordination
   * @param {ScrollSmoother|null} smoother - ScrollSmoother instance or null
   *
   * DEFENSIVE: Warns if element not found but doesn't crash
   */
  constructor(bus, smoother) {
    // Initialize BaseSection with biography section ID
    super('biography', bus, smoother);

    if (!this.element) {
      console.warn('[Biography] #biography element not found - animations disabled');
      return;
    }

    // Build animation sequences
    this.createIntro();
    this.createScrollTriggers();
  }

  /**
   * Create biography section intro animation
   *
   * INTRO SEQUENCE: Fades in biography section with upward motion for entrance.
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

    // Fade in biography section with upward motion
    this.timeline.from(this.element, {
      opacity: 0,
      y: INTRO_Y,
      duration: INTRO_DURATION,
      ease: INTRO_EASE,
    });
  }

  /**
   * Create scroll-triggered list item reveal animations
   *
   * PROGRESSIVE DISCLOSURE: Sets up individual fade-in animations for each
   * biography list item as user scrolls them into view. Creates immersive
   * reading experience where content reveals progressively.
   *
   * ANIMATION MECHANICS:
   * - All list items start invisible (opacity: 0)
   * - Individual ScrollTrigger created for each item
   * - Item fades in when center hits viewport center
   * - Each item animates independently as user scrolls
   *
   * PERFORMANCE NOTE:
   * - Creates one ScrollTrigger per list item - test with many items
   * - Consider batch processing if performance issues with large biographies
   *
   * EVENT COORDINATION:
   * - Emits section:biography:scroll:enter when biography enters viewport
   * - Emits section:biography:scroll:exit when biography exits viewport
   * - Individual items don't emit events (too many would flood bus)
   *
   * @override BaseSection.createScrollTriggers()
   */
  createScrollTriggers() {
    if (!this.element) return;

    // Find all biography list items
    const listItems = this.element.querySelectorAll('li');

    if (listItems.length === 0) {
      console.warn('[Biography] No list items found in #biography');
      return;
    }

    // Initialize all list items as invisible
    listItems.forEach(item => {
      gsap.set(item, { opacity: 0 });

      // Create individual ScrollTrigger for each list item
      ScrollTrigger.create({
        trigger: item,
        start: ITEM_START,
        onEnter: () => {
          // Fade in list item
          gsap.to(item, {
            opacity: 1,
            duration: ITEM_DURATION,
            ease: ITEM_EASE,
          });
        },

        // OPTIONAL: Uncomment to fade out when scrolling back up
        // onLeaveBack: () => {
        //   gsap.to(item, { opacity: 0, duration: ITEM_DURATION });
        // },
      });
    });

    // Create scroll trigger for biography section itself to emit events
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
 * To use Biography section in choreography:
 * ```javascript
 * import Biography from './sections/Biography.js';
 * import { AnimationBus } from './AnimationBus.js';
 *
 * const bus = new AnimationBus();
 * const smoother = ScrollSmoother.create({ ... });
 * const biography = new Biography(bus, smoother);
 *
 * // Play intro animation
 * await biography.playIntro();
 *
 * // Listen for events
 * bus.on('section:biography:intro:complete', () => {
 *   console.log('Biography intro done!');
 * });
 * ```
 *
 * To customize animation timing:
 * - Modify constants at top of file (INTRO_DURATION, ITEM_DURATION, etc.)
 * - Adjust ITEM_START for different scroll trigger points
 * - Change easing functions for different motion feel
 * - Uncomment onLeaveBack for fade-out on reverse scroll
 *
 * To debug animation issues:
 * 1. Enable AnimationBus debug mode: bus.enableDebug(true)
 * 2. Check console for event emission
 * 3. Verify #biography and li elements exist in DOM
 * 4. Use ScrollTrigger.defaults({ markers: true }) to visualize triggers
 * 5. Check that list items start invisible (opacity: 0)
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Each list item creates individual ScrollTrigger - monitor with many items
 * - Consider batch processing (ScrollTrigger.batch()) for large biographies
 * - Intro animation runs once when triggered by sequence
 * - Progressive disclosure improves perceived performance
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Extends BaseSection for standard lifecycle
 * - Emits events via AnimationBus for sequence coordination
 * - Works with or without ScrollSmoother
 * - Coordinates with other section controllers via events
 * - StageManager may pin overlay-view during biography scroll
 *
 * @fileend Biography.js - Biography section animation controller
 */
