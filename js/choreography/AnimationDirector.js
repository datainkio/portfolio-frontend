/** @format */

import lumberjack from "/assets/js/utils/lumberjack/index.js";

/**
 * AnimationDirector - Master Choreography Controller
 *
 * Orchestrates the complete animation system: event bus, scroll/visual effects,
 * section controllers, global managers, and the landing sequence. Boot is
 * deferred to idle (requestIdleCallback) on DOMContentLoaded.
 *
 * ARCHITECTURE:
 * - AnimationBus: Event-driven coordination between sections
 * - ScrollEffectsCoordinator (this.stage): Scroll smoothing, gels, ruler, reduced motion
 * - CardManager: Per-card scroll animations (instantiated before sections)
 * - Section Controllers (SECTION_REGISTRY): Hero, BackgroundVideo, Bio, Process, Awards, Organizations, Work — extend AbstractSection
 * - Managers: GlobalHeaderManager, HomeHeaderManager, WorkHeaderManager, WorkNavManager, ProjectHeaderManager
 * - LandingSequence: Defines animation flow via AnimationBus listeners
 *
 * INITIALIZATION SEQUENCE:
 * 1. AnimationBus created for event coordination
 * 2. ScrollEffectsCoordinator initialized for scroll and visuals
 * 3. CardManager initialized (before sections, so pin spacers exist for header-pin measurement)
 * 4. Section controllers instantiated from SECTION_REGISTRY
 * 5. Global managers instantiated
 * 6. LandingSequence choreographs the animation flow
 * 7. Dispatches window EVENTS.system.directorReady
 *
 * REQUIREMENTS:
 * - ScrollSmoother optional (gracefully degrades to native scroll)
 *
 * DEBUGGING:
 * - Access globally: window.director (getSections / getSequence / getStage / restart / destroy)
 *
 * @requires AnimationBus - Event coordination system
 * @requires ScrollEffectsCoordinator - Scroll and visual effects
 * @requires SECTION_REGISTRY - Section controllers
 * @requires LandingSequence - Animation choreography
 */

import { AnimationBus } from "/assets/js/choreography/system/AnimationBus.js";
import ScrollEffectsCoordinator from "/assets/js/choreography/managers/ScrollEffectsCoordinator/ScrollEffectsCoordinator.js";
import { LandingSequence } from "/assets/js/choreography/templates/landing/LandingSequence.js";
import { SECTION_REGISTRY } from "/assets/js/choreography/system/registry.js";
import { EVENTS } from "/assets/js/choreography/config/contracts/events/events.js";
import CardManager from "/assets/js/choreography/organisms/card/CardManager.js";
import GlobalHeaderManager from "/assets/js/choreography/managers/GlobalHeaderManager/GlobalHeaderManager.js";
import HomeHeaderManager from "/assets/js/choreography/managers/HomeHeaderManager/HomeHeaderManager.js";
import WorkHeaderManager from "/assets/js/choreography/managers/WorkHeaderManager/WorkHeaderManager.js";
import WorkNavManager from "/assets/js/choreography/managers/WorkNavManager/WorkNavManager.js";
import ProjectHeaderManager from "/assets/js/choreography/managers/ProjectHeaderManager/ProjectHeaderManager.js";
import BuildInfoManager from "/assets/js/choreography/managers/BuildInfoManager/BuildInfoManager.js";
import SectionCapManager from "/assets/js/choreography/managers/SectionCapManager/SectionCapManager.js";

