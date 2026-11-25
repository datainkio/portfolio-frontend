---
description: Standalone init for BadgeManager on pages that skip AnimationDirector.
type: script
tags:
  - module
  - layouts
  - badge
links:
  - "[BadgeManager.js](../choreography/managers/BadgeManager/BadgeManager.md)"
---

# badge

Bootstraps `BadgeManager` directly for pages that don't load
`AnimationDirector`. Pages that include
[`choreography-script.njk`](../../views/layouts/partials/choreography-script/choreography-script.md)
with choreography on (home, work, contact) set `window.__enableChoreography`
and load the Director, which instantiates the manager itself with a full
`ReducedMotionHandler`; this module stands down there. Gate on the runtime
flag, not the `enableChoreography` frontmatter: the project page sets the
frontmatter but never includes the script, so it still needs this module.

## Source

- Module: [[badge.js]]
- Path: `js/layouts/badge.js`
- Loaded via: `<script type="module">` in
  [`base.njk`](../../views/layouts/base.md), so it runs on every page that
  extends that layout.

## Responsibilities

1. Build a minimal `reducedMotionHandler` from
   `window.matchMedia("(prefers-reduced-motion: reduce)")`.
2. Unless `window.__enableChoreography` is true, instantiate
   `new BadgeManager({ reducedMotionHandler })` and
   `new BuildInfoManager({ reducedMotionHandler })` on import.
   With no bus, the badge manager reveals the badge immediately (removes
   `hidden`, no tween) and then arms scroll auto-hide. The build-info manager
   wires the build-info drawer inside the badge's dialog, which every page
   renders.

No exports — side-effecting init script only.
