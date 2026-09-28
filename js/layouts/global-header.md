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
`AnimationDirector`. Pages that include
[`choreography-script.njk`](../../views/templates/partials/choreography-script/choreography-script.md)
with choreography on (home, work, contact) set `window.__enableChoreography`
and load the Director, which instantiates the manager itself with a full
`ReducedMotionHandler`; this module stands down there. Gate on the runtime
flag, not the `enableChoreography` frontmatter: the project page sets the
frontmatter but never includes the script, so it still needs this module.

## Source

- Module: [[global-header.js]]
- Path: `js/layouts/global-header.js`
- Loaded via: `<script type="module">` in
  [`base.njk`](../../views/layouts/base.md), so it runs on every page that
  extends that layout.

## Responsibilities

1. Build a minimal `reducedMotionHandler` from
   `window.matchMedia("(prefers-reduced-motion: reduce)")`.
2. Unless `window.__enableChoreography` is true, instantiate
   `new GlobalHeaderManager({ reducedMotionHandler })` on import.
   With no bus, the manager reveals the header immediately (removes `hidden`,
   no tween) and then arms scroll auto-hide.

No exports — side-effecting init script only.
