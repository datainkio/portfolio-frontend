/**
 * LandingSequence - Landing page animation choreography coordinator
 *
 * Event-driven sequence that coordinates Hero, Work, and Biography section animations.
 * Listens to AnimationBus events and triggers next animations based on completion.
 *
 * @requires AnimationBus
 */

import { Lumberjack } from '/assets/js/utils/lumberjack/index.js';
import { EVENTS } from '../../constants.js';
const logger = Lumberjack.createScoped('LandingSequence', { prefix: '', color: '#8B5CF6' });

export class LandingSequence {
  /**
   * Initialize landing sequence
   * @param {AnimationBus} bus - Event bus for coordination
   * @param {Object} sections - Section controllers (hero, work, biography)
   */
  constructor(bus, sections) {
    // logger.trace('Constructor called', { bus, sections }, 'verbose', 'standard');

    this.bus = bus;
    this.sections = sections;
    this.state = {
      isStarted: false,
      isComplete: false,
    };
    this._listeners = [];

    logger.trace('Setting up event listeners');

    const HERO_EVENT_HANDLERS = {
      introStart: () => {
        // console.log('Hero intro start');
      },
      introComplete: () => {
        // console.log('Hero intro complete');
      },
      outroStart: () => {
        // console.log('Hero outro starting');
      },
      outroComplete: () => {
        // console.log('Hero outro complete');
      },
    };

    Object.entries(EVENTS.hero).forEach(([key, eventName]) => {
      this._listeners.push(
        this.bus.on(eventName, () => {
          console.log(`[LandingSequence] Hero event: ${key} (${eventName})`);
          HERO_EVENT_HANDLERS[key]?.();
        })
      );
    });
  }

  /**
   * Start landing page animation sequence
   *
   * Kicks off choreography by playing hero intro.
   * Event listeners handle subsequent animations automatically.
   */
  start() {
    this.state.isStarted = true;

    try {
      this.sections.hero.playIntro();
      // logger.trace('Hero intro started', null, 'brief', 'standard');
    } catch (error) {
      // logger.trace('Error starting hero intro', error, 'verbose', 'error');
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

    this._listeners.forEach(unsubscribe => unsubscribe());
    this._listeners = [];
    this.sections = null;
    this.bus = null;
  }
}
