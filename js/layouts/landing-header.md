---
description: Scroll-driven shrink choreography for the landing page header.
type: script
tags:
  - module
  - layouts
  - landing-header
  - scrolltrigger
links:
  - "[landing.njk](../../views/templates/landing/landing.md)"
---

# landing-header

Collapses the landing header from full-viewport height down to a compact bar
as the user scrolls, via a single scrubbed `ScrollTrigger`.

## Source

- Module: [[landing-header.js]]
- Path: `js/layouts/landing-header.js`
- Loaded via: `<script type="module">` in
  [`landing.njk`](../../views/templates/landing/landing.md).
- GSAP: imported from the curated vendor barrel
  (`js/choreography/system/gsap.js`) so the same import works bundled and
  unbundled.

## Approach

- Header is `position: fixed` (not GSAP-pinned, not CSS `sticky` — the two
  fight each other).
- A sibling spacer reserves the initial hero space; it shrinks in lockstep
  with the header so downstream content follows the header down.
- One scrubbed timeline animates header height, spacer height, and title
  font-size together over `COLLAPSE_DISTANCE_PX` (400px). After the scrub,
  the timeline holds its final values and the rest of the page scrolls
  under the compact bar.

## Activation

Opt-in via data attributes — no-ops if either is missing:

- `[data-landing-header]` — the header element
- `[data-landing-header-spacer]` — its sibling spacer
- `[data-landing-header-title]` — optional; title font-size only animates if present

## Public Exports

- `initLandingHeader()` — runs the choreography; safe to call more than
  once; returns the created `ScrollTrigger` or `null` if the required
  elements aren't present.

Self-initializes on import (`DOMContentLoaded`, or immediately if the DOM is
already parsed).
