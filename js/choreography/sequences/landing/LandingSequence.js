/**
 * LandingSequence - Landing page animation choreography coordinator
 *
 * Manages the flow of intro and outro animations for the landing page
 * Listens to AnimationBus events and triggers next animations based on completion.
 *
 * @requires AnimationBus
 */

import { Lumberjack } from '/assets/js/utils/lumberjack/index.js';
import { EVENTS } from '../../constants.js';

export class LandingSequence {
  /**
   * Initialize landing sequence
   * @param {AnimationBus} bus - Event bus for coordination
   * @param {Object} sections - Section controllers (hero, work, biography)
   */
  constructor(bus, sections, gelManager = null) {
    this.logger = Lumberjack.createScoped('LandingSequence', { prefix: '', color: '#8B5CF6' });

    this.bus = bus;
    this.sections = sections;
    this.gelManager = gelManager;
    this.state = {
      isStarted: false,
      isComplete: false,
    };
    this._listeners = [];

    this._registerListeners();
  }

  /**
   * Start landing page animation sequence
   *
   * Kicks off choreography by playing hero intro.
   * Event listeners handle subsequent animations automatically.
   */
  start() {
    if (this.state.isStarted) return;
    this.state.isStarted = true;

    try {
      this.sections.splash.playIntro();
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
    this.logger.trace('Resetting sequence', null, 'brief', 'standard');

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
    this.logger.trace('Destroying sequence and cleaning up', null, 'brief', 'standard');

    this._listeners.forEach(unsubscribe => unsubscribe());
    this._listeners = [];
    this.sections = null;
    this.bus = null;
  }

  /**
   * Wire AnimationBus listeners to drive the sequence
   * @private
   */
  _registerListeners() {
    if (!this.bus) return;

    const on = (event, handler) => {
      const off = this.bus.on(event, handler);
      this._listeners.push(off);
    };

    // Splash intro finished → start hero intro
    on(EVENTS.splash.introStart, () => {
      this.logger.trace('Splash intro started');
    });

    // Splash intro finished → start hero intro
    on(EVENTS.splash.introComplete, () => {
      this.logger.trace('Splash intro complete');
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      this.sections?.video?.playIntro?.();
    });

    // Hero outro finished → start work intro
    on(EVENTS.hero.outroComplete, () => {
      this.sections?.work?.playIntro?.();
    });

    // Work intro finished → mark sequence complete
    on(EVENTS.work.introComplete, () => {
      this.state.isComplete = true;
    });
  }
}
