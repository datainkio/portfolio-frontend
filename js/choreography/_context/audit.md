<!-- @format -->

# Code Review: `js/choreography` Package

Reviewed by: Claude (Opus 4.8)
Date: June 20, 2026
Supersedes: prior Jan 2, 2026 audit (described a `sections/` + `sequences/` + root-`AnimationBus.js` layout that no longer exists; most of its P0/P1 items are resolved).

---

## 1. Current Map

```
choreography/
├── AnimationDirector.js   ← master coordinator; idle-deferred boot, dispatches directorReady
├── index.js               ← package barrel
├── system/                ← runtime core
│   ├── AnimationBus.js          pub/sub (instance-based; injected via DI)
│   ├── NullAnimationBus.js      no-op bus when none provided
│   ├── AbstractSection.js       section controller base (lifecycle + events)
│   ├── AbstractSectionAnimations.js  timeline base (_buildLanding/Intro/Idle/Outro)
│   ├── AbstractSectionTriggers.js    ScrollTrigger base
│   ├── PromiseResolverQueue.js  lifecycle promise queue
│   ├── registry.js              SECTION_REGISTRY
│   └── gsap.js                  single GSAP import + plugin registration
├── config/                ← contracts/ (events, selectors, labels, paths, timelines), ix/, displays/; barrel at config/index/index.js
├── managers/              ← ScrollEffectsCoordinator + global singletons (header/nav/reduced-motion/smoother/gel/session/ruler)
├── atoms/ · molecules/ · tokens/  ← atomic motion layers
├── organisms/             ← section controllers (Hero, BackgroundVideo, Bio, Awards, Organizations, Work) + card/
├── templates/landing/LandingSequence.js
└── pages/Project/
```

Boot: `DOMContentLoaded` → idle → `AnimationDirector` (bus → ScrollEffectsCoordinator → CardManager → sections → managers → LandingSequence) → `director:ready` → preloader exit → `preloader:out` → `LandingSequence.start()`.

## 2. Assessment

Architecture is sound. Atomic layering, DI of the bus, `NullAnimationBus` null-object, `gsap.matchMedia` motion profiles, reduced-motion branches, and lifecycle gating are all in place. Vendor GSAP is locally bundled in `system/gsap.js` (the old Skypack-CDN concern is gone). The prior audit's naming P0s (Director → `AnimationDirector`, StageManager → `ScrollEffectsCoordinator`, `EVENTS.system.*`, section registry, options-object constructor) are all resolved.

## 3. Resolved since prior audit

- `AbstractSection.reset()` / `destroy()` emitted `section:undefined:*` (`this.id` was never assigned) — now use `this.sectionKey`.
- `AnimationBus` had a dead `_debug` flag and inert `enableDebug()` — removed.
- Stale docstrings/file-tree (StageManager refs in `AnimationDirector`, static-usage + wrong event path in `AnimationBus`, `README.choreography.md` tree and links) — refreshed to match the current layout.

## 4. Remaining nits (low priority)

- `LandingSequence` carries `state.isStarted/isComplete/heroIntroRequested` that are only ever set false-on-error, plus commented-out lines (~`:130,144,148`). Wire or delete.
- `AbstractSection.playIntro()` reads `triggers._getTriggerDefaults()?.scrub` (private cross-class access). Works; a public `triggers.isScrubbed()` would read cleaner.
- `WorkHeaderManager` populates `_naturalHeaderHeight` only inside `_collapse`, consumed by `_expand`. Safe today (scroll-mode `_expand(true)` early-returns; `_syncOffset` seeds the var) but order-fragile.

No architectural changes recommended.
