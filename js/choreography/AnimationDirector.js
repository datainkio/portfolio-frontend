/**
 * ---
 * aix:
 *   id: frontend.js.choreography.animationdirector
 *   role: Frontend runtime module: js/choreography/AnimationDirector.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - AnimationDirector.js
 * ---
 */
/** @format */

import lumberjack from "/assets/js/utils/lumberjack/index.js";

/**
 * AnimationDirector - Master Choreography Controller
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
 * TODO: AnimationDirector intro documentation needs updating to reflect current architecture and responsibilities.
 * @requires AnimationBus - Event coordination system
 * @requires StageManager - Scroll and visual effects
 * @requires Splash, Hero, Work, Biography - Section controllers
 * @requires LandingSequence - Animation choreography
 */

import { AnimationBus } from "/assets/js/choreography/AnimationBus.js";
import ScrollEffectsCoordinator from "/assets/js/choreography/ScrollEffectsCoordinator.js";
import { LandingSequence } from "/assets/js/choreography/sequences/landing/LandingSequence.js";
import { SECTION_REGISTRY } from "/assets/js/choreography/sections/registry.js";
import { EVENTS } from "/assets/js/choreography/config/contracts/events.js";
import CardManager from "./card/CardManager.js";

const LOGS = {
  description:
    "The AnimationDirector is the master controller for the entire animation system. It initializes the AnimationBus, ScrollEffectsCoordinator, Section Controllers, and LandingSequence in a specific order to ensure smooth operation. The AnimationDirector also provides methods to control and debug the animation flow.",
  completion: "Initialized. All systems go. Let's light this candle.",
  methods:
    "enableDebug(enabled) - Toggle AnimationBus debug logging\n" +
    "getSections() - Get section controller instances\n" +
    "getSequence() - Get LandingSequence instance\n" +
    "getStage() - Get StageManager instance\n" +
    "restart() - Reset and replay landing sequence\n" +
    "destroy() - Cleanup and remove all event listeners",
};
/**
 * AnimationDirector - Master Animation Coordinator
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
export default class AnimationDirector {
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
    // Create scoped logger for AnimationDirector operations
    this.logger = lumberjack.createScoped("AnimationDirector", {
      prefix: "",
      color: "#10B981",
    });
    this.logger.enabled = true;
    this.logger.trace(LOGS.description);
    // Initialize core systems
    this.bus = new AnimationBus();
    this.stage = new ScrollEffectsCoordinator(this.bus); // Pass bus to ScrollEffectsCoordinator

    // Initialize section controllers from registry
    this.sections = {};
    Object.entries(SECTION_REGISTRY).forEach(([sectionId, SectionClass]) => {
      this.sections[sectionId] = new SectionClass({
        bus: this.bus,
        reducedMotionHandler: this.stage?.reducedMotion,
        gelManager: this.stage?.gelAnimation,
      });
    });

    // Initialize global card behaviors
    this.cardManager = new CardManager();

    // Initialize choreography sequence
    this.sequence = new LandingSequence(
      this.bus,
      this.sections,
      this.stage?.gelAnimation,
    );
    this.logger.trace(LOGS.completion);

    // Signal that Director has finished initializing
    window.dispatchEvent(new Event(EVENTS.system.directorReady));
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
    this.logger.trace("Restarting landing sequence", null, "brief", "headsup");
    this.sequence.reset();
    this.sequence.start();
  }

  /**
   * Cleanup and destroy all animation systems
   * Removes event listeners and clears references
   * WARNING: Director cannot be reused after destroy()
   */
  destroy() {
    this.logger.trace("Destroying animation system", null, "brief", "headsup");

    // Destroy sequence and remove event listeners
    if (this.sequence) {
      this.sequence.destroy();
    }

    // Destroy all section controllers
    Object.values(this.sections).forEach((section) => {
      if (section && typeof section.destroy === "function") {
        section.destroy();
      }
    });

    // Clear references for garbage collection

    this.cardManager?.kill();
    this.cardManager = null;
    this.bus = null;
    this.stage = null;
    this.sections = null;
    this.sequence = null;
  }
}

/**
 * MASTER ANIMATION INITIALIZATION
 *
 * PERFORMANCE: Initialization is deferred to idle (requestIdleCallback with timeout fallback)
 * to keep first paint CSS-only; falls back to DOMContentLoaded + setTimeout when needed.
 *
 * GLOBAL ACCESS:
 * - window.director provides access to AnimationDirector instance
 * - Use for debugging: window.director.enableDebug(true)
 * - Use for control: window.director.restart()
 */
const initDirector = () => {
  if (window.director instanceof AnimationDirector) return;
  window.director = new AnimationDirector();
};

const scheduleInit = () => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initDirector, { timeout: 150 });
  } else {
    setTimeout(initDirector, 0);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleInit, { once: true });
} else {
  scheduleInit();
}
