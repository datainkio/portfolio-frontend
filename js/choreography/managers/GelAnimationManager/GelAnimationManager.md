---
id: frontend.js.choreography.managers.gelanimationmanager
role: "Runtime manager — registry and lifecycle manager for background Gel controller instances, handling initialization, arrangement transitions, and teardown."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - js
  - manager
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/index/index|config/index]]"
backlinks:
  - "[[managers/ScrollEffectsCoordinator/ScrollEffectsCoordinator|managers/ScrollEffectsCoordinator]]"
  - "[[AnimationDirector|AnimationDirector]]"
---

# GelAnimationManager

Registry and lifecycle for `.bg-gel` controller instances. Deliberately does no
scroll-trigger wiring, tween orchestration, or section synchronisation — those
belong to the molecules that own each gel.

## Mask auto-refresh

Each gel gets `enableAutoRefresh()` at init, attaching a `ResizeObserver` that
re-runs `Gel.refresh()` whenever the element box changes, keeping the SVG mask
polygon in sync.

This capability always existed on `Gel` (via `initialize({ autoRefresh: true })`)
but nothing ever switched it on, so mask geometry only updated when some caller
happened to call `refresh()` — leaving masks stale after a viewport resize. It is
called directly rather than through `initialize()` to get the observer alone,
with no mask-application side effects. `destroy()` calls `Gel.destroy()`, which
disconnects it.

Because of this, the hand-rolled `lastHeight`-guarded `gel.refresh()` calls in
`heading-gel`, `overview-gel`, and `process-motion/section-gel` are now
redundant. They are harmless (refresh is idempotent) and were left in place —
removing them is optional cleanup, not a fix.