const LOGS = {
  description:
    "The AnimationDirector is the master controller for the entire animation system. It initializes the AnimationBus, ScrollEffectsCoordinator, Section Controllers, and LandingSequence in a specific order to ensure smooth operation. The AnimationDirector also provides methods to control and debug the animation flow.",
  completion: "Initialized. All systems go. Let's light this candle.",
  methods:
    "getSections() - Get section controller instances\n" +
    "getSequence() - Get LandingSequence instance\n" +
    "getStage() - Get ScrollEffectsCoordinator instance\n" +
    "restart() - Reset and replay landing sequence\n" +
    "destroy() - Cleanup and remove all event listeners",
};
/**
 * AnimationDirector - Master Animation Coordinator
 *
 * Orchestrates the complete animation system including event bus, scroll/visual
 * effects, section controllers, global managers, and sequence choreography.
 *
 * Public API:
 * - getSections() - Get section controller instances
 * - getSequence() - Get LandingSequence instance
 * - getStage() - Get ScrollEffectsCoordinator instance
 * - restart() - Reset and replay landing sequence
 * - destroy() - Cleanup and remove all event listeners
 */
export default class AnimationDirector {
  /**
   * Initialize complete animation system
   *
   * Creates all systems in proper order:
   * 1. AnimationBus for event coordination
   * 2. ScrollEffectsCoordinator for scroll and visual effects
   * 3. CardManager, then section controllers from SECTION_REGISTRY
   * 4. Global managers (header/nav/project)
   * 5. LandingSequence choreography coordinator, then dispatch directorReady
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

    // Initialize global card behaviors — must precede sections so throw-variant
    // pin spacers (pinSpacing: true) are in the DOM before _bindHeaderPin
    // measures the footer position for the work-header-pin end value.
    this.cardManager = new CardManager();

    // Initialize section controllers from registry
    this.sections = {};
    Object.entries(SECTION_REGISTRY).forEach(([sectionId, SectionClass]) => {
      this.sections[sectionId] = new SectionClass({
        bus: this.bus,
        reducedMotionHandler: this.stage?.reducedMotion,
        gelManager: this.stage?.gelAnimation,
      });
    });

    // Initialize global header hide/show on scroll
    this.headerManager = new GlobalHeaderManager({
      reducedMotionHandler: this.stage?.reducedMotion,
    });

    // Initialize home landing header role state machine (loader/hero/menu; home page only)
    this.homeHeaderManager = new HomeHeaderManager({
      bus: this.bus,
      reducedMotionHandler: this.stage?.reducedMotion,
    });

    // Initialize work section jumplinks collapse/expand on scroll. Publishes
    // the --work-header-h offset that keeps industry headings flush under the
    // header (replaces the deprecated IndustryHeaderManager).
    this.workHeaderManager = new WorkHeaderManager({
      reducedMotionHandler: this.stage?.reducedMotion,
      bus: this.bus,
    });

    // Initialize work section local nav scrollspy (active jumplink tracking)
    this.workNavManager = new WorkNavManager({ bus: this.bus });

    // Initialize project page hero parallax (no-ops on non-project pages)
    this.projectHeaderManager = new ProjectHeaderManager({
      reducedMotionHandler: this.stage?.reducedMotion,
    });

    // Initialize the section-cap build-info disclosure (click-driven toggle)
    this.buildInfoManager = new BuildInfoManager({
      reducedMotionHandler: this.stage?.reducedMotion,
    });

    // Initialize the section-cap scrollspy (active section tracking)
    this.sectionCapManager = new SectionCapManager({ bus: this.bus });

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
   * Get ScrollEffectsCoordinator instance
   * @returns {ScrollEffectsCoordinator} Scroll + visual effects coordinator
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

    this.headerManager?.kill();
    this.headerManager = null;

    this.homeHeaderManager?.kill();
    this.homeHeaderManager = null;

    this.workHeaderManager?.kill();
    this.workHeaderManager = null;

    this.workNavManager?.kill();
    this.workNavManager = null;

    this.projectHeaderManager?.kill();
    this.projectHeaderManager = null;

    this.buildInfoManager?.kill();
    this.buildInfoManager = null;

    this.sectionCapManager?.kill();
    this.sectionCapManager = null;

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
 * - Use for inspection: window.director.getSections() / getSequence() / getStage()
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
