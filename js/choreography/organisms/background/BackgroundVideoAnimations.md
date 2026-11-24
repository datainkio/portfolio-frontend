---
description: Background video animations module — builds the empty landing and the grid-reveal intro timelines (the landing clips the grid element to nothing, the intro pops cells into the clip-path), the idle timeline whose progress marks the static two-point perspective rest pose of the section root, and the gel_video and clip-removal snaps.
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

- `landing` — empty timeline; at construction it applies the empty `clip-path` (nothing drawn) to `[data-video-grid]`, outside any `gsap.matchMedia` context. Gated paths remove it (`revealAll()`).
- `intro` — at time 0 it snaps the `<video>` and `gel_video` to `autoAlpha: 1` (overriding GelAnimationManager's parking of the gel), then pops grid cells into the clip-path (`BACKGROUND_GRID_REVEAL`): columns go right to left, the cells of a column pop in a random order shuffled when the timeline is built, `cellStagger` apart, and a column starts `triggerAfterCells x cellStagger` after the one to its right. The timeline's `onUpdate` derives the revealed set from its current time and rewrites one `polygon(...)` (per-row runs merged into rectangles, each a loop from the origin joined by a zero-width bridge, nonzero fill), so jumps are as correct as plays: time 0 is fully clipped, the end removes the clip (`clearProps`) and sets the revealed flag. It is the section's `intro` timeline, so its completion still drives `video:intro:complete`. If `[data-video-grid]` is absent, the intro is just the snap and still completes. The video and gel are never tweened. Caveat: GSAP suppresses callbacks on `pause(0)`, so use `progress(0)` to jump back. Built at construction, outside any `gsap.matchMedia` context.
- `idle` — the two-point perspective rest pose, from `BACKGROUND_PERSPECTIVE`, on the section root (`this.view`). It is never played: nothing animates into the pose. `snapPerspective()` finishes it, and its progress is the "settled" flag. `immediateRender: false`, so building it writes nothing. Its `onComplete` re-sets the pose at the current width, then calls `onPerspectiveSettled`, which is inert now that nothing holds `video:intro:complete`.
- `snapPerspective()` — applies the rest pose statically: finishes the idle timeline and re-sets the pose at the current width (construction, breakpoint entry, intro completion, resize).
- `clearPerspective()` — idle back to 0 and `clearProps` transform/origin (narrow tiers). Transform only; it never touches the video gel.
- `isPerspectiveSettled()` — idle progress is 1.
- `showVideoGel()` — snap `gel_video` (`options.videoGel`, resolved by BackgroundVideo) to `autoAlpha: 1`: the intro's first step, gated paths, breakpoint crossings and resizes. Idempotent; nothing here ever hides the gel again.
- `isVideoGelShown()` — the gel has been made visible (intro start or snapped).
- `revealAll()` — remove the clip at once and snap the video and gel visible: gated paths and post-intro re-assertion. `isRevealed()` — the intro finished or `revealAll()` ran. (Renamed from `hideGrid()` / `isGridHidden()` on 2026-11-24.)
- `kill()` — via the base class.

The gel's reveal state lives here, not on the controller, because BackgroundVideo's gated path can run inside its `super()` call, before the controller's own fields exist.

`BackgroundVideo` decides when each runs; this module only builds them.

## Reduced motion

Reduced motion takes the gated path. The rest pose is static on every path (`snapPerspective()`), and on the gated path `revealAll()` removes the clip and the video and gel visible, and the intro is jumped to its end. There is no replacement tween.
