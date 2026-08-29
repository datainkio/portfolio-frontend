---
title: Animation Manager Modules
description: "Single-responsibility modules for global, cross-section behavior."
type: index
---

<!-- @format -->

# Animation Manager Modules

Single-responsibility modules for global, cross-section behavior. They fall into two groups with different owners, different constructors, and different cleanup methods — the split matters.

## Two Groups

**Effects managers** are owned and constructed by `ScrollEffectsCoordinator`, which is itself constructed by `AnimationDirector` as `this.stage`. They implement `destroy()`.

**Global managers** are constructed directly by `AnimationDirector`, one field each. They implement `kill()`, and `AnimationDirector.destroy()` calls it on every one.

```
AnimationDirector
├── ScrollEffectsCoordinator (this.stage)      → destroy()
│   ├── ReducedMotionHandler                   → destroy()
│   ├── ScrollSmootherManager                  → destroy()
│   └── GelAnimationManager                    → destroy()
├── CardManager (organisms/card/)              → kill()
├── GlobalHeaderManager                        → kill()
├── HomeHeaderManager                          → kill()
├── WorkHeaderManager                          → kill()
├── WorkNavManager                             → kill()
├── ProjectHeaderManager                       → kill()
├── BuildInfoManager                           → kill()
└── SectionCapManager                          → kill()
```

`SessionManager` and `RulerIntroManager` are not constructed by the Director — they are used where needed. `SessionManager` is plain persisted state with no teardown; `RulerIntroManager` implements `destroy()`.

There is no `BackgroundLayerManager`. Fixed backgrounds are kept out of the ScrollSmoother transform context by template placement, not by a runtime manager.

## Roster

| Manager                    | Owner    | Purpose                                                                       | Cleanup   |
| -------------------------- | -------- | ----------------------------------------------------------------------------- | --------- |
| `ReducedMotionHandler`     | Stage    | `prefers-reduced-motion` detection + change subscription                      | `destroy` |
| `ScrollSmootherManager`    | Stage    | GSAP ScrollSmoother lifecycle; degrades to native scroll                      | `destroy` |
| `GelAnimationManager`      | Stage    | `Gel` controller registry for `.bg-gel` elements; arrangement transitions     | `destroy` |
| `ScrollEffectsCoordinator` | Director | Constructs the three above; native-scroll fallback                            | `destroy` |
| `GlobalHeaderManager`      | Director | Global header hide/show on scroll                                             | `kill`    |
| `HomeHeaderManager`        | Director | Home landing header role state machine (loader → hero → menu); home page only | `kill`    |
| `WorkHeaderManager`        | Director | Work jumplinks collapse/expand; publishes the `--work-header-h` offset        | `kill`    |
| `WorkNavManager`           | Director | Work local-nav scrollspy; emits `work:nav:active`                             | `kill`    |
| `ProjectHeaderManager`     | Director | Project page hero parallax; no-ops off project pages                          | `kill`    |
| `BuildInfoManager`         | Director | Section-cap build-info disclosure (click toggle)                              | `kill`    |
| `SectionCapManager`        | Director | Section-cap scrollspy (active section tracking)                               | `kill`    |
| `SessionManager`           | ad hoc   | Persisted runtime session state; gates one-time animations                    | —         |
| `RulerIntroManager`        | ad hoc   | Ruler intro overlay choreography                                              | `destroy` |

The LeaderLine connector experiment was removed on 2026-08-06 —
`managers/LineManager.js` and its config dependency
`config/displays/leader-lines.js` (plus both sidecars). It was never imported,
never constructed by `AnimationDirector`, and never part of the boot sequence.

## Effects Managers

### ReducedMotionHandler

Accessibility foundation. Every other animation decision reads from it.

```javascript
const handler = new ReducedMotionHandler();

if (handler.isReducedMotion()) {
  // use reduced path
}

const unsubscribe = handler.onChange((enabled) => {
  console.log("Reduced motion:", enabled);
});
```

Sections do not usually touch this directly — `AbstractSection` resolves motion through `gsap.matchMedia()` and the per-section profiles in [`../config/ix/profiles.js`](../config/ix/profiles.js).

### ScrollSmootherManager

```javascript
const manager = new ScrollSmootherManager(reducedMotionHandler);

manager.getSmoother(); // ScrollSmoother instance, or null
manager.isActive(); // boolean
manager.enable();
manager.disable();
manager.destroy();
```

Requires both `#smooth-wrapper` and `#smooth-content` in the DOM; returns `null` and lets `ScrollEffectsCoordinator._fallbackToNativeScroll()` reset the wrapper styles when either is missing.

### GelAnimationManager

Takes **one** argument — the reduced-motion handler. There is no config object and no per-gel width map; gels are discovered from `.bg-gel` elements and driven by named arrangements.

```javascript
const manager = new GelAnimationManager(reducedMotionHandler);

manager.initialize(); // build Gel controllers from the DOM
manager.applyArrangement(arrangementId, options); // transition to a named arrangement
manager.getActiveArrangementId();
manager.getGel(gelId);
manager.getTween(gelId);
manager.getGels();
manager.destroy();
```

Sections receive this instance as the `gelManager` option and pass it into their animations module — see [`../organisms/process/Process.js`](../organisms/process/Process.js).

## Adding a Manager

Global managers follow one shape:

```javascript
export default class CustomManager {
  constructor({ bus, reducedMotionHandler } = {}) {
    // resolve DOM; bail quietly if absent
  }

  kill() {
    // kill tweens/ScrollTriggers, remove listeners, null refs
  }
}
```

Then construct it in `AnimationDirector`, add the matching `this.customManager?.kill(); this.customManager = null;` to `destroy()`, and export it from [`index/index.js`](index/index.js). Use `kill()` for Director-owned managers so the teardown loop stays uniform.

## Debugging

```javascript
const stage = window.director.getStage();
stage.scrollSmoother.isActive();
stage.gelAnimation.getGels();
stage.reducedMotion.isReducedMotion();
```

There is no `enableDebug()` — the inert `AnimationBus.enableDebug()` was removed. Modules log through scoped `lumberjack` loggers.

**Common issues**

1. **ScrollSmoother not working** — confirm `#smooth-wrapper` and `#smooth-content` both exist.
2. **Gels not animating** — confirm `.bg-gel` elements are present, then check `getGels()` is non-empty.
3. **Fixed backgrounds drifting** — ScrollSmoother transforms `#smooth-content`, which breaks `position: fixed` inside it. Move the element out of `#smooth-content` in the template.

---

**Related**: [`ScrollEffectsCoordinator.js`](ScrollEffectsCoordinator/ScrollEffectsCoordinator.js) · [`../AnimationDirector.js`](../AnimationDirector.js) · [`../README.choreography.md`](../README.choreography.md)
