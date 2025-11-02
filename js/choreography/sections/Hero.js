/** @format */

/**
 * Hero Section Choreographer
 *
 * CRITICAL WARNING: This class orchestrates the hero section's complex scroll-based animations.
 * If you modify this without understanding the complete GSAP pipeline, you WILL break:
 * - Hero title intro fade-in with upward motion
 * - Hero title blowaway outro animation with rotation and translation
 * - Scroll-triggered animation coordination with other sections
 * - Event-driven choreography sequences across the entire site
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: Hero section (#main-header) with h1 title element
 * - CSS: Transform origins and positioning for rotation animations
 * - Animation: GSAP ScrollTrigger with precise timing and event coordination
 * - AnimationBus: Event emission for section coordination
 *
 * ARCHITECTURE NOTES:
 * - Extends BaseSection for standard animation lifecycle
 * - Emits events at animation milestones for sequence coordination
 * - Intro animation: Fade in title with upward motion
 * - Outro animation: Scroll-triggered rotation and slide off-screen
 * - Integrates with ScrollSmoother when available for smooth scrolling
 *
 * ANIMATION LIFECYCLE:
 * 1. Constructor initializes section with BaseSection
 * 2. createIntro() builds fade-in timeline
 * 3. createScrollTriggers() sets up scroll-based outro
 * 4. playIntro() triggered by sequence coordinator
 * 5. Scroll-based outro triggers automatically via ScrollTrigger
 *
 * DEBUGGING GOTCHAS:
 * - ScrollSmoother can conflict with other scroll libraries - check for interference
 * - Pin spacing affects document flow and can cause layout shifts
 * - Transform origins must be precise or title will rotate from wrong pivot point
 * - Scrub values tie animation to scroll speed - test on different devices/browsers
 * - Event emission timing critical for sequence coordination
 *
 * DO NOT REMOVE: Event emission in animations - required for choreography coordination
 *
 * @fileoverview Hero section intro/outro animations with event-driven coordination
 * @requires BaseSection - Foundation class for section controllers
 * @requires ScrollTrigger - Scroll-based animation triggers
 */

import { BaseSection } from './BaseSection.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import { gsap } from '/assets/js/gsap/all.js';
import * as TextParty from '/assets/js/effects/TextParty.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * HERO ANIMATION CONSTANTS
 *
 * CRITICAL: These values are precisely tuned for the hero section's visual flow.
 * Modify with extreme caution - small changes can break the entire entrance experience.
 *
 * INTRO ANIMATION:
 * - INTRO_DURATION: 1.2s = Duration of fade-in animation
 * - INTRO_Y: 100 = Pixels of upward movement during intro
 * - INTRO_EASE: "power3.out" = Smooth deceleration curve
 *
 * SCROLL TRIGGER TIMING:
 * - START: "center center" = Outro begins when h1 center hits viewport center
 * - END: "bottom center" = Outro ends when h1 bottom hits viewport center
 * - These create the scroll range where the blowaway animation occurs
 *
 * ANIMATION MECHANICS:
 * - SCRUB: 1 = Animation progress tied 1:1 with scroll position (no lag)
 *
 * TRANSFORM BEHAVIOR:
 * - ROTATION: -15 = Degrees of counter-clockwise rotation for dramatic exit
 * - DESTINATION_X: -200 = Final X position (negative = leftward movement off-screen)
 * - EASE: "sine.out" = Smooth deceleration curve for natural motion
 *
 * WARNING: Changing these without testing across viewport sizes will break visual flow
 */

// Intro animation settings
const INTRO_DURATION = 1.2; // Fade-in duration in seconds
const INTRO_Y = 100; // Upward movement distance in pixels
const INTRO_EASE = 'power3.out'; // Smooth deceleration for intro

// ScrollTrigger timing configuration for outro
const START = 'center center'; // Outro start point - h1 center hits viewport center
const END = 'bottom center'; // Outro end point - h1 bottom hits viewport center
const SCRUB = 1; // Animation tied 1:1 to scroll position (no lag/delay)

// Title blowaway animation parameters
const ROTATION = -15; // Counter-clockwise rotation in degrees for dramatic exit
const DESTINATION_X = -200; // Final X position - negative moves title leftward off-screen
const EASE = 'sine.out'; // Smooth deceleration curve for natural motion feel

