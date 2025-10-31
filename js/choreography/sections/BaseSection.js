/**
 * BaseSection - Foundation Class for Section Animation Controllers
 *
 * CRITICAL WARNING: This is the BASE CLASS for ALL section animation controllers.
 * If you modify this without understanding inheritance patterns, you WILL break:
 * - Hero, Work, Biography section controller initialization and lifecycle
 * - Event emission for animation state changes across all sections
 * - Intro/outro timeline coordination and playback control
 * - ScrollTrigger integration and scroll-based animation triggers
 *
 * ARCHITECTURE NOTES:
 * - Provides standard interface for all section controllers (Hero, Work, Biography)
 * - Manages GSAP timeline creation and playback control
 * - Integrates with AnimationBus for event-driven coordination
 * - Handles ScrollSmoother integration when available
 * - Enforces consistent animation lifecycle across all sections
 *
 * STANDARD SECTION LIFECYCLE:
 * 1. Constructor: Initialize section, get DOM element, create timeline
 * 2. createIntro(): Build intro animation timeline (override in subclass)
 * 3. createOutro(): Build outro animation timeline (override in subclass)
 * 4. createScrollTriggers(): Set up scroll-based triggers (override in subclass)
 * 5. playIntro(): Execute intro and emit events
 * 6. playOutro(): Execute outro and emit events
 *
 * EVENT EMISSION PATTERN:
 * - section:[name]:intro:start    - Emitted when playIntro() called
 * - section:[name]:intro:complete - Emitted when intro animation finishes
 * - section:[name]:outro:start    - Emitted when playOutro() called
 * - section:[name]:outro:complete - Emitted when outro animation finishes
 *
 * INTEGRATION DEPENDENCIES:
 * - AnimationBus MUST be provided for event coordination
 * - GSAP MUST be available globally for timeline creation
 * - Section element MUST exist in DOM with matching ID
 * - ScrollSmoother optional but recommended for smooth scroll integration
 *
 * DEBUGGING GOTCHAS:
 * - Section element not found: Check DOM for matching ID
 * - Events not emitting: Verify AnimationBus passed to constructor
 * - Animations not playing: Check timeline creation in subclass override
 * - Timeline conflicts: Ensure only one timeline per section
 *
 * DO NOT REMOVE: Event emission in playIntro/playOutro - required for coordination
 * DO NOT CHANGE: Method signatures - breaks subclass implementations
 *
 * @fileoverview Base class for section animation controllers
 * @class BaseSection
 * @requires gsap - Global GSAP library for animation timeline creation
 * @requires AnimationBus - Event coordination system for section communication
 */

import { gsap } from '/assets/js/gsap/all.js';

