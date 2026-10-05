---
description: "Hero motion presets — HERO_INTRO_HOLD (beat between video:intro:complete and the hero intro), HERO_INTRO, HERO_MISSION_REVEAL, and HERO_OUTRO."
status: stable
tags:
  - choreography
  - config
  - motion
links:
  - "[[motion|motion]]"
  - "[[presets|presets]]"
  - "[[LandingSequence|LandingSequence]]"
  - "[[HeroTriggers|HeroTriggers]]"
---

# presets/hero

Built from `ANIMATION_DEFAULTS`, `motion`, and `toSeconds` in [[motion|motion]].

- `HERO_INTRO_HOLD` — seconds; consumed by `LandingSequence` via `gsap.delayedCall`. Reduced motion zeroes it.
- `HERO_INTRO` — intro timing for the `hero-motion` variants (split, sweep, fade, reduced).
- `HERO_MISSION_REVEAL` — mission statement's gel-led reveal (`hero-motion/mission-statement`).
- `HERO_OUTRO` — scrubbed outro; `pinRatio` is also read by `HeroTriggers` for the outro pin length.
