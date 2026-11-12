---
description: "Configuration — global motion surface: re-exports motionTokens, and defines the `motion` token accessor, `toSeconds`, and ANIMATION_DEFAULTS. Section motion presets live in config/ix/presets/."
status: stable
tags:
  - choreography
  - config
  - motion
links:
  - "[[presets|presets]]"
  - "[[js/choreography/config/ix/presets/README|README.presets]]"
---

# motion

- `motionTokens` — re-exported from `js/choreography/tokens/motion/motion.js`, where the tokens are defined.
- `motion` — accessor with fallbacks: `motion.duration(name)`, `.ease(name)`, `.distance(name)`, `.stagger(name)`.
- `GSAP_EASE` — the GSAP core ease for each `motionTokens.ease` token. GSAP can't parse the tokens' `cubic-bezier()` strings without CustomEase. It quietly falls back to `power1.out`, so `motion.ease(name)` returns the name from this map, never the CSS string. The fits are approximate: `standard` and `emphasis` lose their soft start. A new ease token needs an entry here, and `test/choreography/motion-eases.test.js` enforces that.
- `toSeconds(ms)` — converts token milliseconds to GSAP seconds; non-numbers pass through.
- `ANIMATION_DEFAULTS` — base duration, stagger, ease, and `overwrite: "auto"`. Ease keys follow GSAP's sense: `in` = `exit` token (accelerate), `out` = `enter` token (decelerate, for reveals), `inOut` = `standard`. `inOut` is also the global `gsap.defaults` ease (`system/gsap.js`).

Section presets (`HERO_*`, `AWARDS_INTRO`, `CARD_PARALLAX`, `*_ANIMATION_DEFAULTS`, `PROJECT_HEADER_ANIMATION`, `TEXT_SPLIT_REVEAL`) live in [`presets/`](presets/README.md), one file per consumer area, each importing from here.
