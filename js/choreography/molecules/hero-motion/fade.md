---
description: "Hero `fade` variant — the no-gel fallback shape (header fade + lift). Currently fully commented out: all three factories are inert."
status: draft
tags:
  - hero-motion
  - hero
  - choreography
links:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
  - "[[molecules/hero-motion/sweep|molecules/hero-motion/sweep]]"
  - "[[config/ix/presets/hero|config/ix/presets/hero]]"
---

## Exports

| Export                | Bound to             | Returns              |
| --------------------- | -------------------- | -------------------- |
| `initFade(view)`      | variant `init`       | —                    |
| `createFadeIn(view)`  | variant `buildIntro` | empty intro timeline |
| `createFadeOut(view)` | variant `buildOutro` | empty outro timeline |

Registered as `HERO_VARIANT_FACTORIES.fade` in
[[molecules/hero-motion/hero-motion|hero-motion.js]].

## Intent

The gel-free hero variant: a simple `header` fade-and-lift for contexts where
`gelManager` is unavailable or a gel wipe is too heavy. Unlike
[[molecules/hero-motion/sweep|sweep]] it has no `GelAnimationManager` dependency.

## Current state: inert

Every body is commented out. The timelines are still built and correctly tagged
with `TIMELINE_IDS.intro` / `TIMELINE_IDS.outro`, so `AbstractSection` can bind
lifecycle callbacks and the phase still completes — it just plays nothing.

The commented-out shape is the intended one:

- `initFade` — `gsap.set(view, { autoAlpha: 0 })`
- `createFadeIn` — `from` the header `{ autoAlpha: 0, y: 40 }` paced by
  `HERO_INTRO.duration` / `HERO_INTRO.ease.out`, then `addPause()`
- `createFadeOut` — header `to { autoAlpha: 0 }`

Selecting `fade` via `SECTION_OVERRIDES.hero` today yields a hero section that
never reveals. Uncomment before using it as a live variant. Distinct from
[[molecules/hero-motion/reduced|reduced]], which is _intentionally_ empty.
