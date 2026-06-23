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
   - **Below `md`** — jumplinks rest **closed**; an icon button (`data-projects-el="nav-toggle"`, chevron up/down, `aria-expanded` + `aria-controls="work-jumplinks"`) toggles them on click.
   - **`md` and up** — jumplinks rest **open** and collapse on scroll-down / expand on scroll-up; the toggle button is hidden (`md:hidden`).
   - `<h2>` always visible. Degrades to always-open with no JS.
4. **Scrollspy** (the foundational gap to build) — active child link reflects the child group currently in view, via `IntersectionObserver` on the `industry-group` elements. Calm, single-active, no flicker.

## Reusable contract

Pattern keys on `data-*`, never classes:

| Attr | Role |
|---|---|
| `data-projects-el="header"` | sticky index container |
| `data-projects-el="nav-toggle"` | icon button; toggles jumplinks below `md` (`aria-expanded`/`aria-controls`) |
| `data-projects-el="jumplinks"` | nav wrapper (collapse target); `id="work-jumplinks"` = toggle's `aria-controls` |
| `data-projects-el="industry-link"` | anchor → child group; carries active state |
| `data-projects-el="industry-group"` | scroll target / scrollspy observed unit |
| `data-projects-el="industry-heading"` | `id` = anchor destination |

Active state set via attribute (e.g. `aria-current="true"`) on the matching link; styling reacts to the attribute. All coordination via `AnimationBus` event constant — no direct calls, no hardcoded strings.

## Accessibility

- Anchors are real links; keyboard + no-JS reach every child.
- Toggle is a native `<button>` with `aria-expanded` + `aria-controls`; collapsed jumplinks are `visibility:hidden` (out of tab order) — correct disclosure semantics. With no JS the nav stays open and reachable.
- Scrollspy uses `aria-current`; never traps focus or hides reachable content.
- Reduced motion: collapse/expand and scrollspy resolve instantly via `gsap.set()`; final states identical to animated.

## Open questions

- `IntersectionObserver` `rootMargin`/threshold tuning so the active group resolves against the sticky header offset (`top-18`) when two groups straddle it.
