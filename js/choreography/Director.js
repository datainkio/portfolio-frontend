/** @format */

/**
 * Animation Director - Master Choreography Controller
 *
 * This is the MASTER ORCHESTRATOR for the entire site's animation system.
 * Stuff that can break:
 * - Event-driven animation coordination across Hero, Work, Biography sections
 * - AnimationBus event emission and sequence choreography
 * - StageManager scroll event coordination and visual effects
 * - Landing page animation sequence timing and flow
 *
 * INTEGRATION DEPENDENCIES (modify at your own peril):
 * - HTML: Specific element IDs (main-header, work, biography) MUST exist in DOM
 * - AnimationBus: Central event system for section coordination
 * - Section Controllers: Hero, Work, Biography MUST extend BaseSection
 * - LandingSequence: Defines animation flow via event listeners
 * - StageManager: Handles scroll optimization and visual effects
 *
 * ARCHITECTURE NOTES:
 * - Uses DOMContentLoaded for fast initialization (DOM-ready, assets may still load)
 * - AnimationBus provides event-driven coordination between all systems
 * - Section controllers emit events at animation milestones
 * - LandingSequence listens to events and triggers next animations
 * - StageManager handles scroll smoothing and background visual effects
 * - Debug mode available via AnimationBus.enableDebug()
 *
 * INITIALIZATION SEQUENCE:
 * 1. DOMContentLoaded triggers initAnimation()
 * 2. AnimationBus created for event coordination
 * 3. StageManager initialized for scroll and visual effects
 * 4. Section controllers instantiated (Hero, Work, Biography)
 * 5. LandingSequence coordin created to define animation flow
 * 6. Sequence starts, kicking off entire choreography
 *
 * DEBUGGING GOTCHAS:
 * - Enable debug mode to see all event emission: director.enableDebug(true)
 * - Section controllers may not initialize if DOM elements missing
 * - Event timing critical - check console for event flow
 * - ScrollSmoother optional - works with or without smooth scrolling
 *
 * DO NOT CHANGE: Element IDs without updating corresponding HTML structure
 * DO NOT REMOVE: AnimationBus instantiation - required for all coordination
 *
 * @fileoverview Master animation director with event-driven choreography system
 * @requires AnimationBus - Central event coordination system
 * @requires StageManager - Scroll coordination and visual effects
 * @requires Hero - Hero section animation controller
 * @requires Work - Work section animation controller
 * @requires Biography - Biography section animation controller
 * @requires LandingSequence - Landing page choreography coordinator
 */

import { AnimationBus } from '/assets/js/choreography/AnimationBus.js';
import StageManager from '/assets/js/choreography/StageManager.js';
import Hero from '/assets/js/choreography/sections/Hero.js';
import Work from '/assets/js/choreography/sections/Work.js';
import Biography from '/assets/js/choreography/sections/Biography.js';
import { LandingSequence } from '/assets/js/choreography/sequences/LandingSequence.js';

/**
 * Director - Master Animation Coordinator
 *
 * Orchestrates the complete animation system including event bus, section controllers,
 * stage manager, and sequence choreography. Provides centralized access to all systems.
 *
 * INITIALIZATION:
 * - Automatically initializes on DOMContentLoaded
 * - Creates all animation systems and coordinates their setup
 * - Starts landing page animation sequence
 *
 * PUBLIC API:
 * - enableDebug(true/false) - Toggle AnimationBus debug logging
 * - getSections() - Get all section controller instances
 * - getSequence() - Get LandingSequence instance
 * - getStage() - Get StageManager instance
 * - restart() - Reset and replay landing sequence
 */
export default class Director {
  /**
   * Initialize complete animation system
   *
   * CRITICAL INITIALIZATION: Sets up entire animation choreography pipeline.
   * Creates all systems in proper order and coordinates their interactions.
   *
   * INITIALIZATION SEQUENCE:
   * 1. Create AnimationBus for event coordination
   * 2. Create StageManager for scroll and visual effects
   * 3. Get ScrollSmoother instance (if available)
   * 4. Create section controllers (Hero, Work, Biography)
   * 5. Create LandingSequence choreography coordinator
   * 6. Start animation sequence
   *
   * DEFENSIVE:
   * - Warns if DOM elements missing but continues initialization
   * - Section controllers handle missing elements gracefully
   * - ScrollSmoother optional - works with native scroll if unavailable
   *
   * @constructor
   */
  constructor() {
    console.log('[Director] Initializing animation system');

    /**
     * Central event bus for animation coordination
     * @type {AnimationBus}
     */
    this.bus = new AnimationBus();

    /**
     * Stage manager for scroll and visual effects
     * @type {StageManager}
     */
    this.stage = new StageManager();

    /**
     * ScrollSmoother instance (null if not available)
     * @type {ScrollSmoother|null}
     */
    this.smoother = this.stage.getSmoother();

    /**
     * Section controller instances
     * @type {Object}
     */
    this.sections = {
      hero: new Hero(this.bus, this.smoother),
      work: new Work(this.bus, this.smoother),
      biography: new Biography(this.bus, this.smoother),
    };

    /**
     * Landing page animation sequence coordinator
     * @type {LandingSequence}
     */
    this.sequence = new LandingSequence(this.bus, this.sections);

    // Start the show!
    console.log('[Director] Starting landing page sequence');
    this.sequence.start();
  }

