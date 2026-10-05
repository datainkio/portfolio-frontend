---
description: "Hero `reduced` variant — low-vestibular fallback. Hides the hero gel outright and returns empty intro/outro timelines."
status: stable
tags:
  - hero-motion
  - hero
  - choreography
  - gel
  - reduced-motion
links:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
  - "[[molecules/hero-motion/sweep|molecules/hero-motion/sweep]]"
  - "[[config/ix/profiles|config/ix/profiles]]"
---

## Exports

| Export                         | Bound to             | Returns                  |
| ------------------------------ | -------------------- | ------------------------ |
| `init(view, gelManager)`       | variant `init`       | landing timeline (empty) |
| `buildIntro(view, gelManager)` | variant `buildIntro` | empty timeline           |
| `buildOutro(view, gelManager)` | variant `buildOutro` | empty timeline           |

Registered as `HERO_VARIANT_FACTORIES.reduced` in
[[molecules/hero-motion/hero-motion|hero-motion.js]].

## Behavior

`init` does the one thing that genuinely needs JS under reduced motion: it sets
`gel_hero` to `autoAlpha: 0` and calls `gel.refresh()`. The gel exists only as a
motion device — without the wipe there is nothing for it to express, and left
visible it would sit as an opaque sheet over the fixed background video. Hiding
it is the correct rest state, not merely the absence of animation.

`buildIntro` / `buildOutro` return bare timelines. No gel transform, no
ScrollTrigger, no header motion — the hero content renders at its CSS rest state.

This is the variant-swap half of the reduced-motion contract: the `reduced`
profile selects it, so [[molecules/hero-motion/sweep|sweep.js]] is never built and
needs no reduced branch of its own.

## Notes

- The landing timeline is tagged `TIMELINE_IDS.landing` so `AbstractSection` can
  still bind and complete the landing phase.
- `viewportHeight` and the `HERO_INTRO` import are unused leftovers from the
  variant template.
- Distinct from [[molecules/hero-motion/fade|fade.js]], which is empty by
  accident (commented out) rather than by design.
