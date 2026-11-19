---
description: "Runtime infrastructure — publish-subscribe event bus enabling loose coupling between section animation lifecycle events."
status: stable
tags:
  - choreography
  - system
---

# AnimationBus

The publish/subscribe bus every section and manager talks through. Sections
emit what they're doing; `LandingSequence` and the managers listen and cue
the next step. No section holds a reference to another.

`AnimationDirector` creates one bus and injects it. There is no static API
and no global bus. A section constructed without one gets a
[[NullAnimationBus]], so calling code never checks for a bus.

## API

| Method                    | Does                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `on(event, callback)`     | Subscribes. Returns a function that unsubscribes.              |
| `emit(event, data = {})`  | Calls every listener for `event` with `data`.                  |
| `off(event, callback)`    | Removes one listener. Usually called through `on`'s return.    |
| `getListenerCount(event)` | Listener count, for finding leaks.                             |
| `clearListeners(event?)`  | Drops the listeners for one event, or for all when none given. |

Event names come from `EVENTS` in [[events]], never from a typed string.

## Behaviour worth knowing

- `emit` iterates a copy of the listener list, so a handler that unsubscribes
  during dispatch doesn't make the next listener get skipped.
- A listener that throws is logged and the rest still run. One bad handler
  can't stall the landing chain.
- Listeners are held strongly. Whoever calls `on` must unsubscribe in its
  own `kill()` or `destroy()`.

## The three ways it's used

- **Section to sequence.** A section emits `hero:intro:complete`;
  [[LandingSequence]] hears it and starts the next beat.
- **Sequence to section.** `LandingSequence` calls a section's `playIntro()`
  directly, and the section emits its start and complete events as it runs.
- **Broadcast.** A manager such as [[BadgeManager]] or
  [[ScrollEffectsCoordinator]] listens to section events and reacts, without
  the section knowing it exists.
