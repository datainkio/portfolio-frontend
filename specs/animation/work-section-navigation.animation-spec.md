---
title: Work Section Navigation Spec
description: "Each parent section owns a local child-section index: visible information scent + direct anchor access."
type: spec
---

# Work Section Navigation Spec

- **Title:** Sticky local in-page nav with scrollspy
- **Status:** draft
- **Last reviewed:** 2026-06-19
- **Scope:** `#work` section; reusable for any parent section with child groups
- **Links:** [[feat--work-section-navigation]], [[work.njk]], [[WorkHeaderManager]], [[work.animation-spec]]

## Intent

Each parent section owns a **local child-section index**: visible information scent + direct anchor access. Foundation is breakpoint-agnostic. Surfaces (lg rail, sm disclosure/drawer) are a **later phase, out of scope here**.

For `#work`, children = industries. Index = the existing sticky header jumplinks.

## Foundational pattern (all breakpoints)

1. **Sticky header** carries the child index — `data-projects-el="header"`, `sticky top-0`.
2. **In-page nav** — `<nav data-projects-el="jumplinks" aria-label="Jump to an industry">`, one `<a href="#industry-{slug}" data-projects-el="industry-link">` per child. Native anchors; works with no JS.
   - **Bidirectional jump** — activating a link scrolls to the **top** of the target child group, whether it sits above or below the current scroll position. The anchor destination is the group's `industry-heading` `id`; scroll lands the heading at the top (accounting for the sticky header offset). No "forward-only" assumption — backward jumps must work identically.
3. **Collapse/expand** — `WorkHeaderManager`, responsive drive via `gsap.matchMedia()`:
   - **Below `lg`** — the list rests **collapsed to its current (first) item**, which doubles as the disclosure control (no separate toggle button). The current link floats to the top via `max-lg:…order-first` and is marked with an arrow prefix (`max-lg:aria-[current=true]:arrow-prefix`). Tapping it expands the rest; other links navigate. The `<ul>` is `flex flex-col overflow-hidden`; `WorkHeaderManager` animates its height (single-item ↔ `auto`).
   - **`lg` and up** — the list rests **open** as a horizontal jumplink bar; no toggle.
   - `<h2>` always visible. Degrades to always-open with no JS (the `<ul>` renders at full height before JS collapses it).
4. **Scrollspy** (the foundational gap to build) — active child link reflects the child group currently in view, via `IntersectionObserver` on the `industry-group` elements. Calm, single-active, no flicker.

## Reusable contract

Pattern keys on `data-*`, never classes:

| Attr                                  | Role                                                                                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-projects-el="header"`           | sticky index container                                                                                                                         |
| `data-projects-el="jumplinks"`        | `<nav>` wrapper; `id="work-jumplinks"` = current link's `aria-controls`                                                                        |
| `data-projects-el="industry-links"`   | `<ul>` collapse target (height-animated; `overflow-hidden`)                                                                                    |
| `data-projects-el="industry-link"`    | anchor → child group; carries active state; the in-view one is the disclosure control below `lg` (`role="button"` + `aria-expanded` set by JS) |
| `data-projects-el="industry-group"`   | scroll target / scrollspy observed unit                                                                                                        |
| `data-projects-el="industry-heading"` | `id` = anchor destination                                                                                                                      |

Active state set via attribute (e.g. `aria-current="true"`) on the matching link; styling reacts to the attribute. All coordination via `AnimationBus` event constant — no direct calls, no hardcoded strings.

## Accessibility

- Anchors are real links; keyboard + no-JS reach every child (no-JS = list renders open).
- No separate toggle button: below `lg` the in-view link is the disclosure control — JS sets `role="button"` + `aria-expanded` + `aria-controls` on it and moves those attributes as the scrollspy advances. Trade-off: the control is an `<a>` with `role="button"` (current item is toggle-only), not a native `<button>`. Collapsed non-current items clip via the `overflow-hidden` `<ul>`.
- Scrollspy uses `aria-current`; never traps focus or hides reachable content.
- Reduced motion: collapse/expand and scrollspy resolve instantly via `gsap.set()`; final states identical to animated.

## Open questions

- `IntersectionObserver` `rootMargin`/threshold tuning so the active group resolves against the sticky header offset (`top-18`) when two groups straddle it.
