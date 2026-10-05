---
description: "Barrel — re-exports the ix/ interaction-design tuning modules (breakpoints, motion, presets, scrolltriggers, profiles) as a single import surface."
status: stable
tags:
  - choreography
  - config
  - motion
links:
  - "[[breakpoints|breakpoints]]"
  - "[[motion|motion]]"
  - "[[presets|presets]]"
  - "[[scrolltriggers|scrolltriggers]]"
  - "[[profiles|profiles]]"
---

# ix barrel

Single re-export surface for the `ix/` package — the interaction-design tuning
constants expected to evolve as design iterates. Most consumers deep-import the
specific file (e.g. `ix/presets/hero.js`); the config barrel ([[index|index]])
re-exports everything here for convenience.

Re-exports, in order:

- [[breakpoints|breakpoints]] — responsive breakpoint tokens
- [[motion|motion]] — `motionTokens`, `motion`, `toSeconds`, `ANIMATION_DEFAULTS`
- [[presets|presets]] — per-section motion presets (`presets/*.js`)
- [[scrolltriggers|scrolltriggers]] — `SCROLL_DEFAULTS` only; section
  `*_TRIGGER` configs live in each organism's `*Triggers.js`
- [[profiles|profiles]] — `ACCESSIBILITY_SETTINGS`, `SECTION_OVERRIDES`,
  `resolveSectionMotionProfile`
