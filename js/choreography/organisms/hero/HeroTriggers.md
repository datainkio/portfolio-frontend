---
id: frontend.js.choreography.organisms.hero.herotriggers
role: "Hero triggers module — supplies HERO_TRIGGER to AbstractSectionTriggers; pin and scrub are currently off, so the main trigger creates no pin and the scrub-linked gel outro is skipped. Hero is static after the landing shutter (not implemented — no non-scrub fallback)."
status: stable
surface: internal
scope: frontend
runtime: browser
atomicLevel: "organism"
tags:
  - choreography
  - frontend
  - js
links:
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
  - "[[system/gsap|system/gsap]]"
  - "[[config/index|config/index]]"
---

# HeroTriggers

> **Status: not implemented.** Hero motion is on hold. Contract below reflects the current (degraded) state of the kept ScrollTrigger evaluation edits, not a finished design.

`HERO_TRIGGER` extends `SCROLL_DEFAULTS`; `toggleActions: "none none none none"` (wires no lifecycle callbacks). `_getTriggerDefaults()` overrides `end` to the last-word bottom when available.

**pin/scrub currently `false`** (evaluation — kept). Consequence: Hero's scroll choreography was 100% scrub-driven, so with scrub off it is **static after the landing shutter** — no intro-on-enter, no outro. Unlike Bio/Awards, Hero has no discrete-lifecycle fallback path.

`bind()` early-returns before creating the `_gelTrigger` outro when `!HERO_TRIGGER.scrub` (the gel outro is intrinsically scrub-driven). `kill()` tears down `_gelTrigger`. Re-enabling Hero motion means flipping scrub back on **or** adding a non-scrub reveal path.
