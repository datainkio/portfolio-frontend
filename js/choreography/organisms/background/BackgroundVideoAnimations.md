---
description: Background video animations module — builds the empty landing and the grid-reveal intro timelines (the intro hides the opaque cell grid over the video), the idle timeline whose progress marks the static two-point perspective rest pose of the section root, and the gel_video and grid snaps.
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[system/gsap|system/gsap]]"
  - "[[dataink.io/frontend/ia/docs/design/tokens/motion|motion]]"
  - "[[timelines|timelines]]"
  - "[[background|presets/background]]"
---

# BackgroundVideoAnimations

- `landing` — empty. The opaque `[data-video-grid]` (from `sizzle-background.njk`, covering the video and both gels from first paint) is the hidden state; nothing is set at construction.
- `intro` — at time 0 it snaps the `<video>` and `gel_video` to `autoAlpha: 1` (overriding GelAnimationManager's parking of the gel), then fades each grid cell's `autoAlpha` to 0 (`BACKGROUND_GRID_REVEAL`): columns go right to left, the cells of a column hide in a random order shuffled when the timeline is built, `cellStagger` apart, and a column starts once the column to its right has finished hiding `triggerAfterCells` cells. A cell's column comes from its DOM index and `columns`. It is the section's `intro` timeline, so its completion still drives `video:intro:complete`. If `[data-video-grid]` is absent, the intro is just the snap and still completes. The video and gel are never tweened. Built at construction, outside any `gsap.matchMedia` context.
- `idle` — the two-point perspective rest pose, from `BACKGROUND_PERSPECTIVE`, on the section root (`this.view`). It is never played: nothing animates into the pose. `snapPerspective()` finishes it, and its progress is the "settled" flag. `immediateRender: false`, so building it writes nothing. Its `onComplete` re-sets the pose at the current width, then calls `onPerspectiveSettled`, which is inert now that nothing holds `video:intro:complete`.
- `snapPerspective()` — applies the rest pose statically: finishes the idle timeline and re-sets the pose at the current width (construction, breakpoint entry, intro completion, resize).
- `clearPerspective()` — idle back to 0 and `clearProps` transform/origin (narrow tiers). Transform only; it never touches the video gel.
- `isPerspectiveSettled()` — idle progress is 1.
- `showVideoGel()` — snap `gel_video` (`options.videoGel`, resolved by BackgroundVideo) to `autoAlpha: 1`: the intro's first step, gated paths, breakpoint crossings and resizes. Idempotent; nothing here ever hides the gel again.
- `isVideoGelShown()` — the gel has been made visible (intro start or snapped).
- `hideGrid()` — snap the `[data-video-grid]` container hidden and the video and gel visible: gated paths and post-intro re-assertion. `isGridHidden()` — the intro finished or the grid was snapped hidden.
- `kill()` — via the base class.

The gel's reveal state lives here, not on the controller, because BackgroundVideo's gated path can run inside its `super()` call, before the controller's own fields exist.

`BackgroundVideo` decides when each runs; this module only builds them.

## Reduced motion

Reduced motion takes the gated path. The rest pose is static on every path (`snapPerspective()`), and on the gated path `hideGrid()` snaps the grid hidden and the video and gel visible, and the intro is jumped to its end. There is no replacement tween.
