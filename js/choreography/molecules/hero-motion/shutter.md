---
id: frontend.js.choreography.molecules.hero-motion.shutter
role: "Hero `shutter` variant — tagline word split-reveal as the landing, plus a gel raised and lowered like a shutter for intro/outro. Driven by the pinned scrub trigger."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - gel
  - hero
  - hero-motion
  - js
  - molecule
  - splittext
links:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
  - "[[molecules/hero-motion/simple|molecules/hero-motion/simple]]"
  - "[[organisms/hero/HeroAnimations|organisms/hero/HeroAnimations]]"
  - "[[config/ix/motion|config/ix/motion]]"
backlinks:
  - "[[molecules/hero-motion/hero-motion|molecules/hero-motion/hero-motion]]"
---

## Exports

| Export | Bound to | Returns |
| --- | --- | --- |
| `init(view)` | variant `init` | landing timeline |
| `createRaiseShutter(view, gelManager)` | variant `buildIntro` | intro timeline |
| `createLowerShutter(view, gelManager)` | variant `buildOutro` | outro timeline |

Consumed by [[molecules/hero-motion/hero-motion|hero-motion.js]], which composes
the `HERO_VARIANT_FACTORIES` map.

## Landing — `init`

Splits the tagline into words and runs `fromTo(split.words, HERO_LANDING.from,
HERO_LANDING.to)`, then `.addPause()`. The pause is what hands control back to
the lifecycle: the landing holds at its end state until something advances it.

Target is `[data-hero-el="tagline"]`, falling back to `view` itself when the hook
is absent.

## SplitText state

Splits are tracked per-view in a module-level `WeakMap` (`splitByView`).
`splitTagline` calls `revertSplit` first, so a variant rebuild
(matchMedia / breakpoint change) reverts the prior split before re-splitting
rather than nesting wrappers. `WeakMap` keying means a discarded view is
collected without manual cleanup.

Words are given `wordsClass: "block w-full"` so each word occupies its own line
for the reveal.

## Intro / outro — the shutter

- `createRaiseShutter` — applies `HERO_INTRO` to `gel_hero` at position `0`, then
  `.addPause()`. Both the tween shape and its pacing come from the
  [[config/ix/motion|motion tokens]], not from this file.
- `createLowerShutter` — collapses the gel to `scaleY: 0` from
  `transformOrigin: "top center"` with `ease: "none"`. Linear because this
  timeline is scrub-owned; an ease here would fight the scroll mapping.

Both return an empty (but correctly tagged) timeline when no gel is resolved, so
the lifecycle still completes on pages without the hero gel.

## Reduced motion

Not handled here. The `reduced` profile swaps the whole variant, and that profile
also sets `trigger.enabled: false` — with no pin or scrub there is nothing to
drive intro/outro. See [[molecules/hero-motion/hero-motion|hero-motion.md]].
