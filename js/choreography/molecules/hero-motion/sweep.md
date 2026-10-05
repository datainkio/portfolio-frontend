---
description: "Hero `sweep` variant — gel wipe scoped to the hero section's own rect, growing from the bottom, with the header fading in over its last 20%."
status: stable
tags:
  - hero-motion
  - hero
  - choreography
  - gel
links:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
  - "[[molecules/hero-motion/split|molecules/hero-motion/split]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|managers/GelAnimationManager/GelAnimationManager]]"
  - "[[config/ix/presets/hero|config/ix/presets/hero]]"
---

## Exports

| Export                             | Bound to             | Returns        |
| ---------------------------------- | -------------------- | -------------- |
| `createSweepIn(view, gelManager)`  | variant `buildIntro` | intro timeline |
| `createSweepOut(view, gelManager)` | variant `buildOutro` | outro timeline |

Registered as `HERO_VARIANT_FACTORIES.sweep` in
[[molecules/hero-motion/hero-motion|hero-motion.js]]. No `init` — the start state is
deferred to playback (see below).

## The viewport-percentage problem

`gel_hero` is `absolute inset-0` inside the **fixed** `inset-0`
`#sizzle-background` container, so its `left/top/width/height` percentages
resolve against the **viewport**, not the hero section. (This is also why no gel
is ever ScrollTrigger-pinned.)

`heroRectAsViewportPercent(view)` converts the hero section's
`getBoundingClientRect()` into those same viewport percentages. Without it the
sweep would be a full-viewport wipe that blankets the fixed background video
sitting behind the section.

## Intro sequence

1. **`tl.call(...)`** — a _leading callback_, not build-time work. It applies the
   converted geometry and calls `gel.refresh()` at the moment the intro plays, so
   it reads hero's current rect and rebuilds the mask polygon while the gel is at
   `scaleY: 1`. `GelGeometry` measures the transformed box, so refreshing
   mid-scale would produce a wrong polygon.
2. **Gel grow** — `scaleY` 0 → 1 from `transformOrigin: "bottom center"`.
   - `startAt: { scaleY: 0 }` + `immediateRender: false` defers the start state
     to playback so it cannot stomp the hero arrangement while Hero is offscreen.
   - `overwrite: "auto"` kills any competing arrangement tween.
3. **Header** — `from { autoAlpha: 0, y: 40 }`, placed at
   `>-=${HERO_INTRO.duration * 0.2}` so the text reveal overlaps the last 20% of
   the wipe. Falls back to position `0` when no gel is present.

Labels: `intro` (gel), `middle` (header).

## Outro

`createSweepOut` fades the header to `opacity: 0` and collapses the gel to
`scaleY: 0`. Labelled `outro`.

## Pacing

`HERO_INTRO.duration` and `HERO_INTRO.ease.out` from
[[config/ix/presets/hero|config/ix/presets/hero.js]].

## Reduced motion

Not handled here — the `reduced` profile swaps to
[[molecules/hero-motion/reduced|reduced.js]], so this file is never built.
