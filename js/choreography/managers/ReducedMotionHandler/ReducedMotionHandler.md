---
id: frontend.js.choreography.managers.reducedmotionhandler
role: "Runtime manager — monitors the prefers-reduced-motion media query and notifies registered callbacks when the user's motion preference changes."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/motion/choreography/manager"
  - "#design/motion/choreography/ReducedMotionHandler"
links:
  - "[[config/index/index|config/index]]"
backlinks:
  - "[[managers/ScrollEffectsCoordinator/ScrollEffectsCoordinator|managers/ScrollEffectsCoordinator]]"
  - "[[managers/ScrollSmootherManager/ScrollSmootherManager|managers/ScrollSmootherManager]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|managers/GelAnimationManager]]"
  - "[[molecules/card-motion/clip|molecules/card-motion/clip]]"
  - "[[molecules/card-motion/fade-n-lift|molecules/card-motion/fade-n-lift]]"
  - "[[molecules/card-motion/throw|molecules/card-motion/throw]]"
  - "[[molecules/card-motion/card-motion|molecules/card-motion]]"
---

## Forced-on override

`_setup()` treats `ACCESSIBILITY_SETTINGS.testReducedMotion` as a **forced-on**
flag, not a default seed. When it is `true`, reduced motion stays on regardless of
the OS `prefers-reduced-motion` setting — useful for disabling choreography while
iterating on styling. Only when the flag is `false` does the handler defer to the
live media query (initial read and the `change` listener). This keeps the config
flag authoritative once set, while the media query remains the source of truth in
the default (`false`) case.
