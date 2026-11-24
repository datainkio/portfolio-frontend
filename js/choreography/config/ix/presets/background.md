---
description: Background motion presets — BACKGROUND_ANIMATION_DEFAULTS (video reveal), BACKGROUND_PERSPECTIVE (two-point tilt rest pose) and BACKGROUND_VIDEO_GEL_REVEAL (gel_video fade-in before the video) for the background video section.
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
- `BACKGROUND_VIDEO_GEL_REVEAL` — `duration` (`slow`) and `ease` (`standard`) of `gel_video`'s fade-in, the first step of the intro, before the video fades in. Its own values (since 2026-11-24; the earlier hero gel reveal was derived from `BACKGROUND_PERSPECTIVE`).