export class BaseSection {
  /**
   * Initialize base section controller
   *
   * CRITICAL INITIALIZATION: Sets up foundation for section animation lifecycle.
   * Subclasses MUST call super(id, bus, smoother) in their constructor.
   *
   * INITIALIZATION SEQUENCE:
   * 1. Store section ID for event naming and DOM queries
   * 2. Store AnimationBus reference for event coordination
   * 3. Store ScrollSmoother instance (null if not available)
   * 4. Get section DOM element by ID
   * 5. Create paused GSAP timeline for animation control
   * 6. Initialize animation state flags
   *
   * STATE TRACKING:
   * - isIntroComplete: True when intro animation finished
   * - isOutroComplete: True when outro animation finished
   * - isScrollActive: True when section in viewport (subclass sets)
   *
   * @param {string} sectionId - DOM element ID for this section (e.g., 'main-header')
   * @param {AnimationBus} bus - Event bus for animation coordination
   * @param {ScrollSmoother|null} smoother - ScrollSmoother instance or null
   *
   * @example
   * class HeroSection extends BaseSection {
   *   constructor(bus, smoother) {
   *     super('main-header', bus, smoother);
   *     this.createIntro();
   *     this.createOutro();
   *     this.createScrollTriggers();
   *   }
   * }
   */
  constructor(sectionId, bus, smoother = null) {
    /**
     * Section element ID for DOM queries and event naming
     * @type {string}
     */
    this.id = sectionId;

    /**
     * AnimationBus instance for event coordination
     * @type {AnimationBus}
     */
    this.bus = bus;

    /**
     * ScrollSmoother instance (null if not available)
     * @type {ScrollSmoother|null}
     */
    this.smoother = smoother;

    /**
     * Section DOM element reference
     * @type {HTMLElement|null}
     */
    this.element = document.getElementById(sectionId);

    /**
     * Main animation timeline for this section
     * Created paused so playIntro/playOutro control playback
     * @type {gsap.core.Timeline}
     */
    this.timeline = gsap.timeline({ paused: true });

    /**
     * Intro animation completion state
     * @type {boolean}
     */
    this.isIntroComplete = false;

    /**
     * Outro animation completion state
     * @type {boolean}
     */
    this.isOutroComplete = false;

    /**
     * Scroll active state (set by subclass ScrollTriggers)
     * @type {boolean}
     */
    this.isScrollActive = false;

    // DEFENSIVE: Warn if element not found - section won't work properly
    if (!this.element) {
      console.warn(`[BaseSection] Element #${sectionId} not found - section disabled`);
    }
  }

  /**
   * Create intro animation timeline
   *
   * ABSTRACT METHOD: Subclasses MUST override to define intro animations.
   * Build GSAP timeline using this.timeline for animation control.
   *
   * IMPLEMENTATION PATTERN:
   * 1. Use this.timeline.from() or .to() to build animation sequence
   * 2. Chain animations with timeline methods
   * 3. Use position parameter for animation overlap/sequencing
   * 4. Store any animation references needed for later control
   *
   * WARNING: Do NOT call timeline.play() - playIntro() handles playback.
   * Timeline should be built in paused state for manual control.
   *
   * @abstract
   * @returns {void}
   *
   * @example
   * createIntro() {
   *   this.timeline
   *     .from(this.element, {
   *       opacity: 0,
   *       y: 100,
   *       duration: 1.2,
   *       ease: 'power3.out'
   *     })
   *     .from('.subtitle', {
   *       opacity: 0,
   *       duration: 0.8
   *     }, '-=0.6'); // Overlap with previous
   * }
   */
  createIntro() {
    // Override in subclass to define intro animation
    console.warn(`[BaseSection] ${this.id}: createIntro() not implemented`);
  }

  /**
   * Create outro animation timeline
   *
   * ABSTRACT METHOD: Subclasses MUST override to define outro animations.
   * Can use timeline or ScrollTrigger for scroll-based outros.
   *
   * IMPLEMENTATION OPTIONS:
   * 1. Timeline-based: Add to this.timeline for programmatic outro
   * 2. ScrollTrigger-based: Create in createScrollTriggers() for scroll outro
   * 3. Hybrid: Combine both for complex outro sequences
   *
   * @abstract
   * @returns {void}
   *
   * @example
   * // Timeline-based outro
   * createOutro() {
   *   this.timeline.to(this.element, {
   *     opacity: 0,
   *     rotation: -15,
   *     duration: 0.8
   *   });
   * }
   */
  createOutro() {
    // Override in subclass to define outro animation
    console.warn(`[BaseSection] ${this.id}: createOutro() not implemented`);
  }