/**
 * Hero Section Animation Controller
 *
 * Orchestrates the hero section's intro fade-in and scroll-based "blowaway" outro
 * animation where the title rotates and slides off-screen as user scrolls.
 *
 * ANIMATION LIFECYCLE:
 * 1. Constructor initializes via BaseSection
 * 2. createIntro() builds fade-in timeline
 * 3. createScrollTriggers() sets up scroll-based outro
 * 4. playIntro() executed by sequence coordinator
 * 5. Outro triggers automatically on scroll
 *
 * CRITICAL: This class expects #main-header element with h1 child in DOM
 */
export default class Hero extends BaseSection {
  /**
   * Initialize Hero section controller
   *
   * CRITICAL INITIALIZATION: Sets up hero section with standard animation lifecycle.
   * Calls BaseSection constructor then builds intro and scroll trigger animations.
   *
   * INITIALIZATION SEQUENCE:
   * 1. Call super() to initialize BaseSection with 'main-header' ID
   * 2. Store references to h1 title element
   * 3. Build intro animation timeline
   * 4. Build scroll-triggered outro animation
   *
   * @param {AnimationBus} bus - Event bus for animation coordination
   * @param {ScrollSmoother|null} smoother - ScrollSmoother instance or null
   *
   * DEFENSIVE: Warns if element not found but doesn't crash
   */
  constructor(bus, smoother) {
    // Initialize BaseSection with hero section ID
    super('main-header', bus, smoother);

    // Store reference to h1 title element for animations
    this.titleElement = this.element ? this.element.querySelector('h1') : null;

    // Store reference to intro timeline for reversing on scroll exit
    this.rollTimeline = null;

    if (!this.titleElement) {
      console.warn('[Hero] h1 element not found - animations disabled');
      return;
    }

    // Build animation sequences
    this.createIntro();
    this.createScrollTriggers();
  }

  /**
   * Create hero intro animation
   *
   * INTRO SEQUENCE: Uses TextParty.roll() for dramatic title entrance with rolling text effect.
   * Integrates with TextParty event system to coordinate with BaseSection lifecycle.
   *
   * ANIMATION MECHANICS:
   * - TextParty.roll() creates rolling text entrance animation
   * - Settings define animation behavior (duration, stagger, etc.)
   * - TextParty events (onTextPartyComplete) trigger BaseSection intro:complete
   * - Timeline added to BaseSection timeline for unified control
   *
   * EVENT COORDINATION:
   * - Listens for 'onTextPartyComplete' custom event
   * - Emits section:main-header:intro:complete via BaseSection
   * - Allows LandingSequence to react to TextParty animation completion
   *
   * TIMELINE COORDINATION:
   * - TextParty.roll() returns GSAP timeline
   * - Added to this.timeline from BaseSection for playIntro() control
   * - Events emitted automatically by BaseSection + TextParty system
   *
   * @override BaseSection.createIntro()
   */
  createIntro() {
    if (!this.titleElement) return;

    // TextParty.roll settings for hero title animation
    const rollSettings = {
      id: 'hero-title-roll', // Required for event system
      duration: INTRO_DURATION,
      stagger: 0.05,
      ease: INTRO_EASE,
      rotation: 15, // Initial rotation in degrees
      y_delta: INTRO_Y, // Vertical offset distance
    };

    // Create TextParty roll animation timeline
    // Store reference for reversing on scroll exit
    this.rollTimeline = TextParty.roll(this.titleElement, rollSettings);

    // Add TextParty timeline to BaseSection timeline
    this.timeline.add(this.rollTimeline, 0);

    // Listen for TextParty completion event
    // This coordinates TextParty's event system with BaseSection lifecycle
    document.addEventListener('onTextPartyComplete', event => {
      // Verify this is our timeline completing
      if (event.detail && event.detail.id === this.rollTimeline.vars.id) {
        console.log('[Hero] TextParty rol  animation complete');
        // BaseSection will emit intro:complete automatically when timeline finishes
      }
    });
  }

