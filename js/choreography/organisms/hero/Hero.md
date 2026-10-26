---
description: "Hero section controller — manages lifecycle and bus coordination for the hero/introduction section."
status: stable
tags:
  - choreography
links:
  - "[[AbstractSection|AbstractSection]]"
  - "[[config/index|config/index]]"
  - "[[HeroAnimations|HeroAnimations]]"
  - "[[HeroTriggers|HeroTriggers]]"
---

# Hero

Standard `AbstractSection` controller, with two deliberate departures from the base.

## Scroll does not drive playback

`_onEnter` / `_onEnterBack` are overridden to emit their events (cross-section
side effects depend on them) but **not** call `playIntro`. Hero's reveal is
time-based — it fires once off the landing chain (see
[LandingSequence](../../templates/landing/LandingSequence.md)) — so the base
class's scroll-driven replay would restart the animation mid-scroll.

## Resize settles played phases

Because the reveal fires once and never again, a resize that strips or re-parks
its inline styles would leave the section stuck. Two paths guard that:

- A plain `window.resize` listener → `_settleRevealToEnd()`. `matchMedia` only
  fires on breakpoint _crossings_, so an ordinary resize needs its own listener.
- `_applyResponsiveLifecycle` rebuilds the timelines (a crossing makes matchMedia
  revert and kill the prior context's tweens) and then settles again.

`_settleRevealToEnd` jumps **both** the landing and intro timelines to
`progress(1)`, each gated on its own request flag (`_landingRequested` /
`_introRequested`) so a resize between the two requests settles landing without
asserting an intro nobody has asked for yet.

Today the landing flag stays unset: `LandingSequence` no longer calls
`playLanding()`, and the landing timeline is empty — the heading gel is parked at
rest when the timelines build (see
[heading-gel](../../molecules/hero-motion/heading-gel.md)). Only the intro needs
settling.
