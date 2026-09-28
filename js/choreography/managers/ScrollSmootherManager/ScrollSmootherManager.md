---
description: "Runtime manager — manages GSAP ScrollSmoother initialization, lifecycle, and accessibility-aware disabling on reduced-motion preference."
status: stable
tags:
  - choreography
  - manager
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/index/index|config/index]]"
---

## In-page anchors

While the smoother is active, `enable()` registers a document click handler that routes same-page `#hash` links through `smoother.scrollTo(target, true, "top top")`, then pushes the hash to history and moves focus to the target (`preventScroll`). `disable()` removes it.

It only intercepts targets inside the smoothed content. Modified clicks (meta/ctrl/shift/alt), non-primary buttons, and already-prevented events pass through.

Why: a native hash jump scrolls the fixed, `overflow: hidden` wrapper (`#page-main`) instead of the window. The smoother never resets that offset, so the page could no longer scroll back above the target. This broke the work page's industry jump nav.
