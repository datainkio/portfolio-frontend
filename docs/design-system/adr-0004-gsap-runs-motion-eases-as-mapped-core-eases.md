---
title: "ADR 0004: GSAP runs motion-token eases as mapped core eases"
description: "Decision record for how the GSAP choreography consumes the motion-token easing curves: each token maps to the nearest GSAP core ease, ease.in/out follow GSAP's sense, the global default is standard, and hardcoded GSAP eases move onto tokens."
type: reference
status: active
tags:
  - design-system
  - design-tokens
  - motion
  - choreography
  - decision
links:
  - "[ADR 0001](adr-0001-figma-owns-design-tokens.md)"
  - "[Design system spec](../../specs/design-system.spec.md)"
  - "[Motion config](../../js/choreography/config/ix/motion.md)"
  - "[Motion tokens](../../js/choreography/tokens/motion/motion.md)"
  - "[motion-eases test](../../test/choreography/motion-eases.test.md)"
---

# ADR 0004: GSAP runs motion-token eases as mapped core eases

- **Status:** Accepted, 2026-11-12. Russ chose the options during the task
  [Make GSAP honour the motion-token eases](../../../../goals/Frontend/_tasks/make-gsap-honour-the-motion-token-eases.md).
  Shipped in frontend `8163406b` on `feat-homepage`.
- **Scope:** Every GSAP tween in `js/choreography/` that takes its ease from a
  motion token. CSS transitions are unaffected.

## Context

The motion tokens in `js/choreography/tokens/motion/motion.js` hold each ease
as a CSS `cubic-bezier()` string. `npm run build:motion` mirrors them to
`styles/motion.css` as `--ease-*`, so CSS transitions run the exact curves.

`motion.ease(name)` passed the same strings to GSAP. GSAP can't parse
`cubic-bezier()` without its CustomEase plugin. It doesn't throw: it quietly
uses its default, `power1.out`. Measured in node, an explicit or default
`cubic-bezier()` ease and `power1.out` both evaluate to 0.4375 at t = 0.25. So
every token-eased tween ran the same curve whatever its token. That included
the global `gsap.defaults`, the atoms, the molecules, four managers, the hero
presets and the background intro. A few presets had worked around it with
hardcoded GSAP names.

Fixing the eases exposed a second problem. `ANIMATION_DEFAULTS.ease` read
`in` and `out` as entering and leaving: `in` was the `enter` token, `out` the
`exit` token. Its consumers read them the GSAP way: `in` speeds up, `out`
slows down. The hero intro reveals used `ease.out` and the work and
organizations presets set `in: exit, out: enter`. The global default was
`ease.out`, the accelerating `exit` curve. While every ease ran as
`power1.out` none of this showed. Once eases took effect, the hero reveals
would have sped up into place.

## Decision

1. **Each token maps to the nearest GSAP core ease.** `GSAP_EASE` in
   `js/choreography/config/ix/motion.js` holds the map, and `motion.ease()`
   returns from it. The CSS string never reaches GSAP. Each curve was fitted
   to its token's bezier, with the error measured from t = 0.4 to the end,
   where the eye judges an ease:

   | Token      | Bezier                 | GSAP ease     | Largest gap             |
   | ---------- | ---------------------- | ------------- | ----------------------- |
   | `standard` | `(0.4, 0, 0.2, 1)`     | `power1.out`  | 0.04 from t = 0.4 on    |
   | `enter`    | `(0, 0, 0.2, 1)`       | `power2.out`  | 0.04 over the whole run |
   | `exit`     | `(0.4, 0, 1, 1)`       | `sine.in`     | 0.03 over the whole run |
   | `emphasis` | `(0.3, 0, 0.2, 1.1)`   | `power2.out`  | 0.07 from t = 0.4 on    |
   | `springy`  | `(0.2, 0.8, 0.2, 1.4)` | `back.out(2)` | 0.05 over the whole run |

2. **`ANIMATION_DEFAULTS.ease` follows GSAP's sense.** `in` is `exit`
   (speeds up), `out` is `enter` (slows down, for arrivals and reveals), and
   `inOut` is `standard`. The background video fade-in moved from `ease.in`
   to `ease.out` to match.
3. **The global default is `standard`.** `gsap.defaults` takes
   `ANIMATION_DEFAULTS.ease.inOut`. It maps to `power1.out`, so tweens with no
   ease of their own run as they did before.
4. **Hardcoded GSAP eases move onto tokens.** `HERO_GEL_SOLID`,
   `HERO_MISSION_REVEAL`, `BACKGROUND_PERSPECTIVE`, `card-motion` throw and
   fade-n-lift, and `award-motion` slide now call `motion.ease()`.
   **Exception:** `card-motion/sticky.js` keeps `power2.out`. Its handoff
   maths depends on that exact curve's slope (2 at the start, falling to 0),
   so the curve is part of the calculation, not a design choice.
5. **A test enforces the map.** `test/choreography/motion-eases.test.js`, in
   `npm test`, fails when an ease token has no `GSAP_EASE` entry or its GSAP
   name doesn't parse.

## Alternatives

- **Register CustomEase** and build one GSAP ease per token from its bezier.
  It runs the exact curves, including `springy`'s overshoot, and GSAP's
  CustomEase is already in `node_modules`. Not chosen. Russ preferred no
  extra plugin in the bundle (about 7 KB minified), and core eases come close
  enough at the end of the motion. This is the path to take if a token's
  shape matters more than the fit allows.
- **Leave the strings as they are.** Not chosen. Every eased tween runs
  `power1.out` and the tokens mean nothing to GSAP.
- **Keep `ANIMATION_DEFAULTS` reading `in`/`out` as entering/leaving** and
  change the hero intro consumers instead. Not chosen. It means more edits,
  and the presets would still read the keys two different ways.

## Consequences

- GSAP runs an approximation of each designed curve. `standard` and
  `emphasis` lose their slow start, and no token maps to a curve that is
  gentle at both ends.
- The [motion token reference](../../ia/docs/design/tokens/motion.md) plots
  each GSAP ease dashed over its designed curve and plays the two side by
  side. It reads `GSAP_EASE` through `readDesignTokens()`, so the page can't
  drift from the choreography.
- A new ease token needs three steps: add it to `motion.js`, run
  `npm run build:motion`, and add a `GSAP_EASE` entry.
- Remapping a token changes every tween that uses it. Check the reference
  page and the homepage after any change to `GSAP_EASE`.
- Motion that moved onto tokens changed feel:
  - `BACKGROUND_PERSPECTIVE` went from `power2.inOut` to `power1.out` and
    now starts quickly.
  - The card throw-out went from `power3.in` to `sine.in`, and the award
    slide from `power3.out` to `power2.out`. Both are softer.
  - Exits now speed up as they leave; before, they slowed down.
