---
description: "Blockframes reveal for process-motion — the `blockframes-grid` element fills its wrapper 1:1 (12 columns x 3 rows, no gap; each cell naturally 1/12 the wrapper's width, flush against its neighbors), so no scale/offset transform is needed. A once-fire ScrollTrigger (start: \\\"center center\\\") fades in all 36 `data-blockframe-block` cells (filled at runtime by blockframes-grid.js) from autoAlpha 0 to 1 via a single timeline, staggered with GSAP's `grid: [12, 3]` stagger so the reveal sweeps the board in DOM/row-major order. No connector overlay, no zoom, no scrub/pin; reduced motion handled upstream by the `reduced` variant swap. Invoked from reveal.js `intro()`."
status: stable
tags:
  - process-motion
  - process
  - blockframes
  - choreography
  - scrolltrigger
  - svg
links:
  - "[[process-motion]]"
  - "[[blockframe-basic]]"
---

## Reduced motion

No reduced branch lives in this module. The profile system swaps Process to the `reduced` variant, which does not call `buildBlockframesReveal`. The `gsap.set` that hides the cells runs inside that function, so under reduced motion the cells keep their markup state and no reveal runs.
