---
description: "Runtime infrastructure — manages a queue of pending Promise resolvers for animation lifecycle gates, resolving on timeline onComplete or immediate null return."
status: stable
tags:
  - choreography
  - system
---

# PromiseResolverQueue

Turns "this timeline finished" into a promise. [[AbstractSection]] keeps one
queue per phase (landing, intro, outro), which is what lets
[[LandingSequence]] write `await section.playIntro()`.

- `run(fn)` calls `fn` (which starts a timeline) and returns a promise that
  stays pending.
- `flush()` resolves every pending promise. The section calls it from the
  timeline's `onComplete`.

If `fn` returns `null` or `undefined`, no animation started, and the promise
resolves at once. That's the case for a section with no timeline for the
phase, so a missing animation never blocks the chain. Calling `run` twice
before a flush leaves two promises pending, and one flush resolves both.
