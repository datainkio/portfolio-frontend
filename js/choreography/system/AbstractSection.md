---
description: "Runtime infrastructure — foundation class providing lifecycle management, responsive breakpoint handling, bus event emission, and animation playback gates (reduced-motion and session-played, both scrub-exempt) for all section controllers."
status: stable
tags:
  - choreography
  - system
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
  - "[[NullAnimationBus|NullAnimationBus]]"
  - "[[events|events]]"
  - "[[timelines|timelines]]"
  - "[[config/index|config/index]]"
  - "[[PromiseResolverQueue|PromiseResolverQueue]]"
  - "[[system/gsap|system/gsap]]"
  - "[[managers/SessionManager/SessionManager|managers/SessionManager]]"
---

# AbstractSection

The base class every section controller extends. It gives a section a
standard lifecycle, wires that lifecycle to the bus, and decides per
breakpoint whether motion runs at all. A subclass supplies an animations
module and, optionally, a triggers module; most subclasses add very little.

## What a section is made of

| Part       | Class                         | Owns                                   |
| ---------- | ----------------------------- | -------------------------------------- |
| Controller | `AbstractSection` subclass    | Lifecycle, events, the motion profile  |
| Animations | [[AbstractSectionAnimations]] | One GSAP timeline per phase            |
| Triggers   | [[AbstractSectionTriggers]]   | The section's viewport `ScrollTrigger` |

The constructor takes `{ view, animations, triggers, sectionKey, bus,
reducedMotionHandler, initialInView }`. When `view` is missing the section
sets `isDisabled` and every method no-ops, so a page without that section
never throws. When `bus` is missing it uses a [[NullAnimationBus]].

## Lifecycle

| Method          | Plays                | Emits                               |
| --------------- | -------------------- | ----------------------------------- |
| `playLanding()` | the landing timeline | `landing:start`, `landing:complete` |
| `playIntro()`   | the intro timeline   | `intro:start`, `intro:complete`     |
| `playOutro()`   | the outro timeline   | `outro:start`, `outro:complete`     |
| `reset()`       | pauses all at 0      | `section:<key>:reset`               |
| `destroy()`     | kills everything     | `section:<key>:destroy`             |

Each `play*` method returns a promise that resolves when its timeline
completes (see [[PromiseResolverQueue]]). The viewport trigger's callbacks
emit `enter`, `exit`, `onEnterBack` and `onLeaveBack`. Event names are the
section's entry in `EVENTS` ([[events]]); a section key with no entry emits
nothing, because `_emit` drops an undefined name.

`playIntro()` returns at once when the triggers module reports
`isScrubbed()`: a scrubbed `ScrollTrigger` owns that timeline's playhead, and
restarting it would fight the scrub.

## Responsive lifecycle

Motion isn't decided in the constructor. `_setupResponsiveLifecycle()`
registers `BREAKPOINT_MATCH_MEDIA_CONDITIONS` with `gsap.matchMedia()`, and
every breakpoint crossing calls `_applyResponsiveLifecycle(conditions)`,
which:

1. Resolves the section's motion profile for the breakpoint with
   `resolveSectionMotionProfile` ([[profiles]]).
2. Turns the timeline channel off if the section has already played this
   session ([[SessionManager]]), unless it's scrubbed.
3. Rebinds the timeline callbacks, and binds the viewport trigger only when
   the profile's trigger channel is on.
4. If motion has just turned off, jumps the intro to its end and emits
   `intro:complete`.

## Reduced motion

Reduced motion is one of the `matchMedia` conditions, and it resolves the
`reduced` profile at every breakpoint: timelines and triggers both off. While
the timeline channel is off, `playLanding()` and `playIntro()` set their
timeline to its end state, emit the matching `complete` event and resolve
immediately, and `playOutro()` resolves without doing anything. The section
shows in its final state, and anything waiting on its events still proceeds.

If `gsap.matchMedia` is unavailable, the lifecycle is applied once from
[[ReducedMotionHandler]]'s answer.
