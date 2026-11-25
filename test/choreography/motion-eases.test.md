---
description: Contract test — every motion-token ease maps to an ease GSAP can parse, via GSAP_EASE in config/ix/motion.js.
status: stable
tags:
  - test
  - choreography
  - motion
links:
  - "[[dataink.io/frontend/js/choreography/config/ix/motion|motion]]"
---

# motion-eases.test

GSAP falls back to `power1.out` without error when it can't parse an ease, such as a CSS `cubic-bezier()` string. This test makes that failure visible. It checks that:

- every key in `motionTokens.ease` has a `GSAP_EASE` entry
- `motion.ease(token)` and each `ANIMATION_DEFAULTS.ease.*` value parse with `gsap.parseEase`
- an unknown token falls back to `standard`

Runs in `npm run test:choreography`.
