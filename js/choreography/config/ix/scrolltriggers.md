---
description: "Configuration — defines SCROLL_DEFAULTS, the base ScrollTrigger config every section trigger spreads. Section trigger configs live in each organism's *Triggers.js."
status: stable
tags:
  - choreography
  - config
  - scrolltrigger
links:
  - "[[AbstractSectionTriggers|AbstractSectionTriggers]]"
---

# scrolltriggers

`SCROLL_DEFAULTS` = base config spread into every section trigger preset. This file exports nothing else: the per-section presets (`HERO_TRIGGER`, `WORK_TRIGGER`, `AWARDS_TRIGGER`, `ORGANIZATIONS_TRIGGER`, `BACKGROUND_TRIGGER`) live in their organisms' `*Triggers.js`.

The trigger configs are the **single source of truth for trigger capability** (pin/scrub/once) — the profile system only gates `enabled`. `AbstractSectionTriggers.bind()` feeds `_getTriggerDefaults()` to `ScrollTrigger.create` **raw**.

The dead `composeScrollTrigger(base, profile)` merge helper was **removed** — it was never called (zero importers), leaving profile capability flags inert. Do not reintroduce a parallel capability source.

## Pin vs. CSS `sticky` — never both

A preset with `pin: true` and CSS `position: sticky` on the **same** element conflict: ScrollTrigger pinning works by transforming/repositioning the element (and wrapping it in a pin-spacer), which fights `sticky`'s own scroll-bound positioning — the result is jitter, drift, or a dead pin. Pick one mechanism per element:

- **`ScrollTrigger.pin`** when the pin is tied to a scrubbed timeline or a precise `start`/`end` range (the card presets above).
- **CSS `sticky`** for simple "hold then release" with no timeline coupling.

Never apply both to one element. If a sticky ancestor already holds an element in place, do not also add `pin` to it (or a descendant that would re-pin the same region).
