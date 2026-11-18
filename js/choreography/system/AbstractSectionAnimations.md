---
description: "Runtime infrastructure — shared foundation for section animation modules, providing a four-phase timeline registry (landing, intro, idle, outro) with lifecycle helpers."
status: stable
tags:
  - choreography
  - system
links:
  - "[[timelines|timelines]]"
  - "[[system/gsap|system/gsap]]"
---

# AbstractSectionAnimations

Holds a section's timelines, one per phase in `TIMELINE_IDS`
([[timelines]]): landing, intro, idle, outro. A subclass overrides
`_buildLanding`, `_buildIntro`, `_buildIdle` or `_buildOutro` to return a
GSAP timeline, then calls `_buildTimeline()` to build and register all four.

A phase the subclass doesn't override gets an empty timeline with the right
id. Playing it completes immediately, so a section with no landing beat
needs no special case.

| Method            | Does                                               |
| ----------------- | -------------------------------------------------- |
| `play(id)`        | Pauses the other timelines and restarts this one.  |
| `getTimeline(id)` | Returns the timeline, or `null`.                   |
| `pauseAll(at)`    | Pauses every timeline at `at` seconds (default 0). |
| `kill()`          | Kills and clears every timeline.                   |

Every registered timeline is paused at 0; nothing plays until
[[AbstractSection]] asks. `_showAllItems` and `_revealItemsOnScroll` are
deprecated in favour of [[scroll-reveal-group]].