  /**
   * Create ScrollTrigger animations and triggers
   *
   * ABSTRACT METHOD: Subclasses SHOULD override to define scroll-based animations.
   * Use ScrollTrigger.create() for scroll-triggered behavior.
   *
   * COMMON PATTERNS:
   * 1. Scroll-based outro (fade out as user scrolls past)
   * 2. Pin section (keep fixed during scroll range)
   * 3. Parallax effects (elements move at different speeds)
   * 4. Scroll-triggered state changes (emit events on scroll)
   *
   * EVENT EMISSION:
   * - Emit section:[name]:scroll:enter when entering viewport
   * - Emit section:[name]:scroll:exit when leaving viewport
   * - Update this.isScrollActive based on scroll state
   *
   * @abstract
   * @returns {void}
   *
   * @example
   * createScrollTriggers() {
   *   ScrollTrigger.create({
   *     trigger: this.element,
   *     start: 'top center',
   *     onEnter: () => {
   *       this.isScrollActive = true;
   *       this.bus.emit(`section:${this.id}:scroll:enter`);
   *     },
   *     onLeave: () => {
   *       this.isScrollActive = false;
   *       this.bus.emit(`section:${this.id}:scroll:exit`);
   *     }
   *   });
   * }
   */
  createScrollTriggers() {
    // Override in subclass to define scroll triggers
    // Not a warning - scroll triggers are optional
  }

  /**
   * Play intro animation and emit events
   *
   * CRITICAL FUNCTION: Executes intro timeline and coordinates with other sections.
   * Emits events at start and completion for sequence coordination.
   *
   * EVENT FLOW:
   * 1. Emit section:[name]:intro:start immediately
   * 2. Play timeline forward from beginning
   * 3. Wait for timeline completion
   * 4. Set isIntroComplete flag
   * 5. Emit section:[name]:intro:complete
   *
   * COORDINATION:
   * - Other sections can listen for intro:start to prepare
   * - Sequences listen for intro:complete to trigger next section
   * - State flags prevent duplicate playback
   *
   * @returns {Promise<void>} Resolves when intro animation completes
   *
   * @example
   * // Triggered by sequence coordinator
   * await heroSection.playIntro();
   * // intro:complete event emitted automatically
   */
  async playIntro() {
    // DEFENSIVE: Skip if element doesn't exist
    if (!this.element) {
      console.warn(`[BaseSection] ${this.id}: Cannot play intro - element not found`);
      return;
    }

    // Emit start event for coordination
    this.bus.emit(`section:${this.id}:intro:start`, {
      sectionId: this.id,
      element: this.element,
    });

    // Play timeline from beginning
    this.timeline.restart();

    // Wait for completion using GSAP promise
    return this.timeline.then(() => {
      // Update state and emit completion event
      this.isIntroComplete = true;
      this.bus.emit(`section:${this.id}:intro:complete`, {
        sectionId: this.id,
        element: this.element,
      });
    });
  }

  /**
   * Play outro animation and emit events
   *
   * CRITICAL FUNCTION: Executes outro timeline and coordinates with other sections.
   * Reverses timeline or triggers scroll-based outro depending on implementation.
   *
   * EVENT FLOW:
   * 1. Emit section:[name]:outro:start immediately
   * 2. Reverse timeline (plays outro backwards)
   * 3. Wait for timeline completion
   * 4. Set isOutroComplete flag
   * 5. Emit section:[name]:outro:complete
   *
   * NOTE: For scroll-based outros, this method may just emit events
   * while ScrollTrigger handles actual animation.
   *
   * @returns {Promise<void>} Resolves when outro animation completes
   *
   * @example
   * // Triggered by sequence coordinator
   * await heroSection.playOutro();
   * // outro:complete event emitted automatically
   */
  async playOutro() {
    // DEFENSIVE: Skip if element doesn't exist
    if (!this.element) {
      console.warn(`[BaseSection] ${this.id}: Cannot play outro - element not found`);
      return;
    }

    // Emit start event for coordination
    this.bus.emit(`section:${this.id}:outro:start`, {
      sectionId: this.id,
      element: this.element,
    });

    // Reverse timeline (plays outro)
    this.timeline.reverse();

    // Wait for completion using GSAP promise
    return this.timeline.then(() => {
      // Update state and emit completion event
      this.isOutroComplete = true;
      this.bus.emit(`section:${this.id}:outro:complete`, {
        sectionId: this.id,
        element: this.element,
      });
    });
  }

