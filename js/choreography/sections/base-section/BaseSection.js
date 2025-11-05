/**
 * BaseSection - Foundation class for section animation controllers
 *
 * Provides standard lifecycle and event coordination for all section controllers.
 * Subclasses override createIntro(), createOutro(), and createScrollTriggers().
 *
 * Lifecycle:
 * 1. Constructor initializes timeline and element
 * 2. createIntro/Outro/ScrollTriggers define animations (override in subclass)
 * 3. playIntro/playOutro execute animations and emit events
 *
 * Events emitted:
 * - section:[id]:intro:start/complete
 * - section:[id]:outro:start/complete
 * - section:[id]:scroll:enter/exit (via subclass ScrollTriggers)
 * - section:[id]:reset/destroy
 *
 * Dependencies:
 * - AnimationBus for event coordination
 * - GSAP for timeline management
 * - ScrollSmoother optional for smooth scroll integration
 *
 * @requires gsap
 */

import { gsap } from '/assets/js/gsap/all.js';

export class BaseSection {
  /**
   * Initialize section controller
   *
   * Subclasses must call super(id, bus, smoother) in constructor,
   * then call createIntro(), createOutro(), and createScrollTriggers().
   *
   * @param {string} sectionId - DOM element ID (e.g., 'main-header')
   * @param {AnimationBus} bus - Event bus for coordination
   * @param {ScrollSmoother|null} smoother - ScrollSmoother instance
   */
  constructor(sectionId, bus, smoother = null) {
    this.id = sectionId;
    this.bus = bus;
    this.smoother = smoother;
    this.element = document.getElementById(sectionId);
    this.timeline = gsap.timeline({ paused: true });
    this.isIntroComplete = false;
    this.isOutroComplete = false;
    this.isScrollActive = false;

    if (!this.element) {
      console.warn(`[BaseSection] Element #${sectionId} not found - section disabled`);
    }
  }

  /**
   * Create intro animation timeline
   *
   * Override in subclass to build intro animation using this.timeline.
   * Do not call timeline.play() - playIntro() handles execution.
   *
   * @abstract
   */
  createIntro() {
    console.warn(`[BaseSection] ${this.id}: createIntro() not implemented`);
  }

  /**
   * Create outro animation timeline
   *
   * Override in subclass to build outro animation.
   * Can use timeline or ScrollTrigger for scroll-based outros.
   *
   * @abstract
   */
  createOutro() {
    console.warn(`[BaseSection] ${this.id}: createOutro() not implemented`);
  }

  /**
   * Create ScrollTrigger animations
   *
   * Override in subclass to define scroll-based behavior.
   * Common patterns: scroll-based outro, pinning, parallax.
   * Emit scroll:enter/exit events for coordination.
   *
   * @abstract
   */
  createScrollTriggers() {
    // Optional override - not all sections need scroll triggers
  }

  /**
   * Play intro animation
   *
   * Executes intro timeline and emits coordination events.
   * Emits intro:start immediately, intro:complete when finished.
   *
   * @returns {Promise<void>} Resolves when animation completes
   */
  async playIntro() {
    if (!this.element) {
      console.warn(`[BaseSection] ${this.id}: Cannot play intro - element not found`);
      return;
    }

    this.bus.emit(`section:${this.id}:intro:start`, {
      sectionId: this.id,
      element: this.element,
    });

    this.timeline.restart();

    return this.timeline.then(() => {
      this.isIntroComplete = true;
      this.bus.emit(`section:${this.id}:intro:complete`, {
        sectionId: this.id,
        element: this.element,
      });
    });
  }

  /**
   * Play outro animation
   *
   * Reverses timeline and emits coordination events.
   * For scroll-based outros, may just emit events while ScrollTrigger handles animation.
   *
   * @returns {Promise<void>} Resolves when animation completes
   */
  async playOutro() {
    if (!this.element) {
      console.warn(`[BaseSection] ${this.id}: Cannot play outro - element not found`);
      return;
    }

    this.bus.emit(`section:${this.id}:outro:start`, {
      sectionId: this.id,
      element: this.element,
    });

    this.timeline.reverse();

    return this.timeline.then(() => {
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
   * Resets timeline and state flags for replay or testing.
   */
  reset() {
    this.timeline.pause(0);
    this.isIntroComplete = false;
    this.isOutroComplete = false;
    this.isScrollActive = false;

    this.bus.emit(`section:${this.id}:reset`, {
      sectionId: this.id,
      element: this.element,
    });
  }

  /**
   * Cleanup and remove all animations
   *
   * Kills timeline and ScrollTriggers. Section cannot be reused after destroy().
   */
  destroy() {
    if (this.timeline) {
      this.timeline.kill();
    }

    // Remove ScrollTriggers for this section
    const triggers = ScrollTrigger.getAll();
    triggers.forEach(trigger => {
      if (trigger.vars.trigger === this.element || trigger.vars.trigger === `#${this.id}`) {
        trigger.kill();
      }
    });

    this.bus.emit(`section:${this.id}:destroy`, {
      sectionId: this.id,
    });

    this.element = null;
    this.timeline = null;
  }
}
