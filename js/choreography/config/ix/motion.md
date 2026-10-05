---
description: "Configuration — global motion surface: re-exports motionTokens, and defines the `motion` token accessor, `toSeconds`, and ANIMATION_DEFAULTS. Section motion presets live in config/ix/presets/."
status: stable
tags:
  - choreography
  - config
  - motion
links:
  - "[[presets|presets]]"
  - "[[README.presets|README.presets]]"
---

# motion

- `motionTokens` — re-exported from `js/choreography/tokens/motion/motion.js`, where the tokens are defined.
- `motion` — accessor with fallbacks: `motion.duration(name)`, `.ease(name)`, `.distance(name)`, `.stagger(name)`.
- `toSeconds(ms)` — converts token milliseconds to GSAP seconds; non-numbers pass through.
- `ANIMATION_DEFAULTS` — base duration, stagger, ease (`in`/`out`/`inOut`), and `overwrite: "auto"`.

Section presets (`HERO_*`, `AWARDS_INTRO`, `CARD_PARALLAX`, `*_ANIMATION_DEFAULTS`, `PROJECT_HEADER_ANIMATION`, `TEXT_SPLIT_REVEAL`) live in [`presets/`](presets/README.presets.md), one file per consumer area, each importing from here.
