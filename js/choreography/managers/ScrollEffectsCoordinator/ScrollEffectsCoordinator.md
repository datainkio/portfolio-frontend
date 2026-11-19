---
description: "Runtime manager — orchestrates site-wide scroll smoothing, gel background layers, and reduced-motion handling via specialized manager modules."
status: stable
tags:
  - choreography
  - manager
links:
  - "[[managers/ReducedMotionHandler/ReducedMotionHandler|managers/ReducedMotionHandler]]"
  - "[[managers/ScrollSmootherManager/ScrollSmootherManager|managers/ScrollSmootherManager]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|managers/GelAnimationManager]]"
  - "[[config/index/index|config/index]]"
---

## Reduced motion

The coordinator has no reduced-motion branch of its own. It creates a `ReducedMotionHandler` and passes it to `ScrollSmootherManager`, which does not create the smoother while reduced motion is on. If reduced motion turns on after the smoother exists, the manager tears it down. With no smoother, `initialize()` falls back to native scroll: it sets the smooth wrapper to `position: static` and `overflow: visible`, and the smooth content to `overflow: visible`.
