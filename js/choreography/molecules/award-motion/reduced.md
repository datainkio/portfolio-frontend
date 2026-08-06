---
id: frontend.js.choreography.molecules.award-motion.reduced
role: "Awards `reduced` variant — low-vestibular fallback. Returns empty timelines for every lifecycle phase so the section renders at its CSS rest state with no gel motion."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - award-motion
  - awards
  - choreography
  - frontend
  - js
  - molecule
  - reduced-motion
links:
  - "[[molecules/award-motion/award-motion|molecules/award-motion/award-motion]]"
  - "[[molecules/award-motion/slide|molecules/award-motion/slide]]"
  - "[[config/ix/profiles|config/ix/profiles]]"
backlinks:
  - "[[molecules/award-motion/award-motion|molecules/award-motion/award-motion]]"
---

## Exports

| Export | Bound to | Returns |
| --- | --- | --- |
| `init(view, gelManager)` | variant `init` | empty timeline |
| `buildIntro(view, gelManager)` | variant `buildIntro` | empty timeline |
| `buildOutro(view, gelManager)` | variant `buildOutro` | empty timeline |

Registered as `AWARD_VARIANT_FACTORIES.reduced` in
[[molecules/award-motion/award-motion|award-motion.js]].

## Behavior

Every factory returns a bare `gsap.timeline()`. Nothing is animated, no gel is
touched, and no ScrollTrigger is created — the awards section is shown at its
authored CSS rest state.

This is the variant-swap half of the reduced-motion contract: the `reduced`
motion profile selects it, so [[molecules/award-motion/slide|slide.js]] is never
built and needs no reduced branch of its own.

## Empty `init`

`init` currently returns an empty timeline with its gel setup commented out. The
`slide` variant's `init` is what parks the gels offscreen and flips
`mixBlendMode`; because that never runs under `reduced`, the gels stay wherever
CSS leaves them. If a future change gives the gels a start state that is only
correct *after* JS setup, that reset belongs here — that is the documented
purpose of `init` in this variant shape ("style elements that won't work without
animation").

The unused `SplitText`, `TIMELINE_IDS`, and `AWARDS_INTRO` imports are inherited
from the variant template and carry no behavior.
