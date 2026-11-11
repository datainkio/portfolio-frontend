---
description: "Background video animations module — builds the hidden landing and fade-in intro timelines for the <video>, and the idle timeline that tilts the section root into two-point perspective after the reveal."
status: stable
tags:
  - choreography
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[video-reveal|video-reveal]]"
  - "[[system/gsap|system/gsap]]"
  - "[[motion|motion]]"
  - "[[timelines|timelines]]"
  - "[[background|presets/background]]"
---

# BackgroundVideoAnimations

- `landing` / `intro` — the reveal, via [[video-reveal|video-reveal]]. Targets the `<video>` (`this.media`) only.
- `idle` — the two-point perspective tilt, from `BACKGROUND_PERSPECTIVE`. Targets the section root (`this.view`), so the video, pixelator and gels tilt as one piece. Perspective is `perspectiveRatio × window.innerWidth`, read when the tween first renders. `immediateRender: false`, so nothing is written at construction.
- `snapPerspective()` — finishes the idle timeline and re-sets the rest pose at the current width (reduced motion, gated replay, breakpoint entry, resize).
- `clearPerspective()` — idle back to 0 and `clearProps` transform/origin (narrow tiers).
- `isPerspectiveSettled()` — idle progress is 1.

`BackgroundVideo` decides when each runs; this module only builds them.
