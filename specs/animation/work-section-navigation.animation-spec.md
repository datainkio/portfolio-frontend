---
title: Work Section Navigation Spec
description: "Each parent section owns a local child-section index: visible information scent + direct anchor access."
type: spec
---

# Work Section Navigation Spec

- **Title:** Left-edge drawer / rail local in-page nav with scrollspy
- **Status:** draft
- **Last reviewed:** 2026-09-10
- **Scope:** `#work` section; reusable for any parent section with child groups
- **Links:** [[feat--work-section-navigation]], [[work.njk]], [[WorkHeaderManager]], [[work.animation-spec]]

## Intent

Each parent section owns a **local child-section index**: visible information scent + direct anchor access. Foundation is breakpoint-agnostic. The nav renders on the projects page only ([work.njk](../../views/organisms/section/work.njk) imports `industry-links` but never calls it).

For `#work`, children = industries. Index = the drawer/rail jumplinks.

## Foundational pattern (all breakpoints)

1. **Header** is the drawer/rail — `data-projects-el="header"`, the `fixed left-0` positioned/moving box (background, shadow, boundary geometry). Parent of the `<nav>`.
2. **In-page nav** — `<nav data-projects-el="jumplinks" id="work-jumplinks" aria-label="Jump to an industry">`, one `<a href="#industry-{slug}" data-projects-el="industry-link">` per child. Unpositioned — it exists inside the header only so the toggle's `aria-controls` has a stable id to point at. Native anchors; works with no JS.
   - **Bidirectional jump** — activating a link scrolls to the **top** of the target child group, whether it sits above or below the current scroll position. The anchor destination is the group's `industry-heading` `id`; scroll lands the heading at the top (accounting for the sticky header offset). No "forward-only" assumption — backward jumps must work identically.
3. **Drawer / rail** — `WorkHeaderManager`, responsive drive via `gsap.matchMedia()`, boundary `md`:
   - **Below `md`** — the header rests **off-canvas**, translated fully out of view (`xPercent: -100`) behind a persistent `<button data-projects-el="drawer-toggle" aria-expanded aria-controls="work-jumplinks">`. Tapping the handle toggles open/closed; a click on any `industry-link` closes the drawer (the anchor still navigates); `Escape` closes and returns focus to the handle; a click outside the header closes it. Non-modal — no focus trap, no `inert`.
   - **`md` and up** — the header rests **open** (`xPercent: 0`, transform cleared), positioned `fixed left-0 top-0` so it sits flush with the viewport edge rather than inset within the section's grid column; `<main>` gains a left offset (`md:pl-64`) so it covers nothing; no listeners bound.
   - `<h2>` always visible. Degrades to always-open with no JS — the closed (off-canvas) transform is JS-applied; CSS alone renders the header in place at every width, so a no-JS visit sees a static rail, not a hidden drawer.
4. **Scrollspy** — `WorkNavManager`, active child link reflects the child group currently in view via `IntersectionObserver` on the `industry-group` elements. Calm, single-active, no flicker. Independent of `WorkHeaderManager`.

## Reusable contract

Pattern keys on `data-*`, never classes:

| Attr                                  | Role                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `data-projects-el="header"`           | the drawer/rail — `fixed left-0` positioned/moving box; parent of the `<nav>`          |
| `data-projects-el="jumplinks"`        | `<nav>` — unpositioned; `id="work-jumplinks"` = `drawer-toggle`'s `aria-controls`      |
| `data-projects-el="drawer-toggle"`    | `<button>` handle; `aria-expanded` + `aria-controls="work-jumplinks"`; `md:hidden`     |
| `data-projects-el="industry-links"`   | `<ul>` — vertical list at every width, no transform, no height animation               |
| `data-projects-el="industry-link"`    | anchor → child group; carries active state (`aria-current`, set by `WorkNavManager`)   |
| `data-projects-el="industry-group"`   | scroll target / scrollspy observed unit                                                |
| `data-projects-el="industry-heading"` | `id` = anchor destination                                                              |

Active state set via attribute (e.g. `aria-current="true"`) on the matching link; styling reacts to the attribute. All coordination via `AnimationBus` event constant — no direct calls, no hardcoded strings.

## Accessibility

- Anchors are real links; keyboard + no-JS reach every child (no-JS = nav renders as a static in-place rail; see above).
- The handle is a native `<button>` with `aria-expanded` + `aria-controls="work-jumplinks"` — no `role="button"` hack on an anchor.
- The drawer is **non-modal**: no focus trap, no `inert`. `Escape` closes and returns focus to the handle. A click outside the header closes it. This is an index, not a dialog.
- Scrollspy uses `aria-current`; never traps focus or hides reachable content; independent of drawer open/closed state.
- Reduced motion: open/close resolves instantly via `gsap.set()`; final states identical to animated.

## Open questions

- `IntersectionObserver` `rootMargin`/threshold tuning so the active group resolves against the sticky header offset when two groups straddle it — unresolved, carried over.
- Rail width (`w-64`) is a fixed default, not derived from the longest industry label.
- Whether the drawer should also close on scroll below `md`, or persist until dismissed — not implemented; currently persists.
