---
description: "Preloader selectors, the exit-state attribute pair, the choreography flag name, and the three timing bounds (fonts, director, hanko settle) with the reasoning for each."
type: script
tags:
  - preloader
links:
  - "[[Preloader|preloader/Preloader]]"
  - "[[hanko|hanko.css]]"
---

`PRELOADER_TIMINGS.settleFallbackMs` is coupled to `--hanko-settle-duration`
in `styles/components/hanko.css` — it must exceed it. Change them together.
