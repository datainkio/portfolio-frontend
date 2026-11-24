---
description: "Hero `sweep` variant — header fade+lift only. Its gel wipe was retired on 2026-11-24. No profile selects it; it is only the fallback variant."
status: stable
tags:
  - hero-motion
  - hero
  - choreography
links:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
  - "[[molecules/hero-motion/split|molecules/hero-motion/split]]"
  - "[[config/ix/presets/hero|config/ix/presets/hero]]"
---

Gel retired on 2026-11-24: the hero's full-bleed gel was replaced by `gel_video`, which the background video section owns, so this variant no longer wipes a gel. No profile in `config/ix/profiles.js` selects `sweep`; it is reached only as the hero's fallback variant.

## Exports

| Export                 | Bound to             | Returns        |
| ---------------------- | -------------------- | -------------- |
| `createSweepIn(view)`  | variant `buildIntro` | intro timeline |
| `createSweepOut(view)` | variant `buildOutro` | outro timeline |

Registered as `HERO_VARIANT_FACTORIES.sweep` in
[[molecules/hero-motion/hero-motion|hero-motion.js]]. No `init`.

## Intro

`from { autoAlpha: 0, y: 40 }` on the hero header, labelled `middle`.

## Outro

`createSweepOut` fades the header to `opacity: 0`. Labelled `outro`.

## Pacing

`HERO_INTRO.duration` and `HERO_INTRO.ease.out` from
[[config/ix/presets/hero|config/ix/presets/hero.js]].

## Reduced motion

Not handled here — the `reduced` profile swaps to
[[molecules/hero-motion/reduced|reduced.js]], so this file is never built.
