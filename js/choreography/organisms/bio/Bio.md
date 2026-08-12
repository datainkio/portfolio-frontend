---
id: frontend.js.choreography.organisms.bio.bio
role: "Bio section controller — manages lifecycle and bus coordination for the biography/introduction section."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - js
  - organism
links:
  - "[[AbstractSection|AbstractSection]]"
  - "[[config/index|config/index]]"
  - "[[BioAnimations|BioAnimations]]"
  - "[[BioTriggers|BioTriggers]]"
---

# Bio

Standard `AbstractSection` controller, with two deliberate departures from the base.

## Scroll does not drive playback

`_onEnter` / `_onEnterBack` are overridden to emit their events (cross-section
side effects depend on them) but **not** call `playIntro`. Bio's reveal is
time-based — it fires once off the landing chain (see
[LandingSequence](../../templates/landing/LandingSequence.md)) — so the base
class's scroll-driven replay would restart the animation mid-scroll.

## Resize settles played phases

Because the reveal fires once and never again, a resize that strips or re-parks
its inline styles would leave the section stuck. Two paths guard that:

- A plain `window.resize` listener → `_settleRevealToEnd()`. `matchMedia` only
  fires on breakpoint *crossings*, so an ordinary resize needs its own listener.
- `_applyResponsiveLifecycle` rebuilds the timelines (a crossing makes matchMedia
  revert and kill the prior context's tweens) and then settles again.

`_settleRevealToEnd` jumps **both** the landing and intro timelines to
`progress(1)`, each gated on its own request flag (`_landingRequested` /
`_introRequested`) since `LandingSequence` awaits `playLanding()` before calling
`playIntro()` — a resize in that gap must settle landing without asserting an
intro nobody has asked for yet.

Settling landing is load-bearing: the rebuild re-parks the heading gel at its
entrance start frame (offscreen), and nothing replays it. Events are **not**
suppressed, so the entrance's `onComplete` still fires and hands the band back to
its sync — see [heading-gel](../../molecules/bio-motion/heading-gel.md).
