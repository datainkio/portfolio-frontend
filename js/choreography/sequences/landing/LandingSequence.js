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
  constructor(bus, sections, gelAnimation) {
    this.logger = Lumberjack.createScoped('LandingSequence', { prefix: '', color: '#8B5CF6' });

    this.bus = bus;
    this.sections = sections;
    this.gelManager = gelAnimation;
    this.state = {
      isStarted: false,
      isComplete: false,
    };
    this._listeners = [];

    this.handleDirectorReady = () => this.start();
    window.addEventListener('director:ready', this.handleDirectorReady, { once: true });

    this._registerListeners();
  }

  /**
   * Start landing page animation sequence
   *
   * Kicks off choreography by playing hero intro.
   * Event listeners handle subsequent animations automatically.
   */

  start() {
    this.logger.trace('Starting landing sequence');
    if (this.state.isStarted) return;
    this.state.isStarted = true;

    try {
      this.sections?.video?.playIntro?.();
      // logger.trace('Hero intro started', null, 'brief', 'standard');
    } catch (error) {
      this.logger.trace('Error starting hero intro', error, 'verbose', 'error');
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
    if (this.handleDirectorReady) {
      window.removeEventListener('director:ready', this.handleDirectorReady);
    }

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

    /**
     * HERO EVENTS
     */

    // Respond to hero intro start
    on(EVENTS.hero.enter, () => {
      this.logger.trace('Hero entered');
    });

    on(EVENTS.hero.exit, () => {
      this.logger.trace('Hero exited');
    });

    // Respond to hero intro start
    on(EVENTS.hero.introStart, () => {
      // this.logger.trace('Hero intro started');
    });

    // Respond to hero intro complete
    on(EVENTS.hero.introComplete, () => {
      // this.logger.trace('Hero intro complete');
      // this.gelManager?
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      // this.sections?.video?.playIntro?.();
    });

    // Respond to hero outro start
    on(EVENTS.hero.outroStart, () => {
      // this.logger.trace('Hero outro started');
    });

    // Respond to hero outro complete
    on(EVENTS.hero.outroComplete, () => {
      // this.logger.trace('Hero outro complete');
      this.sections?.work?.playIntro?.();
    });

    /**
     * BACKGROUNDVIDEO ANIMATION EVENTS
     */
    // Respond to hero intro start
    on(EVENTS.video.introStart, () => {
      // this.logger.trace('BG Video intro started');
    });

    // Respond to hero intro complete
    on(EVENTS.video.introComplete, () => {
      // this.logger.trace('BG Video intro complete');
      // this.gelManager?
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      // this.sections?.video?.playIntro?.();
      this.sections.hero.playIntro();
    });

    // Respond to hero outro start
    on(EVENTS.video.outroStart, () => {
      this.logger.trace('BG Video outro started');
    });

    // Respond to hero outro complete
    on(EVENTS.video.outroComplete, () => {
      this.logger.trace('BG Video outro complete');
      // this.sections?.work?.playIntro?.();
    });

    /**
     * ORGANIZATIONS EVENTS
     */

    // Respond to organizations intro start
    on(EVENTS.organizations.enter, () => {
      this.logger.trace('Organizations entered');
    });

    on(EVENTS.organizations.exit, () => {
      this.logger.trace('Organizations exited');
    });

    // Respond to organizations intro start
    on(EVENTS.organizations.introStart, () => {
      // this.logger.trace('Organizations intro started');
    });

    // Respond to organizations intro complete
    on(EVENTS.organizations.introComplete, () => {
      // this.logger.trace('Organizations intro complete');
      // this.gelManager?
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      this.sections?.video?.playIntro?.();
    });

    // Respond to organizations outro start
    on(EVENTS.organizations.outroStart, () => {
      // this.logger.trace('Organizations outro started');
    });

    // Respond to organizations outro complete
    on(EVENTS.organizations.outroComplete, () => {
      // this.logger.trace('Organizations outro complete');
      this.sections?.work?.playIntro?.();
    });

    /**
     * BIO EVENTS
     */

    // Respond to bio intro start
    on(EVENTS.bio.enter, () => {
      this.logger.trace('Bio entered');
    });

    on(EVENTS.bio.exit, () => {
      this.logger.trace('Bio exited');
    });

    // Respond to bio intro start
    on(EVENTS.bio.introStart, () => {
      // this.logger.trace('Bio intro started');
    });

    // Respond to bio intro complete
    on(EVENTS.bio.introComplete, () => {
      // this.logger.trace('Bio intro complete');
      // this.gelManager?
      // this.gelManager?.shrinkGelToViewportFraction(0, { x: 0.5, y: 1, origin: 'left center' });
      // this.sections?.video?.playIntro?.();
    });

    // Respond to bio outro start
    on(EVENTS.bio.outroStart, () => {
      // this.logger.trace('Bio outro started');
    });

    // Respond to bio outro complete
    on(EVENTS.bio.outroComplete, () => {
      // this.logger.trace('Bio outro complete');
      // this.sections?.work?.playIntro?.();
    });
  }
}
