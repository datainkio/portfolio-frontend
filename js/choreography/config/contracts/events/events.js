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
    landingStart: "video:landing:start",
    landingComplete: "video:landing:complete",
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
    landingStart: "hero:landing:start",
    landingComplete: "hero:landing:complete",
    introStart: "hero:intro:start",
    introComplete: "hero:intro:complete",
    outroStart: "hero:outro:start",
    outroComplete: "hero:outro:complete",
  },
  organizations: {
    enter: "organizations:enter",
    exit: "organizations:exit",
    landingStart: "organizations:landing:start",
    landingComplete: "organizations:landing:complete",
    introStart: "organizations:intro:start",
    introComplete: "organizations:intro:complete",
    outroStart: "organizations:outro:start",
    outroComplete: "organizations:outro:complete",
  },
  bio: {
    enter: "bio:enter",
    exit: "bio:exit",
    onEnterBack: "bio:onEnterBack",
    onLeaveBack: "bio:onLeaveBack",
    landingStart: "bio:landing:start",
    landingComplete: "bio:landing:complete",
    introStart: "bio:intro:start",
    introComplete: "bio:intro:complete",
    outroStart: "bio:outro:start",
    outroComplete: "bio:outro:complete",
  },
  awards: {
    enter: "awards:enter",
    exit: "awards:exit",
    landingStart: "awards:landing:start",
    landingComplete: "awards:landing:complete",
    introStart: "awards:intro:start",
    introComplete: "awards:intro:complete",
    outroStart: "awards:outro:start",
    outroComplete: "awards:outro:complete",
  },
  work: {
    enter: "work:enter",
    exit: "work:exit",
    landingStart: "work:landing:start",
    landingComplete: "work:landing:complete",
    introStart: "work:intro:start",
    introComplete: "work:intro:complete",
    outroStart: "work:outro:start",
    outroComplete: "work:outro:complete",
  },
};
