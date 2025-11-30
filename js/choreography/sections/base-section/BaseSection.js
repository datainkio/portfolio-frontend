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
 */

import lumberjack from '/assets/js/utils/lumberjack/index.js';
import BaseAnimations from './BaseAnimations.js';
import BaseTriggers from './BaseTriggers.js';

export class BaseSection {
  /**
   * Initialize section controller
   *
   * Subclasses must call super(id, bus, smoother) in constructor,
   * then call createIntro(), createOutro(), and createScrollTriggers().
   *
   * @param {string} sectionId - DOM element ID (e.g., 'main-header')
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(sectionId, bus) {
    this.id = sectionId; // the section identifier
    this.bus = bus; // the AnimationBus instance
    this.element = document.getElementById(sectionId); // the target DOM element
    if (!this.element) {
      console.warn(`[BaseSection] Element #${sectionId} not found - section disabled`);
      return;
    }
    // Initialize animation and trigger modules
    this.animations = new BaseAnimations(this.element, this.id);
    this.triggers = new BaseTriggers(this.element, this.id);

    // Listen for timeline events
    this.animations.timeline.eventCallback('onStart', () => {
      this.onIntroStart();
    });

    this.animations.timeline.eventCallback('onComplete', () => {
      this.onIntroComplete();
    });

    this.animations.timeline.eventCallback('onReverseComplete', () => {
      this.onOutroComplete();
    });

    // NOTE: onReverseStart is not available in GSAP timelines

    // State flags
    // this.isIntroComplete = false;
    // this.isOutroComplete = false;
    //  this.isScrollActive = false;
  }

  onEnterScroll() {
    console.log(`[BaseSection] ${this.id}: Entered scroll trigger`);
  }

  onExitScroll() {
    console.log(`[BaseSection] ${this.id}: Exited scroll trigger`);
  }

  onIntroStart() {
    console.log(`[BaseSection] ${this.id}: Intro started`);
  }

  onIntroComplete() {
    console.log(`[BaseSection] ${this.id}: Intro complete`);
  }

  onOutroStart() {
    console.log(`[BaseSection] ${this.id}: Outro started`);
  }

  onOutroComplete() {
    console.log(`[BaseSection] ${this.id}: Outro complete`);
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
    lumberjack.trace(`[BaseSection] ${this.id}: Playing intro animation`, null, 'brief', 'headsup');
    if (!this.element) {
      lumberjack.trace(
        `[BaseSection] ${this.id}: Cannot play intro - element not found`,
        null,
        'brief',
        'headsup'
      );
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
    lumberjack.trace(`[BaseSection] ${this.id}: Playing outro animation`, null, 'brief', 'headsup');
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
