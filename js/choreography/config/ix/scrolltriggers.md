---
id: frontend.js.choreography.config.ix.scrolltriggers.scrolltriggers
role: "Configuration — defines ScrollTrigger defaults and section-specific trigger presets for hero, bio, awards, organizations, work, card, and background sections."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - config
  - frontend
  - js
  - scrolltriggers
links:
  - "[[selectors|selectors]]"
---

# scrolltriggers

`SCROLL_DEFAULTS` = base config spread into every section trigger preset. Per-section presets (`ORGANIZATIONS_TRIGGER`, `BACKGROUND_TRIGGER`) extend it; Bio/Awards/Hero define their own in their organism files.

This file is the **single source of truth for trigger capability** (pin/scrub/once) — the profile system only gates `enabled`. `AbstractSectionTriggers.bind()` feeds `_getTriggerDefaults()` to `ScrollTrigger.create` **raw**.

The dead `composeScrollTrigger(base, profile)` merge helper was **removed** — it was never called (zero importers), leaving profile capability flags inert. Do not reintroduce a parallel capability source.
