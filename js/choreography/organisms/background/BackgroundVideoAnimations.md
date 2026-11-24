---
description: Background video animations module — builds the hidden landing and fade-in intro timelines for the <video>, the idle timeline whose progress marks the static two-point perspective rest pose of the section root, and the gel_video fade-in (first step of the intro) and snap.
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

- `landing` / `intro` — the reveal, via [[video-reveal|video-reveal]]. `landing` and the video fade target the `<video>` (`this.media`) only. `intro` is `gel_video` fading 0 → 1 (`BACKGROUND_VIDEO_GEL_REVEAL`, a `fromTo`, so the hidden start is explicit) as its first child, then the video fade, strictly sequential (the video tween is shifted by the gel's duration). The gel is hidden before the intro, so the video appears already darkened.
- `idle` — the two-point perspective rest pose, from `BACKGROUND_PERSPECTIVE`, on the section root (`this.view`). It is never played: nothing animates into the pose. `snapPerspective()` finishes it, and its progress is the "settled" flag. `immediateRender: false`, so building it writes nothing. Its `onComplete` re-sets the pose at the current width, then calls `onPerspectiveSettled`, which is inert now that nothing holds `video:intro:complete`.
- `snapPerspective()` — applies the rest pose statically: finishes the idle timeline and re-sets the pose at the current width (construction, breakpoint entry, intro completion, resize).
- `clearPerspective()` — idle back to 0 and `clearProps` transform/origin (narrow tiers). Transform only; it never touches the video gel.
- `isPerspectiveSettled()` — idle progress is 1.
- `showVideoGel()` — snap `gel_video` (`options.videoGel`, resolved by BackgroundVideo) to `autoAlpha: 1`: gated paths, and breakpoint crossings and resizes after the reveal. Idempotent; nothing here ever hides the gel again.
- `isVideoGelShown()` — the intro's gel fade has landed, or the gel was snapped.
- `kill()` — via the base class.

The gel's reveal state lives here, not on the controller, because BackgroundVideo's gated path can run inside its `super()` call, before the controller's own fields exist.

`BackgroundVideo` decides when each runs; this module only builds them.

## Reduced motion

Reduced motion takes the gated path. The rest pose is static on every path (`snapPerspective()`), and on the gated path `showVideoGel()` snaps `gel_video` visible and the intro is jumped to its end, so the video shows too.
