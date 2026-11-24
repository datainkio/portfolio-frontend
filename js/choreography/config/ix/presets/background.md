---
description: Background motion presets — BACKGROUND_ANIMATION_DEFAULTS, BACKGROUND_PERSPECTIVE (two-point tilt rest pose) and BACKGROUND_GRID_REVEAL (the intro's right-to-left cell reveal) for the background video section.
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

- `BACKGROUND_ANIMATION_DEFAULTS` — the shared `ANIMATION_DEFAULTS`, unchanged. The slow video-fade overrides were removed on 2026-11-24 when the intro became a grid reveal.
- `BACKGROUND_PERSPECTIVE` — the tilt's rest pose and timing: `rotationY` (deg), `perspectiveRatio` (× viewport width → px), `transformOrigin`, `scale` (overscale that closes the exposed wedge; applied before the reveal, not tweened), `duration` (seconds, 1.5 × `slower`), `ease` (GSAP name).
- `BACKGROUND_GRID_REVEAL` — the intro: `columns` (8) and `rows` (6) match the grid in `sizzle-background.njk`, `cellStagger` (`loose`, 0.12s, between cells of one column), `triggerAfterCells` (2: a column starts `triggerAfterCells` x `cellStagger` = 0.24s after the column to its right). Cells pop into a clip-path, so there is no `cellDuration` or `ease`. Total 7 x 0.24 + 5 x 0.12 = 2.28s. Replaced the video and gel fades (`BACKGROUND_VIDEO_GEL_REVEAL`) on 2026-11-24.
