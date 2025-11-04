/** @format */

console.log('[Director.js] Module loading...');

/**
 * Animation Director - Master Choreography Controller
 *
 * Orchestrates the complete animation system: event bus, section controllers,
 * stage manager, and animation sequences. Automatically initializes on DOMContentLoaded.
 *
 * ARCHITECTURE:
 * - AnimationBus: Event-driven coordination between sections
 * - StageManager: Scroll smoothing and visual effects
 * - Section Controllers: Hero, Work, Biography (extend BaseSection)
 * - LandingSequence: Defines animation flow via event listeners
 *
 * INITIALIZATION SEQUENCE:
 * 1. AnimationBus created for event coordination
 * 2. StageManager initialized for scroll and visuals
 * 3. Section controllers instantiated (Hero, Work, Biography)
 * 4. LandingSequence choreographs the animation flow
 * 5. Sequence starts, triggering entire choreography
 *
 * REQUIREMENTS:
 * - DOM elements: #main-header, #work, #biography
 * - ScrollSmoother optional (gracefully degrades to native scroll)
 *
 * DEBUGGING:
 * - Enable debug mode: window.director.enableDebug(true)
 * - Access globally: window.director
 *
 * @requires AnimationBus - Event coordination system
 * @requires StageManager - Scroll and visual effects
 * @requires Hero, Work, Biography - Section controllers
 * @requires LandingSequence - Animation choreography
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
 * stage manager, and sequence choreography.
 *
 * Public API:
 * - enableDebug(enabled) - Toggle AnimationBus debug logging
 * - getSections() - Get section controller instances
 * - getSequence() - Get LandingSequence instance
 * - getStage() - Get StageManager instance
 * - restart() - Reset and replay landing sequence
 * - destroy() - Cleanup and remove all event listeners
 */
export default class Director {
  /**
   * Initialize complete animation system
   *
   * Creates all systems in proper order:
   * 1. AnimationBus for event coordination
   * 2. StageManager for scroll and visual effects
   * 3. Section controllers (Hero, Work, Biography)
   * 4. LandingSequence choreography coordinator
   * 5. Start animation sequence
   */
  constructor() {
    console.log('[Director] ========================================');
    console.log('[Director] Constructor started');
    console.log('[Director] ========================================');

    // Central event bus for animation coordination
    console.log('[Director] Creating AnimationBus...');
    this.bus = new AnimationBus();
    console.log('[Director] ✅ AnimationBus created:', this.bus);

    // Stage manager for scroll and visual effects
    console.log('[Director] Creating StageManager...');
    this.stage = new StageManager();
    console.log('[Director] ✅ StageManager created:', this.stage);

    // ScrollSmoother instance (null if not available)
    // Passed to section controllers for optional smooth scroll integration
    this.smoother = this.stage.getSmoother();
    console.log('[Director] ScrollSmoother available:', !!this.smoother);

    // Section controller instances
    console.log('[Director] Creating section controllers...');
    this.sections = {
      hero: new Hero(this.bus, this.smoother),
      work: new Work(this.bus, this.smoother),
      biography: new Biography(this.bus, this.smoother),
    };
    console.log('[Director] ✅ Sections created:', Object.keys(this.sections));

    // Landing page animation sequence coordinator
    // Needs bus for events and sections for triggering animations
    console.log('[Director] Creating LandingSequence...');
    this.sequence = new LandingSequence(this.bus, this.sections);
    console.log('[Director] ✅ LandingSequence created:', this.sequence);

    // Start the show!
    console.log('[Director] Starting landing page sequence...');
    this.sequence.start();
    console.log('[Director] ✅ Constructor complete');
    console.log('[Director] ========================================');
  }

  /**
   * Enable or disable debug logging
   * @param {boolean} enabled - True to enable, false to disable
   */
  enableDebug(enabled = true) {
    this.bus.enableDebug(enabled);
  }

  /**
   * Get all section controller instances
   * @returns {Object} Section controllers (hero, work, biography)
   */
  getSections() {
    return this.sections;
  }

  /**
   * Get LandingSequence instance
   * @returns {LandingSequence} Sequence coordinator
   */
  getSequence() {
    return this.sequence;
  }

  /**
   * Get StageManager instance
   * @returns {StageManager} Stage manager
   */
  getStage() {
    return this.stage;
  }

  /**
   * Restart landing page animation sequence
   * Resets all section controllers and replays sequence
   */
  restart() {
    console.log('[Director] Restarting landing sequence');
    this.sequence.reset();
    this.sequence.start();
  }

  /**
   * Cleanup and destroy all animation systems
   * Removes event listeners and clears references
   * WARNING: Director cannot be reused after destroy()
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
console.log('[Director.js] Setting up DOMContentLoaded listener...');
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Director] ========================================');
  console.log('[Director] DOMContentLoaded event fired');
  console.log('[Director] Creating Director instance...');
  console.log('[Director] ========================================');

  try {
    // Create global Director instance
    window.director = new Director();

    console.log('[Director] ========================================');
    console.log('[Director] ✅ Director initialized successfully');
    console.log('[Director] Available at: window.director');
    console.log('[Director] Available sections:', Object.keys(window.director.sections));
    console.log('[Director] Sequence:', window.director.sequence);
    console.log('[Director] ========================================');
  } catch (error) {
    console.error('[Director] ========================================');
    console.error('[Director] ❌ Failed to initialize Director');
    console.error('[Director] Error:', error);
    console.error('[Director] Stack trace:', error.stack);
    console.error('[Director] ========================================');
  }

  // Optional: Enable debug mode during development
  // Uncomment to see all animation events in console
  // window.director.enableDebug(true);
});

console.log('[Director.js] ✅ Module loaded, waiting for DOMContentLoaded...');

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
