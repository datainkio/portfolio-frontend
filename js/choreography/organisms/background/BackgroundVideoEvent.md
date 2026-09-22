---
description: Frozen snapshot payload carried by every video:media:* event — video element playstate, section lifecycle phase, and document readiness, built at emit time.
status: stable
tags:
  - choreography
links:
  - "[[BackgroundVideo|BackgroundVideo]]"
  - "[[events|config/contracts/events]]"
  - "[[timelines|config/contracts/timelines]]"
  - "[[Preloader|preloader/Preloader]]"
---

# BackgroundVideoEvent

`buildBackgroundVideoEvent(section)` returns the payload every `video:media:*`
event carries, on the bus and on `window` alike.

## Shape

| Group | Fields |
| --- | --- |
| *(root)* | `element` — the section root, matching every other `_emit` in the system |
| `video` | `hasSrc`, `isPlaying`, `paused`, `readyState`, `networkState`, `currentTime`, `duration`, `bufferedEnd`, `error` |
| `lifecycle` | `phase`, `breakpoint`, `isInView`, `isReducedMotion`, `motionEnabled`, `documentReadyState`, `visibilityState`, `timestamp` |

## Why frozen, and why a snapshot

These events cross out of the choreography module graph onto `window`, where
the preloader reads them. A live `<video>` reference there would rebuild the
coupling the events exist to remove — a consumer could call `play()`, reassign
`src`, or read a value that moved on after the event fired. `element` is the
one live reference, and only for back-compat.

`duration` is normalized to `0` while it is `NaN` (before metadata), and
`isPlaying` requires `readyState >= 3` so it means *moving*, not merely
*intending to*.

## phase

Derived from timeline progress (`outro` → `idle` → `intro` → `landing` →
`pending`), read in that order so the latest phase to have started wins.

It is derived rather than stored because `AbstractSection` tracks phase
implicitly through `PromiseResolverQueue`, which exposes no settled state.
Adding a phase field to the base class to serve one section's events would put
the cost in the wrong place.
