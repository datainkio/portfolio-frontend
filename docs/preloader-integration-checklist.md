<!-- @format -->

# Preloader Integration Checklist

Use this checklist when modifying the modular preloader pipeline in `js/preloader/`.
The goal is to keep startup behavior deterministic, accessible, and aligned with choreography contracts.

## Scope

- Entry point: `js/preloader.js`
- Controller: `js/preloader/controller.js`
- Supporting modules: `js/preloader/*.js`
- Template contract: `njk/organisms/SitePreloader.njk`
- Bootstrap script wiring: `njk/templates/partials/choreography-script.njk`

## Module Boundaries

- [ ] Keep `js/preloader.js` as a thin bootstrap only.
- [ ] Keep orchestration and lifecycle state in `js/preloader/controller.js`.
- [ ] Keep side concerns isolated:
  - DOM contract and scroll lock in `dom.js`
  - Preferences and DX hooks in `preferences.js`
  - Resource observer in `resource-observer.js`
  - Animations in `animations.js`
  - Readiness gates in `readiness.js`
  - Deferred media hydration in `deferred-videos.js`
  - Scroll smoother delegation/fallback in `scroll-smoother.js`
- [ ] Avoid moving choreography-specific logic into preloader modules unless it is a clear contract boundary.

## Event Contract

- [ ] Import system event names from `js/choreography/config/events.js`.
- [ ] Do not hardcode `preloader:out` or `director:ready` in preloader code.
- [ ] Ensure preloader dispatches `EVENTS.system.preloaderOut` only once per load.
- [ ] Ensure director readiness wait uses `EVENTS.system.directorReady`.

## Template And DOM Contract

- [ ] Verify `SitePreloader` renders the required selectors:
  - `[data-preloader]`
  - `[data-preloader-stack]`
  - `[data-preloader-text]`
- [ ] Keep `data-scroll-smoother` and `data-gsap-src` support if preloader smoother fallback is required.
- [ ] Ensure `<main>` has compatible busy-state semantics with preloader cleanup.

## Readiness And Timing

- [ ] Preserve the three readiness gates:
  - fonts readiness
  - DOM ready or timeout
  - director ready
- [ ] Keep timeout constants in `constants.js`.
- [ ] Ensure readiness waits do not block forever when choreography is disabled.

## Animation And Accessibility

- [ ] Maintain GSAP path and Web Animations fallback path.
- [ ] Maintain reduced-motion behavior for intro and exit.
- [ ] Keep exit completion idempotent (no double-complete).
- [ ] Confirm preloader can finish even if GSAP is unavailable.

## Cleanup Guarantees

- [ ] Ensure cleanup is idempotent.
- [ ] Always disconnect the resource observer.
- [ ] Always restore original document/body overflow and scroll position.
- [ ] Remove the preloader element if connected.
- [ ] Set `main[aria-busy]` to `false` during cleanup.
- [ ] Hydrate deferred videos after preloader exit.

## Scroll Smoother Integration

- [ ] Prefer delegation to `window.director.getStage().getSmoother()` when available.
- [ ] Only use script-load fallback when stage smoother is unavailable.
- [ ] Deduplicate dynamic script loads.
- [ ] Keep preference precedence consistent (query -> storage -> dataset).

## Logging And DX Hooks

- [ ] Keep logger setup contained in `logger.js`.
- [ ] Keep console DX hooks (`window.__scrollSmoother`) in `preferences.js`.
- [ ] Keep production logs intentional and low-noise.

## Smoke Test Matrix

- [ ] Choreography enabled, reduced motion off.
- [ ] Choreography enabled, reduced motion on.
- [ ] Choreography disabled, reduced motion off.
- [ ] Choreography disabled, reduced motion on.
- [ ] Scroll smoother preference on and off in each mode above.
- [ ] No preloader element present (script should exit cleanly).

## Done Criteria

- [ ] No new errors in `js/preloader/*.js`.
- [ ] Event contracts remain centralized in choreography config.
- [ ] Startup still reaches visible content without deadlocks.
- [ ] Cleanup always runs and leaves page scrollable.