  /**
   * Reset section to initial state
   *
   * UTILITY METHOD: Resets animation state for replay or cleanup.
   * Useful for testing, page transitions, or animation restarts.
   *
   * RESET ACTIONS:
   * 1. Reset timeline to beginning (time 0)
   * 2. Pause timeline
   * 3. Clear state flags
   * 4. Emit reset event for coordination
   *
   * @returns {void}
   *
   * @example
   * // Reset section for replay
   * heroSection.reset();
   * await heroSection.playIntro(); // Plays from beginning
   */
  reset() {
    // Reset timeline to beginning and pause
    this.timeline.pause(0);

    // Clear state flags
    this.isIntroComplete = false;
    this.isOutroComplete = false;
    this.isScrollActive = false;

    // Emit reset event
    this.bus.emit(`section:${this.id}:reset`, {
      sectionId: this.id,
      element: this.element,
    });
  }

  /**
   * Kill all animations and cleanup
   *
   * CLEANUP METHOD: Destroys timeline and removes ScrollTriggers.
   * Call when section no longer needed to prevent memory leaks.
   *
   * CLEANUP ACTIONS:
   * 1. Kill GSAP timeline
   * 2. Remove all ScrollTriggers for this section
   * 3. Clear element reference
   * 4. Emit destroy event
   *
   * WARNING: Section cannot be reused after destroy() called.
   *
   * @returns {void}
   *
   * @example
   * // Cleanup on page transition
   * heroSection.destroy();
   */
  destroy() {
    // Kill timeline and all tweens
    if (this.timeline) {
      this.timeline.kill();
    }

    // Remove all ScrollTriggers for this section
    const triggers = ScrollTrigger.getAll();
    triggers.forEach(trigger => {
      if (trigger.vars.trigger === this.element || trigger.vars.trigger === `#${this.id}`) {
        trigger.kill();
      }
    });

    // Emit destroy event
    this.bus.emit(`section:${this.id}:destroy`, {
      sectionId: this.id,
    });

    // Clear references for garbage collection
    this.element = null;
    this.timeline = null;
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To create a new section controller:
 * 1. Extend BaseSection class
 * 2. Call super(sectionId, bus, smoother) in constructor
 * 3. Override createIntro() to define intro animation
 * 4. Override createOutro() to define outro animation
 * 5. Override createScrollTriggers() for scroll-based behavior
 * 6. Call all create methods in constructor
 *
 * Example implementation:
 * ```javascript
 * import { BaseSection } from './BaseSection.js';
 * import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
 *
 * export class MySection extends BaseSection {
 *   constructor(bus, smoother) {
 *     super('my-section', bus, smoother);
 *     this.createIntro();
 *     this.createOutro();
 *     this.createScrollTriggers();
 *   }
 *
 *   createIntro() {
 *     this.timeline.from(this.element, {
 *       opacity: 0,
 *       y: 100,
 *       duration: 1.2
 *     });
 *   }
 *
 *   createOutro() {
 *     // Implemented via ScrollTrigger in createScrollTriggers()
 *   }
 *
 *   createScrollTriggers() {
 *     ScrollTrigger.create({
 *       trigger: this.element,
 *       start: 'center center',
 *       onLeave: () => this.bus.emit(`section:${this.id}:outro:start`)
 *     });
 *   }
 * }
 * ```
 *
 * To debug section animations:
 * 1. Enable AnimationBus debug mode
 * 2. Check console for event emission
 * 3. Verify element exists with correct ID
 * 4. Test timeline playback manually
 * 5. Check ScrollTrigger markers (ScrollTrigger.defaults({ markers: true }))
 *
 * To optimize performance:
 * 1. Use will-change CSS for animated properties
 * 2. Limit simultaneous animations
 * 3. Use ScrollTrigger batch for many elements
 * 4. Call destroy() when section no longer needed
 * 5. Avoid heavy computations in animation callbacks
 *
 * @fileend BaseSection.js - Foundation class for section controllers
 */
