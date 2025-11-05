/** @format */

/**
 * Hero Section Animation Controller
 *
 * Manages hero title animations: TextParty.roll intro and scroll-triggered reverse outro.
 * Extends BaseSection for standard lifecycle and event coordination.
 *
 * Dependencies:
 * - DOM: #main-header with h1 element
 * - TextParty.roll: Character animation system
 * - ScrollTrigger: Scroll-based outro
 * - AnimationBus: Event coordination
 *
 * @requires BaseSection
 * @requires ScrollTrigger
 * @requires TextParty
 */

import { BaseSection } from '../base-section/BaseSection.js';
import { ScrollTrigger } from '/assets/js/gsap/ScrollTrigger.js';
import { gsap } from '/assets/js/gsap/all.js';
import * as TextParty from '/assets/js/effects/TextParty.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation constants
const INTRO_DURATION = 1.2;
const INTRO_Y = 100;
const INTRO_EASE = 'power3.out';
const START = 'center center';
const END = 'bottom center';
const SCRUB = 1;
const ROTATION = -15;
const DESTINATION_X = -200;
const EASE = 'sine.out';

/**
 * Hero Section Animation Controller
 *
 * Manages hero title intro (TextParty.roll) and scroll-triggered reverse outro.
 */
export default class Hero extends BaseSection {
  /**
   * Initialize Hero section
   * @param {AnimationBus} bus - Event bus for coordination
   * @param {ScrollSmoother|null} smoother - ScrollSmoother instance
   */
  constructor(bus, smoother) {
    super('main-header', bus, smoother);

    this.titleElement = this.element ? this.element.querySelector('h1') : null;
    this.rollTimeline = null;

    if (!this.titleElement) {
      console.warn('[Hero] h1 element not found - animations disabled');
      return;
    }

    this.createIntro();
    this.createScrollTriggers();
  }

  /**
   * Create TextParty.roll intro animation
   *
   * Builds rolling text entrance with event coordination.
   * Listens for TextParty completion to trigger BaseSection lifecycle events.
   *
   * @override BaseSection.createIntro()
   */
  createIntro() {
    if (!this.titleElement) return;

    const rollSettings = {
      id: 'hero-title-roll',
      duration: INTRO_DURATION,
      stagger: 0.05,
      ease: INTRO_EASE,
      rotation: 15,
      y_delta: INTRO_Y,
    };

    // Create and store TextParty timeline for later reversal
    this.rollTimeline = TextParty.roll(this.titleElement, rollSettings);
    this.timeline.add(this.rollTimeline, 0);

    // Coordinate TextParty events with BaseSection lifecycle
    document.addEventListener('onTextPartyComplete', event => {
      if (event.detail && event.detail.id === this.rollTimeline.vars.id) {
        console.log('[Hero] TextParty roll  animation complete');
      }
    });
  }

  /**
   * Create scroll-triggered outro animation
   *
   * Reverses the TextParty.roll intro as user scrolls past hero.
   * Animation progress tied 1:1 to scroll position.
   *
   * @override BaseSection.createScrollTriggers()
   */
  createScrollTriggers() {
    if (!this.titleElement || !this.rollTimeline) return;

    const rollSettings = {
      id: 'hero-title-roll-reverse',
      duration: INTRO_DURATION,
      stagger: 0.05,
      ease: INTRO_EASE,
      rotation: 15,
      y_delta: INTRO_Y,
    };

    // Build reverse animation timeline
    const reverseTimeline = gsap.timeline();
    const chars = this.titleElement.querySelectorAll('.text-roll-char');

    if (chars.length > 0) {
      reverseTimeline.to(chars, {
        duration: rollSettings.duration,
        rotation: 0 - rollSettings.rotation,
        skewY: '1.2rad',
        y: rollSettings.y_delta,
        stagger: {
          each: 0.1,
          ease: 'power1.inOut',
        },
        ease: rollSettings.ease,
      });
    }

    // Attach animation to scroll progress
    ScrollTrigger.create({
      trigger: this.titleElement,
      start: START,
      end: END,
      scrub: SCRUB,
      onEnter: () => {
        this.bus.emit(`section:${this.id}:scroll:enter`, {
          sectionId: this.id,
          element: this.element,
        });
      },
      onLeave: () => {
        this.bus.emit(`section:${this.id}:scroll:exit`, {
          sectionId: this.id,
          element: this.element,
        });
        this.bus.emit(`section:${this.id}:outro:start`, {
          sectionId: this.id,
          element: this.element,
        });
      },
      animation: reverseTimeline,
    });
  }
}
