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

export class LandingSequence {
  /**
   * Initialize landing sequence
   * @param {AnimationBus} bus - Event bus for coordination
   * @param {Object} sections - Section controllers (hero, work, biography)
   */
  constructor(bus, sections) {
    console.log('[LandingSequence] ========================================');
    console.log('[LandingSequence] Constructor called');
    console.log('[LandingSequence] bus:', bus);
    console.log('[LandingSequence] sections:', sections);
    console.log('[LandingSequence] ========================================');

    this.bus = bus;
    this.sections = sections;
    this.state = {
      isStarted: false,
      isComplete: false,
    };
    this._unsubscribers = [];

    console.log('[LandingSequence] About to call setupSequence()...');
    this.setupSequence();
    console.log('[LandingSequence] ✅ Constructor complete');
    console.log('[LandingSequence] ========================================');
  }

  /**
   * Setup event-driven animation sequence
   *
   * Registers event listeners that define the landing page animation flow.
   * Modify here to change sequence timing, order, or add new steps.
   */
  setupSequence() {
    console.log('[LandingSequence] ========================================');
    console.log('[LandingSequence] setupSequence() called');
    console.log('[LandingSequence] Setting up event listeners...');
    console.log('[LandingSequence] ========================================');

    console.log('[LandingSequence] Setting up animation sequence');

    // Step 1: Hero intro complete → Work intro
    this._unsubscribers.push(
      this.bus.on('section:main-header:intro:complete', () => {
        console.log('[LandingSequence] Hero intro complete → triggering Work intro');
        if (this.sections.work) {
          try {
            this.sections.work.playIntro();
          } catch (error) {
            console.error('[LandingSequence] Error playing Work intro:', error);
          }
        }
      })
    );

    // Step 2: Hero scroll exit → Biography intro
    this._unsubscribers.push(
      this.bus.on('section:main-header:scroll:exit', () => {
        console.log('[LandingSequence] Hero scroll exit → triggering Biography intro');
        if (this.sections.biography) {
          try {
            this.sections.biography.playIntro();
          } catch (error) {
            console.error('[LandingSequence] Error playing Biography intro:', error);
          }
        }
      })
    );

    // Step 3: Work scroll enter → printer marks visible
    this._unsubscribers.push(
      this.bus.on('section:work:scroll:enter', () => {
        console.log('[LandingSequence] Work section entered viewport');
      })
    );

    // Step 4: Biography scroll enter → fade overlay
    this._unsubscribers.push(
      this.bus.on('section:biography:scroll:enter', () => {
        console.log('[LandingSequence] Biography section entered → fading overlay');

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
        console.log('[LandingSequence] All intro sequences complete');
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
      console.warn('[LandingSequence] Sequence already started');
      return;
    }

    if (!this.sections.hero) {
      console.error('[LandingSequence] Cannot start - hero section missing');
      return;
    }

    console.log('[LandingSequence] Starting landing page animation sequence');
    this.state.isStarted = true;

    try {
      this.sections.hero.playIntro();
    } catch (error) {
      console.error('[LandingSequence] Error starting hero intro:', error);
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
    console.log('[LandingSequence] Resetting sequence');

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
    console.log('[LandingSequence] Destroying sequence and cleaning up');

    this._unsubscribers.forEach(unsubscribe => unsubscribe());
    this._unsubscribers = [];
    this.sections = null;
    this.bus = null;
  }
}
