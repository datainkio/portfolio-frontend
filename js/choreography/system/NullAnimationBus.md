---
description: "Runtime infrastructure — null object implementation of AnimationBus that silently discards all events and listeners for sections without a real bus."
status: stable
tags:
  - choreography
  - system
---

# NullAnimationBus

A bus that does nothing: `emit` and `off` are empty, and `on` returns an
empty unsubscribe function. [[AbstractSection]] falls back to it when no bus
is passed, so a section on a page without the Director, or in a test, runs
without a single `if (this.bus)` check.

It implements `on`, `emit` and `off` only. `getListenerCount` and
`clearListeners` from [[AnimationBus]] are debugging tools and aren't part of
the shared interface.
