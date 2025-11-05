/**
 * LandingSequence - Landing page animation choreography coordinator
 *
 * Event-driven sequence that coordinates Hero, Work, and Biography section animations.
 * Listens to AnimationBus events and triggers next animations based on completion.
 *
 * Sequence flow:
 * 1. Hero intro → Work intro
 * 2. Hero scroll exit → Biography intro
 * 3. Work scroll enter → printer marks visible
 * 4. Biography scroll enter → overlay fade
 *
 * @requires AnimationBus
 * @requires gsap
 */

import { gsap } from '/assets/js/gsap/all.js';
import { Lumberjack } from '/assets/js/utils/lumberjack/index.js';

const logger = Lumberjack.createScoped('LandingSequence', { prefix: '', color: '#8B5CF6' });

export class LandingSequence {
  /**
   * Initialize landing sequence
   * @param {AnimationBus} bus - Event bus for coordination
   * @param {Object} sections - Section controllers (hero, work, biography)
   */
  constructor(bus, sections) {
    logger.trace('Constructor called', { bus, sections }, 'verbose', 'standard');

    this.bus = bus;
    this.sections = sections;
    this.state = {
      isStarted: false,
      isComplete: false,
    };
    this._unsubscribers = [];

    this.setupSequence();
    logger.trace('Constructor complete', null, 'brief', 'success');
  }

  /**
   * Setup event-driven animation sequence
   *
   * Registers event listeners that define the landing page animation flow.
   * Modify here to change sequence timing, order, or add new steps.
   */
  setupSequence() {
    logger.trace('Setting up event listeners', null, 'brief', 'headsup');

    // Step 1: Hero intro complete → Work intro
    this._unsubscribers.push(
      this.bus.on('section:main-header:intro:complete', () => {
        logger.trace('Hero intro complete → triggering Work intro', null, 'brief', 'standard');
        if (this.sections.work) {
          try {
            this.sections.work.playIntro();
          } catch (error) {
            logger.trace('Error playing Work intro', error, 'verbose', 'error');
          }
        }
      })
    );

    // Step 2: Hero scroll exit → Biography intro
    this._unsubscribers.push(
      this.bus.on('section:main-header:scroll:exit', () => {
        logger.trace('Hero scroll exit → triggering Biography intro', null, 'brief', 'standard');
        if (this.sections.biography) {
          try {
            this.sections.biography.playIntro();
          } catch (error) {
            logger.trace('Error playing Biography intro', error, 'verbose', 'error');
          }
        }
      })
    );

    // Step 3: Work scroll enter → printer marks visible
    this._unsubscribers.push(
      this.bus.on('section:work:scroll:enter', () => {
        logger.trace('Work section entered viewport', null, 'brief', 'standard');
      })
    );

    // Step 4: Biography scroll enter → fade overlay
    this._unsubscribers.push(
      this.bus.on('section:biography:scroll:enter', () => {
        logger.trace('Biography section entered → fading overlay', null, 'brief', 'standard');

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

    // Step 5: Mark sequence complete
    this._unsubscribers.push(
      this.bus.on('section:biography:intro:complete', () => {
        logger.trace('All intro sequences complete', null, 'brief', 'success');
        this.state.isComplete = true;
      })
    );
  }

  /**
   * Start landing page animation sequence
   *
   * Kicks off choreography by playing hero intro.
   * Event listeners handle subsequent animations automatically.
   */
  start() {
    if (this.state.isStarted) {
      logger.trace('Sequence already started', null, 'brief', 'headsup');
      return;
    }

    if (!this.sections.hero) {
      logger.trace('Cannot start - hero section missing', null, 'brief', 'error');
      return;
    }

    logger.trace('Starting landing page animation sequence', null, 'brief', 'headsup');
    this.state.isStarted = true;

    try {
      this.sections.hero.playIntro();
    } catch (error) {
      logger.trace('Error starting hero intro', error, 'verbose', 'error');
      this.state.isStarted = false;
    }
  }

  /**
   * Reset sequence to initial state
   *
   * Resets all section controllers and clears state flags.
   * Does not remove event listeners - use destroy() for full cleanup.
   */
  reset() {
    logger.trace('Resetting sequence', null, 'brief', 'standard');

    Object.values(this.sections).forEach(section => {
      if (section && typeof section.reset === 'function') {
        section.reset();
      }
    });

    this.state.isStarted = false;
    this.state.isComplete = false;
  }

  /**
   * Cleanup and remove event listeners
   *
   * Call when sequence no longer needed to prevent memory leaks.
   * Sequence cannot be reused after destroy().
   */
  destroy() {
    logger.trace('Destroying sequence and cleaning up', null, 'brief', 'standard');

    this._unsubscribers.forEach(unsubscribe => unsubscribe());
    this._unsubscribers = [];
    this.sections = null;
    this.bus = null;
  }
}
