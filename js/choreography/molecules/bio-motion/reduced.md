---
id: frontend.js.choreography.molecules.bio-motion.reduced
role: "Bio `reduced` variant — low-vestibular fallback. Hides the bio gel outright and returns empty intro/outro timelines."
status: stable
surface: internal
scope: frontend
runtime: browser
atomicLevel: "molecule"
tags:
  - bio-motion
  - biography
  - choreography
  - frontend
  - gel
  - js
  - reduced-motion
links:
  - "[[molecules/bio-motion/bio-motion|molecules/bio-motion/bio-motion]]"
  - "[[molecules/bio-motion/sweep|molecules/bio-motion/sweep]]"
  - "[[config/ix/profiles|config/ix/profiles]]"
backlinks:
  - "[[molecules/bio-motion/bio-motion|molecules/bio-motion/bio-motion]]"
---

## Exports

| Export | Bound to | Returns |
| --- | --- | --- |
| `init(view, gelManager)` | variant `init` | landing timeline (empty) |
| `buildIntro(view, gelManager)` | variant `buildIntro` | empty timeline |
| `buildOutro(view, gelManager)` | variant `buildOutro` | empty timeline |

Registered as `BIO_VARIANT_FACTORIES.reduced` in
[[molecules/bio-motion/bio-motion|bio-motion.js]].

## Behavior

`init` does the one thing that genuinely needs JS under reduced motion: it sets
`gel_bio` to `autoAlpha: 0` and calls `gel.refresh()`. The gel exists only as a
motion device — without the wipe there is nothing for it to express, and left
visible it would sit as an opaque sheet over the fixed background video. Hiding
it is the correct rest state, not merely the absence of animation.

`buildIntro` / `buildOutro` return bare timelines. No gel transform, no
ScrollTrigger, no header motion — the bio content renders at its CSS rest state.

This is the variant-swap half of the reduced-motion contract: the `reduced`
profile selects it, so [[molecules/bio-motion/sweep|sweep.js]] is never built and
needs no reduced branch of its own.

## Notes

- The landing timeline is tagged `TIMELINE_IDS.landing` so `AbstractSection` can
  still bind and complete the landing phase.
- `viewportHeight` and the `BIO_INTRO` import are unused leftovers from the
  variant template.
- Distinct from [[molecules/bio-motion/fade|fade.js]], which is empty by
  accident (commented out) rather than by design.
