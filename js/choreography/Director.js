/** @format */

import lumberjack from '/assets/js/utils/lumberjack/index.js';

// Create scoped logger for Director operations
const logger = lumberjack.createScoped('Director', { prefix: '🎬', color: '#10B981' });

// logger.trace('Module loading...', null, 'brief', 'standard');

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
import Hero from '/assets/js/choreography/sections/hero/Hero.js';
// import Biography from '/assets/js/choreography/sections/biography/Biography.js';
import { LandingSequence } from '/assets/js/choreography/sequences/landing/LandingSequence.js';

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
    console.log('[Director] Initializing animation system...');
    // Initialize core systems
    this.bus = new AnimationBus();
    this.stage = new StageManager(this.bus); // Pass bus to StageManager

    // Initialize section controllers
    this.sections = {
      hero: new Hero(this.bus),
      biography: new Biography(this.bus),
    };

    // Initialize choreography sequence
    // this.sequence = new LandingSequence(this.bus, this.sections);
    // this.sequence.start();
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
    logger.trace('Restarting landing sequence', null, 'brief', 'headsup');
    this.sequence.reset();
    this.sequence.start();
  }

  /**
   * Cleanup and destroy all animation systems
   * Removes event listeners and clears references
   * WARNING: Director cannot be reused after destroy()
   */
  destroy() {
    logger.trace('Destroying animation system', null, 'brief', 'headsup');

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
const initDirector = () => {
  if (window.director instanceof Director) return;
  window.director = new Director();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDirector);
} else {
  initDirector();
}
