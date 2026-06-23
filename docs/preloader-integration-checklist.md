<!-- @format -->

# Preloader Integration Checklist

Use this checklist when modifying the modular preloader pipeline in `js/preloader/`.
The goal is to keep startup behavior deterministic, accessible, and aligned with choreography contracts.

## Scope

- Entry point: `views/templates/partials/choreography-script.njk` (module bootstrap)
- Controller: `js/preloader/Preloader.js`
- Supporting modules: `js/preloader/*.js`
- Template contract: `views/organisms/header/home/home-landing.njk` (the landing header carries `data-preloader`; it is the preloader and persists as the page hero)
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

- [ ] TODO: Verify `home-landing` renders the required selectors:
- \[ \] Issue URL: https://github.com/datainkio/portfolio-frontend/issues/145
  - `[data-preloader]` (root / outro state target)
  - `[data-preloader-el="hgroup"]` (revealed by the outro; its `animationend` ends the exit)
  - `[data-preloader-stack]` / `[data-preloader-text]` are optional now — only used by the legacy resource-observer message path
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

- [ ] TODO: Intro/idle/outro are pure CSS (`styles/components/hanko.css`); the
- \[ \] Issue URL: https://github.com/datainkio/portfolio-frontend/issues/144
      outro is driven by `data-preloader-state="exit"` — no GSAP on this path.
- [ ] TODO: Maintain reduced-motion behavior. The global utility forces
- \[ \] Issue URL: https://github.com/datainkio/portfolio-frontend/issues/143
      `animation: none`, so the hgroup hidden state is scoped to
      `prefers-reduced-motion: no-preference` and the JS exit uses a timeout
      fallback (`PRELOADER_TIMINGS.cssOutroFallbackMs`) since `animationend`
      won't fire.
- [ ] TODO: Keep exit completion idempotent (no double-complete).
- [ ] TODO: Confirm preloader can finish even if GSAP is unavailable (the
- \[ \] Issue URL: https://github.com/datainkio/portfolio-frontend/issues/142
      outro never depends on GSAP).

## Cleanup Guarantees

- [ ] TODO: Ensure cleanup is idempotent.
- [ ] TODO: Always disconnect the resource observer.
- [ ] TODO: Always restore original document/body overflow and scroll position.
- [ ] TODO: Do NOT remove the preloader element — the landing header persists
- \[ \] Issue URL: https://github.com/datainkio/portfolio-frontend/issues/140
      as the page hero; the outro drops its fixed overlay so it settles into
      normal flow.
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
