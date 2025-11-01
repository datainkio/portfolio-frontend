/**
 * LandingSequence - Landing Page Animation Choreography Coordinator
 *
 * CRITICAL WARNING: This is the MASTER CHOREOGRAPHER for landing page animation sequences.
 * If you modify this without understanding event flow, you WILL break:
 * - Section-to-section animation timing and coordination
 * - Intro/outro sequence orchestration across Hero, Work, Biography
 * - Event-driven timeline synchronization throughout landing experience
 * - Visual effects coordination (printer marks, overlays, etc.)
 *
 * ARCHITECTURE NOTES:
 * - Listens to AnimationBus events from section controllers
 * - Triggers next animations based on completion events
 * - Defines complete landing page animation flow in one place
 * - Easy to modify, reorder, or add new sequence steps
 * - Completely decoupled from section implementation details
 *
 * SEQUENCE FLOW (Landing Page):
 * 1. Hero intro plays → triggers Work intro
 * 2. Hero scrolls out → triggers Biography intro
 * 3. Work scrolls in → shows printer marks
 * 4. Biography scrolls in → fades overlay effects
 *
 * INTEGRATION DEPENDENCIES:
 * - AnimationBus MUST be provided for event coordination
 * - Section controllers MUST emit standard events (intro:complete, scroll:enter, etc.)
 * - Section references MUST be provided for triggering playIntro/playOutro
 *
 * DEBUGGING GOTCHAS:
 * - Enable AnimationBus debug mode to see event flow
 * - Check that section elements exist in DOM before sequence starts
 * - Verify event names match exactly (typos break coordination)
 * - Event timing critical - premature emission breaks sequence
 *
 * DO NOT REMOVE: Event listeners - they define the complete animation flow
 * DO NOT CHANGE: Event names without updating section controllers
 *
 * @fileoverview Landing page master animation sequence coordinator
 * @class LandingSequence
 * @requires AnimationBus - Event coordination system
 */

import { gsap } from '/assets/js/gsap/all.js';

export class LandingSequence {
  /**
   * Initialize landing page animation sequence
   *
   * CRITICAL INITIALIZATION: Sets up complete event-driven choreography
   * for landing page animation flow. Defines how sections coordinate.
   *
   * INITIALIZATION SEQUENCE:
   * 1. Store AnimationBus reference for event listening
   * 2. Store section controller references for triggering animations
   * 3. Setup event listeners that define sequence flow
   * 4. Ready to start() when called
   *
   * @param {AnimationBus} bus - Event bus for animation coordination
   * @param {Object} sections - Section controller instances
   * @param {Hero} sections.hero - Hero section controller
   * @param {Work} sections.work - Work section controller
   * @param {Biography} sections.biography - Biography section controller
   *
   * @example
   * const sequence = new LandingSequence(bus, {
   *   hero: heroSection,
   *   work: workSection,
   *   biography: biographySection
   * });
   * sequence.start();
   */
  constructor(bus, sections) {
    console.log('[LandingSequence] ========================================');
    console.log('[LandingSequence] Constructor called');
    console.log('[LandingSequence] bus:', bus);
    console.log('[LandingSequence] sections:', sections);
    console.log('[LandingSequence] ========================================');

    /**
     * AnimationBus instance for event coordination
     * @type {AnimationBus}
     */
    this.bus = bus;

    /**
     * Section controller references for triggering animations
     * @type {Object}
     */
    this.sections = sections;

    /**
     * Sequence state tracking
     * @type {Object}
     */
    this.state = {
      isStarted: false,
      isComplete: false,
    };

    /**
     * Array of unsubscribe functions for cleanup
     * @type {Function[]}
     */
    this._unsubscribers = [];

    // Setup event listeners that define animation sequence
    console.log('[LandingSequence] About to call setupSequence()...');
    this.setupSequence();
    console.log('[LandingSequence] ✅ Constructor complete');
    console.log('[LandingSequence] ========================================');
  }

