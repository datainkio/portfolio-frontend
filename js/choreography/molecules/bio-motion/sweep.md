---
description: "Bio `sweep` variant — gel wipe scoped to the bio section's own rect, growing from the bottom, with the header fading in over its last 20%."
status: stable
tags:
  - bio-motion
  - biography
  - choreography
  - gel
links:
  - "[[molecules/bio-motion/bio-motion|molecules/bio-motion/bio-motion]]"
  - "[[molecules/bio-motion/split|molecules/bio-motion/split]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|managers/GelAnimationManager/GelAnimationManager]]"
  - "[[config/ix/motion|config/ix/motion]]"
---

## Exports

| Export                             | Bound to             | Returns        |
| ---------------------------------- | -------------------- | -------------- |
| `createSweepIn(view, gelManager)`  | variant `buildIntro` | intro timeline |
| `createSweepOut(view, gelManager)` | variant `buildOutro` | outro timeline |

Registered as `BIO_VARIANT_FACTORIES.sweep` in
[[molecules/bio-motion/bio-motion|bio-motion.js]]. No `init` — the start state is
deferred to playback (see below).

## The viewport-percentage problem

`gel_bio` is `absolute inset-0` inside the **fixed** `inset-0`
`#sizzle-background` container, so its `left/top/width/height` percentages
resolve against the **viewport**, not the bio section. (This is also why no gel
is ever ScrollTrigger-pinned.)

`bioRectAsViewportPercent(view)` converts the bio section's
`getBoundingClientRect()` into those same viewport percentages. Without it the
sweep would be a full-viewport wipe that blankets the fixed background video
sitting behind the section.

## Intro sequence

1. **`tl.call(...)`** — a _leading callback_, not build-time work. It applies the
   converted geometry and calls `gel.refresh()` at the moment the intro plays, so
   it reads bio's current rect and rebuilds the mask polygon while the gel is at
   `scaleY: 1`. `GelGeometry` measures the transformed box, so refreshing
   mid-scale would produce a wrong polygon.
2. **Gel grow** — `scaleY` 0 → 1 from `transformOrigin: "bottom center"`.
   - `startAt: { scaleY: 0 }` + `immediateRender: false` defers the start state
     to playback so it cannot stomp the hero arrangement while Bio is offscreen.
   - `overwrite: "auto"` kills any competing arrangement tween.
3. **Header** — `from { autoAlpha: 0, y: 40 }`, placed at
   `>-=${BIO_INTRO.duration * 0.2}` so the text reveal overlaps the last 20% of
   the wipe. Falls back to position `0` when no gel is present.

Labels: `intro` (gel), `middle` (header).

## Outro

`createSweepOut` fades the header to `opacity: 0` and collapses the gel to
`scaleY: 0`. Labelled `outro`.

## Pacing

`BIO_INTRO.duration` and `BIO_INTRO.ease.out` from
[[config/ix/motion|config/ix/motion.js]].

## Reduced motion

Not handled here — the `reduced` profile swaps to
[[molecules/bio-motion/reduced|reduced.js]], so this file is never built.
