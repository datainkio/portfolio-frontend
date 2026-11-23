---
description: "Composed pattern — the landing cover for the background video: a graph-paper sheet clipped away right to left and colour panes contracting toward the left edge, both left hidden."
status: stable
tags:
  - choreography
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[background|presets/background]]"
---

# pane-contract

Two factories, both returning unstarted GSAP timelines (empty when there is nothing to animate). `BackgroundVideoAnimations` composes them with the video fade; options come from `BACKGROUND_PANES`. Neither shows the sheet or panes: the caller stages them (`stagePanes()`, and a `set` at position 0 of the intro).

- `buildSheetWipe(sheet, { duration, ease })` — `fromTo` `clipPath` `inset(0% 0% 0% 0%)` → `inset(0% 100% 0% 0%)` with `immediateRender: false` (the right inset grows, so the sheet's right edge travels right to left), then a `set` to `autoAlpha: 0` with `clearProps: "clipPath"`. Clip-path rather than scaleX, which would squash the graph-paper pattern. Empty when `sheet` is null.
- `buildPaneContract(panes, { duration, ease, stagger, transformOrigin })` — each pane tweens `scaleX` 1 → 0 in DOM order, offset by `stagger`, then a final `set` puts all panes at `autoAlpha: 0` so nothing is left over the playing video. `scaleX` stays at 0.

Reduced motion adds no tween: the gated path jumps the intro timeline to its end, where the panes are hidden.
