---
id: frontend.js.choreography.config.ix.ix
role: "Barrel — re-exports the ix/ interaction-design tuning modules (breakpoints, motion, scrolltriggers, profiles) as a single import surface."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#system/config"
  - "#design/motion"
links:
  - "[[breakpoints|breakpoints]]"
  - "[[motion|motion]]"
  - "[[scrolltriggers|scrolltriggers]]"
  - "[[profiles|profiles]]"
---

# ix barrel

Single re-export surface for the `ix/` package — the interaction-design tuning
constants expected to evolve as design iterates. Consumers import from the
config barrel ([[index|index]]) rather than reaching into `ix/` directly.

Re-exports, in order:

- [[breakpoints|breakpoints]] — responsive breakpoint tokens
- [[motion|motion]] — `motionTokens`, `motion`, and the per-section
  `*_ANIMATION_DEFAULTS`
- [[scrolltriggers|scrolltriggers]] — `SCROLL_DEFAULTS` and the per-section
  `*_TRIGGER` presets
- [[profiles|profiles]] — motion/interaction profiles
