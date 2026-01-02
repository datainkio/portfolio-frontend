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
  system: {
    preloaderOut: 'preloader:out',
    directorReady: 'director:ready',
  },
  video: {
    enter: 'video:enter',
    exit: 'video:exit',
    introStart: 'video:intro:start',
    introComplete: 'video:intro:complete',
    outroStart: 'video:outro:start',
    outroComplete: 'video:outro:complete',
  },
  hero: {
    enter: 'hero:enter',
    exit: 'hero:exit',
    introStart: 'hero:intro:start',
    introComplete: 'hero:intro:complete',
    outroStart: 'hero:outro:start',
    outroComplete: 'hero:outro:complete',
  },
  organizations: {
    enter: 'organizations:enter',
    exit: 'organizations:exit',
    introStart: 'organizations:intro:start',
    introComplete: 'organizations:intro:complete',
    outroStart: 'organizations:outro:start',
    outroComplete: 'organizations:outro:complete',
  },
  bio: {
    enter: 'bio:enter',
    exit: 'bio:exit',
    introStart: 'bio:intro:start',
    introComplete: 'bio:intro:complete',
    outroStart: 'bio:outro:start',
    outroComplete: 'bio:outro:complete',
  },
};
