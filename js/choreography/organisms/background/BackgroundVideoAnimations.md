---
description: Background video animations module — builds the hidden landing and fade-in intro timelines for the <video>, the idle timeline that tilts the section root into two-point perspective after the reveal, and the gel_hero fade-in / snap that accompanies it.
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[video-reveal|video-reveal]]"
  - "[[system/gsap|system/gsap]]"
  - "[[dataink.io/frontend/ia/docs/design/tokens/motion|motion]]"
  - "[[timelines|timelines]]"
  - "[[background|presets/background]]"
---

# BackgroundVideoAnimations

- `landing` / `intro` — the reveal, via [[video-reveal|video-reveal]]. Targets the `<video>` (`this.media`) only.
- `idle` — the two-point perspective tilt, from `BACKGROUND_PERSPECTIVE`. Targets the section root (`this.view`), so the video, pixelator and gels tilt as one piece. Rotation only: scale is already at its overscale from `primePerspective()`. Perspective is `perspectiveRatio × window.innerWidth`, read when the tween first renders. `immediateRender: false`, so nothing is written at construction. Its `onComplete` re-sets the pose at the current width, then calls `onPerspectiveSettled` (set by BackgroundVideo to release `video:intro:complete`).
- `primePerspective()` — overscale about the right edge, unturned. Applied on `lg`+ before the video is visible.
- `snapPerspective()` — finishes the idle timeline and re-sets the rest pose at the current width (gated replay, breakpoint entry, resize).
- `clearPerspective()` — idle back to 0 and `clearProps` transform/origin (narrow tiers). Transform only; it never touches the heading gel.
- `isPerspectiveSettled()` — idle progress is 1.
- `fadeInHeadingGel()` — the played-path reveal of `gel_hero` (`options.headingGel`, resolved by BackgroundVideo): a standalone `autoAlpha` 0 → 1 tween with `BACKGROUND_HEADING_GEL_REVEAL` (the tilt's duration and ease). Standalone rather than inside idle, so it also runs on flat tiers and survives `clearPerspective()`. No-op once shown.
- `showHeadingGel()` — snap to `autoAlpha: 1`, finishing a fade in flight. Idempotent.
- `isHeadingGelShown()` / `isHeadingGelFading()` — the reveal has started or landed / the fade is still running.
- `kill()` — also kills the gel fade.

The gel's reveal state lives here, not on the controller, because BackgroundVideo's gated path can run inside its `super()` call, before the controller's own fields exist.

`BackgroundVideo` decides when each runs; this module only builds them.

## Reduced motion

Reduced motion takes the gated path. `BackgroundVideo` calls `snapPerspective()` to set the rest pose at once instead of playing the idle tilt, and `showHeadingGel()` snaps `gel_hero` visible rather than fading it in.
