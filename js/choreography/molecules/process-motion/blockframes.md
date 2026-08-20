---
id: frontend.js.choreography.molecules.process-motion.blockframes
role: "Blockframes reveal for process-motion — the `blockframes-grid` element fills its wrapper 1:1 (12 columns x 3 rows, no gap; each cell naturally 1/12 the wrapper's width, flush against its neighbors), so no scale/offset transform is needed. A once-fire ScrollTrigger (start: \"center center\") fades in all 36 `data-blockframe-block` cells (filled at runtime by blockframes-grid.js) from autoAlpha 0 to 1 via a single timeline, staggered with GSAP's `grid: [12, 3]` stagger so the reveal sweeps the board in DOM/row-major order. No connector overlay, no zoom, no scrub/pin; reduced motion handled upstream by the `reduced` variant swap. Invoked from reveal.js `intro()`."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - process-motion
  - process
  - blockframes
  - choreography
  - frontend
  - js
  - scrolltrigger
  - svg
links:
  - "[[process-motion]]"
  - "[[blockframe-basic]]"
backlinks:
  - "[[process-motion]]"
  - "[[reveal]]"
---
