---
description: "Bio `fade` variant — the no-gel fallback shape (header fade + lift). Currently fully commented out: all three factories are inert."
status: draft
tags:
  - bio-motion
  - biography
  - choreography
links:
  - "[[molecules/bio-motion/bio-motion|molecules/bio-motion/bio-motion]]"
  - "[[molecules/bio-motion/sweep|molecules/bio-motion/sweep]]"
  - "[[config/ix/motion|config/ix/motion]]"
---

## Exports

| Export                | Bound to             | Returns              |
| --------------------- | -------------------- | -------------------- |
| `initFade(view)`      | variant `init`       | —                    |
| `createFadeIn(view)`  | variant `buildIntro` | empty intro timeline |
| `createFadeOut(view)` | variant `buildOutro` | empty outro timeline |

Registered as `BIO_VARIANT_FACTORIES.fade` in
[[molecules/bio-motion/bio-motion|bio-motion.js]].

## Intent

The gel-free bio variant: a simple `header` fade-and-lift for contexts where
`gelManager` is unavailable or a gel wipe is too heavy. Unlike
[[molecules/bio-motion/sweep|sweep]] it has no `GelAnimationManager` dependency.

## Current state: inert

Every body is commented out. The timelines are still built and correctly tagged
with `TIMELINE_IDS.intro` / `TIMELINE_IDS.outro`, so `AbstractSection` can bind
lifecycle callbacks and the phase still completes — it just plays nothing.

The commented-out shape is the intended one:

- `initFade` — `gsap.set(view, { autoAlpha: 0 })`
- `createFadeIn` — `from` the header `{ autoAlpha: 0, y: 40 }` paced by
  `BIO_INTRO.duration` / `BIO_INTRO.ease.out`, then `addPause()`
- `createFadeOut` — header `to { autoAlpha: 0 }`

Selecting `fade` via `SECTION_OVERRIDES.bio` today yields a bio section that
never reveals. Uncomment before using it as a live variant. Distinct from
[[molecules/bio-motion/reduced|reduced]], which is _intentionally_ empty.
