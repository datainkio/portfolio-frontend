---
description: "Preloader selectors, the exit-state attribute, the choreography flag name, and the five timing bounds (fonts, director, video playing, intro, outro) with the reasoning for each, and their coupling to the CSS failsafe delay in hanko.css."
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

The CSS failsafe's `--preloader-failsafe-delay` (20s, in the same file) must
exceed the JS flow's worst case: fonts + director + video + outro, which run in
series, total 15s; the intro fallback runs alongside them. Raise any of those
bounds and raise the delay with it, or the failsafe could hide the splash
during a normal slow load. Both files carry the cross-reference.
