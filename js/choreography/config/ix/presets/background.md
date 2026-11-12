---
description: Background motion presets — BACKGROUND_ANIMATION_DEFAULTS (video reveal) and BACKGROUND_PERSPECTIVE (two-point tilt rest pose) for the background video section.
status: stable
tags:
  - choreography
  - config
  - motion
links:
  - "[[dataink.io/frontend/ia/docs/design/tokens/motion|motion]]"
  - "[[presets|presets]]"
  - "[[BackgroundVideoAnimations|BackgroundVideoAnimations]]"
---

# presets/background

Both consumed by `BackgroundVideoAnimations`.

- `BACKGROUND_ANIMATION_DEFAULTS` — spreads `ANIMATION_DEFAULTS` unchanged; drives the reveal.
- `BACKGROUND_PERSPECTIVE` — the tilt's rest pose and timing: `rotationY` (deg), `perspectiveRatio` (× viewport width → px), `transformOrigin`, `scale` (overscale that closes the exposed wedge; applied before the reveal, not tweened), `duration` (seconds, 1.5 × `slower`), `ease` (GSAP name).