  /**
   * Setup complete landing page animation sequence
   *
   * CRITICAL FUNCTION: Defines the entire landing page animation flow
   * via event listeners. This is where you modify sequence timing and order.
   *
   * CURRENT SEQUENCE:
   * 1. Hero intro complete → triggers Work intro
   * 2. Hero scroll exit → triggers Biography intro
   * 3. Work scroll enter → shows printer marks effect
   * 4. Biography scroll enter → fades overlay effects
   *
   * EASY ITERATION:
   * - Add new sequence steps by adding event listeners
   * - Reorder steps by changing which events trigger which actions
   * - Add delays with gsap.delayedCall()
   * - Chain multiple actions in one listener
   *
   * DEFENSIVE:
   * - Checks section exists before calling methods
   * - Stores unsubscribe functions for cleanup
   * - Wraps actions in try/catch to prevent cascade failures
   */
  setupSequence() {
    console.log('[LandingSequence] ========================================');
    console.log('[LandingSequence] setupSequence() called');
    console.log('[LandingSequence] Setting up event listeners...');
    console.log('[LandingSequence] ========================================');
    // SEQUENCE 1: Hero intro complete → triggers Work intro
    // Creates staggered entrance where work fades in after hero
    console.log('[LandingSequence] Setting up animation sequence');
    this._unsubscribers.push(
      this.bus.on('section:main-header:intro:complete', () => {
        console.log('[LandingSequence] Hero intro complete → triggering Work intro');
        if (this.sections.work) {
          try {
            this.sections.work.playIntro();
          } catch (error) {
            console.error('[LandingSequence] Error playing Work intro:', error);
          }
        }
      })
    );

    // SEQUENCE 2: Hero scroll exit → triggers Biography intro
    // Reveals biography section as hero scrolls off-screen
    this._unsubscribers.push(
      this.bus.on('section:main-header:scroll:exit', () => {
        console.log('[LandingSequence] Hero scroll exit → triggering Biography intro');
        if (this.sections.biography) {
          try {
            this.sections.biography.playIntro();
          } catch (error) {
            console.error('[LandingSequence] Error playing Biography intro:', error);
          }
        }
      })
    );

    // SEQUENCE 3: Work scroll enter → shows printer marks effect
    // Visual feedback when work section enters viewport
    this._unsubscribers.push(
      this.bus.on('section:work:scroll:enter', () => {
        console.log('[LandingSequence] Work section entered viewport');
        // Printer marks already applied in Work constructor
        // Could trigger additional effects here if needed
      })
    );

    // SEQUENCE 4: Biography scroll enter → fades overlay effects
    // Creates visual transition as biography section becomes active
    this._unsubscribers.push(
      this.bus.on('section:biography:scroll:enter', () => {
        console.log('[LandingSequence] Biography section entered → fading overlay');

        // Fade overlay effects for biography reading experience
        const overlayPrimary = document.getElementById('overlay-primary');
        if (overlayPrimary) {
          gsap.to(overlayPrimary, {
            opacity: 0.5,
            duration: 1,
            ease: 'power2.out',
          });
        }
      })
    );

    // SEQUENCE 5: All sections complete → mark sequence done
    // Tracks overall sequence completion state
    this._unsubscribers.push(
      this.bus.on('section:biography:intro:complete', () => {
        console.log('[LandingSequence] All intro sequences complete');
        this.state.isComplete = true;
      })
    );
  }

  /**
   * Start the landing page animation sequence
   *
   * ENTRY POINT: Kicks off the entire landing page choreography.
   * Call this after all sections are initialized and DOM is ready.
   *
   * SEQUENCE INITIATION:
   * - Marks sequence as started
   * - Triggers hero intro animation
   * - Event listeners handle subsequent animations automatically
   *
   * DEFENSIVE:
   * - Checks if already started to prevent duplicate playback
   * - Verifies hero section exists before starting
   * - Logs sequence start for debugging
   *
   * @example
   * const sequence = new LandingSequence(bus, sections);
   * sequence.start(); // Kicks off entire animation flow
   */
  start() {
    // Prevent duplicate starts
    if (this.state.isStarted) {
      console.warn('[LandingSequence] Sequence already started');
      return;
    }

    // Verify hero section exists
    if (!this.sections.hero) {
      console.error('[LandingSequence] Cannot start - hero section missing');
      return;
    }

    console.log('[LandingSequence] Starting landing page animation sequence');
    this.state.isStarted = true;

    // Kick off sequence with hero intro
    // Event listeners will trigger subsequent animations
    try {
      this.sections.hero.playIntro();
    } catch (error) {
      console.error('[LandingSequence] Error starting hero intro:', error);
      this.state.isStarted = false;
    }
  }

