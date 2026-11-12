---
description: "Motion primitive values — defines duration, ease, distance, stagger, opacity, blur, and z-layer design tokens for the choreography system."
status: stable
tags:
  - choreography
  - design-tokens
  - motion
---

# Motion tokens

`ease` values are CSS `cubic-bezier()` strings. `npm run build:motion` copies them to `styles/motion.css`, and CSS runs them exactly. GSAP can't parse them, so the choreography never passes them to GSAP directly. `motion.ease(name)` in [config/ix/motion.js](../../config/ix/motion.md) returns the nearest GSAP core ease from `GSAP_EASE` instead. A new `ease` token needs an entry there; `test/choreography/motion-eases.test.js` enforces it.