  /**
   * Enable or disable debug logging
   *
   * Toggles AnimationBus debug mode which logs all event emissions.
   * Useful for debugging animation sequence issues.
   *
   * @param {boolean} enabled - True to enable debug logging, false to disable
   *
   * @example
   * director.enableDebug(true); // See all animation events in console
   */
  enableDebug(enabled = true) {
    this.bus.enableDebug(enabled);
  }

  /**
   * Get all section controller instances
   *
   * Provides access to Hero, Work, Biography section controllers
   * for external control or debugging.
   *
   * @returns {Object} Section controller instances
   *
   * @example
   * const { hero, work, biography } = director.getSections();
   * hero.playIntro(); // Manually trigger hero intro
   */
  getSections() {
    return this.sections;
  }

  /**
   * Get LandingSequence instance
   *
   * Provides access to sequence coordinator for external control.
   *
   * @returns {LandingSequence} Sequence coordinator instance
   *
   * @example
   * const sequence = director.getSequence();
   * sequence.reset(); // Reset sequence to beginning
   */
  getSequence() {
    return this.sequence;
  }

  /**
   * Get StageManager instance
   *
   * Provides access to stage manager for scroll and visual effects control.
   *
   * @returns {StageManager} Stage manager instance
   *
   * @example
   * const stage = director.getStage();
   * const smoother = stage.getSmoother(); // Get ScrollSmoother instance
   */
  getStage() {
    return this.stage;
  }

  /**
   * Restart landing page animation sequence
   *
   * Resets all section controllers and replays landing sequence.
   * Useful for testing or allowing user to replay animations.
   *
   * @example
   * director.restart(); // Reset and replay entire landing sequence
   */
  restart() {
    console.log('[Director] Restarting landing sequence');
    this.sequence.reset();
    this.sequence.start();
  }

  /**
   * Cleanup and destroy all animation systems
   *
   * Removes all event listeners and cleans up resources.
   * Call when leaving page or no longer need animation system.
   *
   * WARNING: Director cannot be reused after destroy() called
   */
  destroy() {
    console.log('[Director] Destroying animation system');

    // Destroy sequence and remove event listeners
    if (this.sequence) {
      this.sequence.destroy();
    }

    // Destroy all section controllers
    Object.values(this.sections).forEach(section => {
      if (section && typeof section.destroy === 'function') {
        section.destroy();
      }
    });

    // Clear references for garbage collection
    this.bus = null;
    this.stage = null;
    this.smoother = null;
    this.sections = null;
    this.sequence = null;
  }
}

/**
 * MASTER ANIMATION INITIALIZATION
 *
 * CRITICAL: Initializes complete animation system on DOMContentLoaded.
 * Creates global Director instance for external access and debugging.
 *
 * TIMING:
 * - Uses DOMContentLoaded for fast initialization (DOM-ready)
 * - Assets may still be loading - animations handle async gracefully
 * - Faster than window.onload which waits for all assets
 *
 * GLOBAL ACCESS:
 * - window.director provides access to Director instance
 * - Use for debugging: window.director.enableDebug(true)
 * - Use for control: window.director.restart()
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create global Director instance
  window.director = new Director();

  // Optional: Enable debug mode during development
  // Uncomment to see all animation events in console
  // window.director.enableDebug(true);
});

/**
 * USAGE INSTRUCTIONS FOR FUTURE DEVELOPERS:
 *
 * Director is automatically initialized on DOMContentLoaded.
 * Access via global: window.director
 *
 * Common operations:
 * ```javascript
 * // Enable debug logging
 * window.director.enableDebug(true);
 *
 * // Get section controllers
 * const { hero, work, biography } = window.director.getSections();
 *
 * // Manually trigger animations
 * hero.playIntro();
 * work.playIntro();
 *
 * // Restart entire sequence
 * window.director.restart();
 *
 * // Access stage manager
 * const stage = window.director.getStage();
 * const smoother = stage.getSmoother();
 * ```
 *
 * To modify animation sequence:
 * - Edit LandingSequence.js setupSequence() method
 * - Add/remove/reorder event listeners
 * - Change which events trigger which animations
 *
 * To add new sections:
 * 1. Create new section controller extending BaseSection
 * 2. Add to this.sections object in constructor
 * 3. Update LandingSequence to coordinate new section
 *
 * To create different page sequences:
 * - Create new sequence file (e.g., ProjectSequence.js)
 * - Instantiate appropriate sequence based on page type
 * - Use same AnimationBus for coordination
 *
 * To debug animation issues:
 * 1. Enable debug mode: window.director.enableDebug(true)
 * 2. Check console for "[AnimationBus]" event logs
 * 3. Verify DOM elements exist: main-header, work, biography
 * 4. Use ScrollTrigger markers: ScrollTrigger.defaults({ markers: true })
 * 5. Check event names match exactly in emitters and listeners
 *
 * PERFORMANCE CONSIDERATIONS:
 * - DOMContentLoaded for fast initialization
 * - Event-driven coordination adds minimal overhead
 * - GSAP animations hardware-accelerated
 * - ScrollSmoother optional - gracefully degrades
 * - Cleanup with destroy() prevents memory leaks
 *
 * INTEGRATION WITH OTHER SYSTEMS:
 * - Global window.director for external access
 * - AnimationBus coordinates all animation events
 * - Works with or without ScrollSmoother
 * - Section controllers independent and reusable
 * - Sequence coordinators define page-specific flows
 *
 * @fileend Director.js - Master animation choreography controller
 */
