/** @format */

/**
 * Choreography System Constants
 *
 * Core system values that define the choreography API and conventions.
 * These are INTERNAL to the animation system and should NOT change between projects.
 *
 * These constants define the choreography system's public API and event contracts.
 * When adapting this system to a new project, these values should remain unchanged
 * to maintain compatibility with the core animation architecture.
 *
 * For site-specific values (DOM selectors, asset paths, visual settings),
 * see config.js
 *
 * @fileoverview System-level constants for choreography architecture
 */

/**
 * AnimationBus Event Names
 *
 * Standardized event naming convention for cross-section coordination.
 * Section controllers emit these events to signal animation lifecycle phases,
 * allowing other components (StageManager, GelAnimationManager, etc.) to
 * coordinate timing without tight coupling.
 *
 * NAMING CONVENTION:
 * - [section]:intro:start    - Section begins intro animation
 * - [section]:intro:complete - Section intro animation finished
 * - [section]:outro:start    - Section begins outro animation
 * - [section]:outro:complete - Section outro animation finished
 *
 * USAGE:
 * import { AnimationBus } from './AnimationBus.js';
 * import { EVENTS } from './constants.js';
 *
 * // Emit event when animation completes
 * AnimationBus.emit(EVENTS.hero.introComplete);
 *
 * // Listen for events from other sections
 * AnimationBus.on(EVENTS.hero.outroComplete, () => {
 *   // Start next animation
 * });
 */
export const EVENTS = {
  hero: {
    introStart: 'hero:intro:start',
    introComplete: 'hero:intro:complete',
    outroStart: 'hero:outro:start',
    outroComplete: 'hero:outro:complete',
  },
  work: {
    introStart: 'work:intro:start',
    introComplete: 'work:intro:complete',
    outroStart: 'work:outro:start',
    outroComplete: 'work:outro:complete',
  },
  biography: {
    introStart: 'biography:intro:start',
    introComplete: 'biography:intro:complete',
    outroStart: 'biography:outro:start',
    outroComplete: 'biography:outro:complete',
  },
};
