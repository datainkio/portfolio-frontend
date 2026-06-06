<!-- @format -->

# Preloader Integration Checklist

Use this checklist when modifying the modular preloader pipeline in `js/preloader/`.
The goal is to keep startup behavior deterministic, accessible, and aligned with choreography contracts.

## Scope

- Entry point: `views/templates/partials/choreography-script.njk` (module bootstrap)
- Controller: `js/preloader/Preloader.js`
- Supporting modules: `js/preloader/*.js`
- Template contract: `views/organisms/SitePreloader.njk`
- Bootstrap script wiring: `views/templates/partials/choreography-script.njk`

## Module Boundaries

- [ ] TODO: Keep bootstrap wiring in `views/templates/partials/choreography-script.njk` as a thin import-and-init wrapper.
- [ ] TODO: Keep orchestration and lifecycle state in `js/preloader/Preloader.js`.
- [ ] TODO: Keep side concerns isolated:
  - DOM contract and scroll lock in `dom.js`
  - Preferences and DX hooks in `preferences.js`
  - Resource observer in `resource-observer.js`
  - Animations in `animations.js`
  - Readiness gates in `readiness.js`
  - Deferred media hydration in `deferred-videos.js`
  - Scroll smoother delegation/fallback in `scroll-smoother.js`
- [ ] TODO: Avoid moving choreography-specific logic into preloader modules unless it is a clear contract boundary.

## Event Contract

- [ ] TODO: Import system event names from `js/choreography/config/events.js`.
- [ ] TODO: Do not hardcode `preloader:out` or `director:ready` in preloader code.
- [ ] TODO: Ensure preloader dispatches `EVENTS.system.preloaderOut` only once per load.
- [ ] TODO: Ensure director readiness wait uses `EVENTS.system.directorReady`.

## Template And DOM Contract

- [ ] TODO: Verify `SitePreloader` renders the required selectors:
  - `[data-preloader]`
  - `[data-preloader-stack]`
  - `[data-preloader-text]`
- [ ] TODO: Keep `data-scroll-smoother` and `data-gsap-src` support if preloader smoother fallback is required.
- [ ] TODO: Ensure `<main>` has compatible busy-state semantics with preloader cleanup.

## Readiness And Timing

- [ ] TODO: Preserve the three readiness gates:
  - fonts readiness
  - DOM ready or timeout
  - director ready
- [ ] TODO: Keep timeout constants in `constants.js`.
- [ ] TODO: Ensure readiness waits do not block forever when choreography is disabled.

## Animation And Accessibility

- [ ] TODO: Maintain GSAP path and Web Animations fallback path.
- [ ] TODO: Maintain reduced-motion behavior for intro and exit.
- [ ] TODO: Keep exit completion idempotent (no double-complete).
- [ ] TODO: Confirm preloader can finish even if GSAP is unavailable.

## Cleanup Guarantees

- [ ] TODO: Ensure cleanup is idempotent.
- [ ] TODO: Always disconnect the resource observer.
- [ ] TODO: Always restore original document/body overflow and scroll position.
- [ ] TODO: Remove the preloader element if connected.
- [ ] TODO: Set `main[aria-busy]` to `false` during cleanup.
- [ ] TODO: Hydrate deferred videos after preloader exit.

## Scroll Smoother Integration

- [ ] TODO: Prefer delegation to `window.director.getStage().getSmoother()` when available.
- [ ] TODO: Only use script-load fallback when stage smoother is unavailable.
- [ ] TODO: Deduplicate dynamic script loads.
- [ ] TODO: Keep preference precedence consistent (query -> storage -> dataset).

## Logging And DX Hooks

- [ ] TODO: Keep logger setup contained in `logger.js`.
- [ ] TODO: Keep console DX hooks (`window.__scrollSmoother`) in `preferences.js`.
- [ ] TODO: Keep production logs intentional and low-noise.

## Smoke Test Matrix

- [ ] TODO: Choreography enabled, reduced motion off.
- [ ] TODO: Choreography enabled, reduced motion on.
- [ ] TODO: Choreography disabled, reduced motion off.
- [ ] TODO: Choreography disabled, reduced motion on.
- [ ] TODO: Scroll smoother preference on and off in each mode above.
- [ ] TODO: No preloader element present (script should exit cleanly).

## Done Criteria

- [ ] TODO: No new errors in `js/preloader/*.js`.
- [ ] TODO: Event contracts remain centralized in choreography config.
- [ ] TODO: Startup still reaches visible content without deadlocks.
- [ ] TODO: Cleanup always runs and leaves page scrollable.