  /**
   * Reset sequence to initial state
   *
   * UTILITY METHOD: Resets sequence state and section animations.
   * Useful for replaying sequence or testing during development.
   *
   * RESET ACTIONS:
   * 1. Reset all section controllers to initial state
   * 2. Clear sequence state flags
   * 3. Re-setup event listeners (if needed)
   *
   * WARNING: Does not remove event listeners - call destroy() for full cleanup
   */
  reset() {
    console.log('[LandingSequence] Resetting sequence');

    // Reset all section controllers
    Object.values(this.sections).forEach(section => {
      if (section && typeof section.reset === 'function') {
        section.reset();
      }
    });

    // Clear sequence state
    this.state.isStarted = false;
    this.state.isComplete = false;
  }

  /**
   * Cleanup sequence and remove event listeners
   *
   * CLEANUP METHOD: Removes all event listeners and cleans up resources.
   * Call when sequence no longer needed to prevent memory leaks.
   *
   * CLEANUP ACTIONS:
   * 1. Call all unsubscribe functions to remove event listeners
   * 2. Clear unsubscribers array
   * 3. Clear section references
   *
   * WARNING: Sequence cannot be reused after destroy() called
   */
  destroy() {
    console.log('[LandingSequence] Destroying sequence and cleaning up');

    // Remove all event listeners
    this._unsubscribers.forEach(unsubscribe => unsubscribe());
    this._unsubscribers = [];

    // Clear references
    this.sections = null;
    this.bus = null;
  }
}

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * To use LandingSequence in choreography:
 * ```javascript
 * import { LandingSequence } from './sequences/LandingSequence.js';
 * import { AnimationBus } from './AnimationBus.js';
 * import Hero from './sections/Hero.js';
 * import Work from './sections/Work.js';
 * import Biography from './sections/Biography.js';
 *
 * const bus = new AnimationBus();
 * const sections = {
 *   hero: new Hero(bus, smoother),
 *   work: new Work(bus, smoother),
 *   biography: new Biography(bus, smoother)
 * };
 *
 * const sequence = new LandingSequence(bus, sections);
 * sequence.start(); // Kicks off entire landing animation
 * ```
 *
 * To modify animation sequence:
 * 1. Edit setupSequence() method to add/remove/reorder steps
 * 2. Add new event listeners for additional coordination
 * 3. Chain multiple actions in single listener callback
 * 4. Use gsap.delayedCall() for timed delays between steps
 *
 * Example modifications:
 * ```javascript
 * // Add delay before triggering next section
 * this.bus.on('section:hero:intro:complete', () => {
 *   gsap.delayedCall(0.5, () => {
 *     this.sections.work.playIntro();
 *   });
 * });
 *
 * // Chain multiple actions
 * this.bus.on('section:work:scroll:enter', () => {
 *   this.triggerPrinterMarks();
 *   this.fadeOverlay();
 *   this.sections.biography.playIntro();
 * });
 * ```
 *
 * To debug sequence issues:
 * 1. Enable AnimationBus debug mode: bus.enableDebug(true)
 * 2. Check console for "[LandingSequence]" prefixed messages
 * 3. Verify section elements exist in DOM before starting
 * 4. Use ScrollTrigger.defaults({ markers: true }) to visualize triggers
 * 5. Check that event names match exactly in both emitter and listener
 *
 * To create additional sequences:
 * - Copy this file and rename (e.g., ProjectSequence.js)
 * - Modify setupSequence() for different animation flow
 * - Update section references as needed
 * - Use same AnimationBus for cross-sequence coordination
 *
 * PERFORMANCE CONSIDERATIONS:
 * - Event listeners are lightweight - minimal performance impact
 * - GSAP animations are hardware-accelerated
 * - Sequence coordination adds no scroll jank
 * - Cleanup with destroy() prevents memory leaks
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Works with any section controllers that extend BaseSection
 * - Coordinates via AnimationBus - loosely coupled
 * - Can be controlled by Director or other master coordinator
 * - Multiple sequences can coexist using same AnimationBus
 *
 * @fileend LandingSequence.js - Landing page animation choreography coordinator
 */
