---
description: Standalone init for GlobalHeaderManager on pages that skip AnimationDirector.
type: script
tags:
  - module
  - layouts
  - global-header
links:
  - "[GlobalHeaderManager.js](../choreography/managers/GlobalHeaderManager/GlobalHeaderManager.md)"
---

# global-header

Bootstraps `GlobalHeaderManager` directly for pages that don't load
`AnimationDirector` (the home page instantiates the manager itself, with a
full `ReducedMotionHandler`; this module covers every other page).

## Source

- Module: [[global-header.js]]
- Path: `js/layouts/global-header.js`
- Loaded via: `<script type="module">` in
  [`base.njk`](../../views/layouts/base.md), so it runs on every page that
  extends that layout.

## Responsibilities

1. Build a minimal `reducedMotionHandler` from
   `window.matchMedia("(prefers-reduced-motion: reduce)")`.
2. Instantiate `new GlobalHeaderManager({ reducedMotionHandler })` on import.

No exports — side-effecting init script only.
