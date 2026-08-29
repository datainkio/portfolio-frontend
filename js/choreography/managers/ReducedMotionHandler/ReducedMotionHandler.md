---
description: "Runtime manager — monitors the prefers-reduced-motion media query and notifies registered callbacks when the user's motion preference changes."
status: stable
tags:
  - choreography
  - manager
links:
  - "[[config/index/index|config/index]]"
---

## Forced-on override

`_setup()` treats `ACCESSIBILITY_SETTINGS.testReducedMotion` as a **forced-on**
flag, not a default seed. When it is `true`, reduced motion stays on regardless of
the OS `prefers-reduced-motion` setting — useful for disabling choreography while
iterating on styling. Only when the flag is `false` does the handler defer to the
live media query (initial read and the `change` listener). This keeps the config
flag authoritative once set, while the media query remains the source of truth in
the default (`false`) case.