  /**
   * Create scroll-triggered outro animation
   *
   * OUTRO SEQUENCE: Reverses the TextParty.roll intro animation as user scrolls past.
   * Creates symmetrical entrance/exit where text rolls in on intro and rolls back out on scroll.
   *
   * SCROLL INTEGRATION:
   * - Trigger: h1 element (title) activates scroll detection
   * - Start: Animation begins when title center hits viewport center
   * - End: Animation completes when title bottom hits viewport center
   * - Scrub: 1 = Animation progress tied 1:1 with scroll position
   *
   * ANIMATION MECHANICS:
   * - Tweens from current (rolled-in) state back to pre-intro state
   * - Characters rotate and skew back to their original positions
   * - Creates mirror effect of the entrance animation
   * - Tied directly to scroll progress for smooth interactive feel
   *
   * EVENT COORDINATION:
   * - Emits section:main-header:scroll:exit when animation starts
   * - Emits section:main-header:outro:start for sequence coordination
   * - Other sections can react to hero exit via event listeners
   *
   * @override BaseSection.createScrollTriggers()
   */
  createScrollTriggers() {
    if (!this.titleElement || !this.rollTimeline) return;

    // Get the final values from intro animation to animate back from
    // We'll create the reverse by tweening from current state back to start
    const rollSettings = {
      id: 'hero-title-roll-reverse',
      duration: INTRO_DURATION,
      stagger: 0.05,
      ease: INTRO_EASE,
      rotation: 15,
      y_delta: INTRO_Y,
    };

    // Create reverse animation: animate from rolled-in state back to pre-roll state
    const reverseTimeline = gsap.timeline();
    const chars = this.titleElement.querySelectorAll('.text-roll-char');

    if (chars.length > 0) {
      reverseTimeline.to(chars, {
        duration: rollSettings.duration,
        rotation: 0 - rollSettings.rotation,
        skewY: '1.2rad',
        y: rollSettings.y_delta,
        stagger: {
          each: 0.1,
          ease: 'power1.inOut',
        },
        ease: rollSettings.ease,
      });
    }

    // Create scroll-triggered outro animation
    ScrollTrigger.create({
      trigger: this.titleElement, // h1 element triggers scroll detection
      start: START, // "center center" - animation start point
      end: END, // "bottom center" - animation end point
      scrub: SCRUB, // Animation tied 1:1 to scroll position
      onEnter: () => {
        // Emit scroll enter event for coordination
        this.bus.emit(`section:${this.id}:scroll:enter`, {
          sectionId: this.id,
          element: this.element,
        });
      },
      onLeave: () => {
        // Emit scroll exit and outro start events
        this.bus.emit(`section:${this.id}:scroll:exit`, {
          sectionId: this.id,
          element: this.element,
        });
        this.bus.emit(`section:${this.id}:outro:start`, {
          sectionId: this.id,
          element: this.element,
        });
      },
      // Outro animation: reverse of intro roll effect
      animation: reverseTimeline,
    });
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To use Hero section in choreography:
 * ```javascript
 * import Hero from './sections/Hero.js';
 * import { AnimationBus } from './AnimationBus.js';
 *
 * const bus = new AnimationBus();
 * const smoother = ScrollSmoother.create({ ... });
 * const hero = new Hero(bus, smoother);
 *
 * // Play intro animation
 * await hero.playIntro();
 *
 * // Listen for events
 * bus.on('section:main-header:intro:complete', () => {
 *   console.log('Hero intro done!');
 * });
 * ```
 *
 * To customize animation timing:
 * - Modify constants at top of file (INTRO_DURATION, ROTATION, etc.)
 * - Adjust START/END points for different scroll trigger ranges
 * - Change easing functions for different motion feel
 *
 * To debug animation issues:
 * 1. Enable AnimationBus debug mode: bus.enableDebug(true)
 * 2. Check console for event emission
 * 3. Verify #main-header and h1 elements exist in DOM
 * 4. Use ScrollTrigger.defaults({ markers: true }) to visualize triggers
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Scroll-based outro tied directly to scroll position - ensure smooth performance
 * - Intro animation runs once on page load - optimize for first impression
 * - Test across viewport sizes and scroll speeds
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Extends BaseSection for standard lifecycle
 * - Emits events via AnimationBus for sequence coordination
 * - Works with or without ScrollSmoother
 * - Coordinates with other section controllers via events
 *
 * @fileend Hero.js - Hero section intro/outro animation controller
 */
