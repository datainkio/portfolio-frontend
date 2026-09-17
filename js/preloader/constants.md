---
description: "Preloader selectors, the exit-state attribute, the choreography flag name, and the five timing bounds (fonts, director, video playing, intro, outro) with the reasoning for each."
type: script
tags:
  - preloader
links:
  - "[[Preloader|preloader/Preloader]]"
  - "[[hanko|hanko.css]]"
---

`PRELOADER_TIMINGS.introFallbackMs` and `outroFallbackMs` are coupled to
`--preloader-step-duration` and `--preloader-step-stagger` in
`styles/components/hanko.css` — each must exceed step + 2 × stagger. Change
them together.
