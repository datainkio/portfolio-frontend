/**
 * ---
 * aix:
 *   id: frontend.js.choreography.config.events
 *   role: Frontend runtime module: js/choreography/config/events.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - events
 * ---
 */
/** @format */

/**
 * Choreography Event Contracts
 *
 * Core event values that define the choreography API and conventions.
 */
export const EVENTS = {
  system: {
    preloaderOut: "preloader:out",
    directorReady: "director:ready",
  },
  video: {
    enter: "video:enter",
    exit: "video:exit",
    introStart: "video:intro:start",
    introComplete: "video:intro:complete",
    outroStart: "video:outro:start",
    outroComplete: "video:outro:complete",
  },
  hero: {
    enter: "hero:enter",
    exit: "hero:exit",
    onEnterBack: "hero:onEnterBack",
    onLeaveBack: "hero:onLeaveBack",
    introStart: "hero:intro:start",
    introComplete: "hero:intro:complete",
    outroStart: "hero:outro:start",
    outroComplete: "hero:outro:complete",
  },
  organizations: {
    enter: "organizations:enter",
    exit: "organizations:exit",
    introStart: "organizations:intro:start",
    introComplete: "organizations:intro:complete",
    outroStart: "organizations:outro:start",
    outroComplete: "organizations:outro:complete",
  },
  bio: {
    enter: "bio:enter",
    exit: "bio:exit",
    introStart: "bio:intro:start",
    introComplete: "bio:intro:complete",
    outroStart: "bio:outro:start",
    outroComplete: "bio:outro:complete",
  },
  awards: {
    enter: "awards:enter",
    exit: "awards:exit",
    introStart: "awards:intro:start",
    introComplete: "awards:intro:complete",
    outroStart: "awards:outro:start",
    outroComplete: "awards:outro:complete",
  },
  work: {
    enter: "work:enter",
    exit: "work:exit",
    introStart: "work:intro:start",
    introComplete: "work:intro:complete",
    outroStart: "work:outro:start",
    outroComplete: "work:outro:complete",
  },
};
