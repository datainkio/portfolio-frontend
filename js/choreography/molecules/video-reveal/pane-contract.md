---
description: "Composed pattern — the landing panes for the background video: a veil that fades them in and a contraction toward the left edge that leaves them hidden."
status: stable
tags:
  - choreography
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[background|presets/background]]"
---

# pane-contract

Two factories, both returning unstarted GSAP timelines (empty when `panes` is empty). `BackgroundVideoAnimations` composes them around the video fade; options come from `BACKGROUND_PANES`.

- `buildPaneVeil(panes, { duration, ease, transformOrigin })` — `fromTo` `autoAlpha` 0 → 1 on all panes together, with `scaleX: 1` and the transform origin applied at the start.
- `buildPaneContract(panes, { duration, ease, stagger, transformOrigin })` — each pane tweens `scaleX` 1 → 0 in DOM order, offset by `stagger`, then a final `set` puts all panes at `autoAlpha: 0` so nothing is left over the playing video. `scaleX` stays at 0.

Reduced motion adds no tween: the gated path jumps the intro timeline to its end, where the panes are hidden.
