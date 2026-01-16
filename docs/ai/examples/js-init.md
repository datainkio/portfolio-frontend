# Canonical JS initialization patterns

## Idempotent “boot once” initialization

- Choreography boot sequence: [js/choreography/AnimationDirector.js](../../../js/choreography/AnimationDirector.js)
  - Guards against double-init (`window.director` instance check)
  - Schedules initialization via `requestIdleCallback` with timeout fallback

## Guarding missing DOM

- Section controller pattern: [js/choreography/sections/hero/Hero.js](../../../js/choreography/sections/hero/Hero.js)
  - Queries DOM by selector
  - Skips initialization cleanly if the view is missing

## Constraints to preserve

- Progressive enhancement; no SPA assumptions.
- Init must be safe to rerun.
- Avoid heavy DOM work during first paint; prefer deferred init when appropriate.
