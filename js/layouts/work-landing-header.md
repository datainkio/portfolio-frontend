---
description: Standalone init for WorkHeaderManager, wiring scroll animation to the work landing header.
type: script
tags:
  - module
  - layouts
  - work-landing-header
links:
  - "[WorkHeaderManager.js](../choreography/managers/WorkHeaderManager/WorkHeaderManager.md)"
---

# work-landing-header

Bootstraps `WorkHeaderManager` so the work landing header animates on scroll
via `AnimationDirector`'s manager system.

## Source

- Module: [[work-landing-header.js]]
- Path: `js/layouts/work-landing-header.js`
- Loaded via: `<script type="module">` in
  [`landing.njk`](../../views/templates/landing/landing.md), alongside
  `landing-header.js`.

## Responsibilities

1. Build a minimal `reducedMotionHandler` from
   `window.matchMedia("(prefers-reduced-motion: reduce)")`.
2. Instantiate `new WorkHeaderManager({ reducedMotionHandler })` on import.

No exports — side-effecting init script only.
