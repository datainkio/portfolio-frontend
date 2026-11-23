---
description: Background motion presets — BACKGROUND_ANIMATION_DEFAULTS (video reveal), BACKGROUND_PERSPECTIVE (two-point tilt rest pose) and BACKGROUND_HEADING_GEL_REVEAL (gel_hero fade-in) for the background video section.
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

All consumed by `BackgroundVideoAnimations`.

- `BACKGROUND_ANIMATION_DEFAULTS` — spreads `ANIMATION_DEFAULTS` and overrides `duration` (1.5 × `slower`, 1.5s) and `ease.out` (`standard`) so the video fades in slowly; drives the reveal.
- `BACKGROUND_PERSPECTIVE` — the tilt's rest pose and timing: `rotationY` (deg), `perspectiveRatio` (× viewport width → px), `transformOrigin`, `scale` (overscale that closes the exposed wedge; applied before the reveal, not tweened), `duration` (seconds, 1.5 × `slower`), `ease` (GSAP name).
- `BACKGROUND_HEADING_GEL_REVEAL` — `duration` and `ease` of `gel_hero`'s fade-in when the background moves to idle. Derived from `BACKGROUND_PERSPECTIVE`, so the fade and the tilt stay matched; flat tiers use the same timing.
