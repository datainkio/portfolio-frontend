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
import HeroAnimations from './HeroAnimations.js';
import HeroTriggers from './HeroTriggers.js';

const ID = 'main-header';

/**
 * Hero Section Animation Controller
 *
 * Manages hero title intro (TextParty.roll) and scroll-triggered reverse outro.
 */
export default class Hero extends BaseSection {
  /**
   * Initialize Hero section
   * @param {AnimationBus} bus - Event bus for coordination
   */
  constructor(bus) {
    super(ID, bus);

    // The Hero class is all about animations on the <h1> title element
    this.titleElement = this.element ? this.element.querySelector('h1') : null;

    // Extend the animation and trigger modules
    this.anim = this.titleElement ? new HeroAnimations(this.titleElement, this.id) : null;
    this.triggers = this.titleElement ? new HeroTriggers(this.titleElement, this.id) : null;

    this.intro = this.anim.lines();
    // this.outro = this.anim.animRollReverse;
    // this.createIntro();
    // this.createOutro();
    // this.createScrollTriggers();
  }
}
