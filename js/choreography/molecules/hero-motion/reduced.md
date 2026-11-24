---
description: "Hero `reduced` variant — low-vestibular fallback. Shows gel_tagline at rest (autoAlpha 1) and returns empty intro/outro timelines. gel_video is shown by BackgroundVideo, not here."
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

## Reduced motion

`init` does the one thing that genuinely needs JS under reduced motion: it sets
`gel_tagline` to `autoAlpha: 1` and calls `gel.refresh()` on it.
Reduced motion lands at the completed state of the
[homepage initialization sequence](../../../../specs/animation/homepage-initialization.animation.md)
(step 12), where both gels are visible. `GelAnimationManager` parks every
gel at `autoAlpha: 0`, so they must be revealed explicitly. Both are
`absolute inset-0` in markup, so they need no JS geometry.

`gel_video` is not revealed here. [BackgroundVideo](../../organisms/background/BackgroundVideo.md)
owns its visibility, and its gated path covers reduced motion: `video` has no
`reduced` override, so it resolves to the `reduced` profile (timeline disabled),
and `AbstractSection` runs `_applyPostIntroState`, which snaps the gel visible.
History: until 2026-11-11 the variant hid the hero gel; from then until 2026-11-15
it showed both gels. The hero gel was replaced by `gel_video` on 2026-11-24.

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
