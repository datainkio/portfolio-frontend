---
description: "Runtime infrastructure — centralized GSAP vendor setup that imports, registers all plugins, and sets global animation defaults."
status: stable
tags:
  - choreography
  - gsap
  - system
links:
  - "[[config/index|config/index]]"
---

# system/gsap

The only place GSAP is imported and configured. It registers ScrollTrigger,
ScrollSmoother, SplitText, Draggable and MotionPathPlugin, sets
`gsap.defaults` from `ANIMATION_DEFAULTS` (duration, ease, overwrite), and
re-exports them all. Every other module imports GSAP from here, so plugins
are registered exactly once and the defaults apply everywhere.

MotionPathPlugin has no direct reference in the code. It's registered
because the `motionPath` tween property needs it.
