---
description: "Runtime manager — scrollspy for the work section local in-page nav. Observes the industry groups with IntersectionObserver and reflects the group currently in view onto its jumplink via aria-current=\\\"true\\\". Broadcasts the active group id on AnimationBus (work:nav:active) so later breakpoint surfaces can react. Native anchors keep working with no JS; this only adds the active hint."
status: stable
tags:
  - choreography
  - manager
links:
  - "[[system/AnimationBus|AnimationBus]]"
  - "[[config/contracts/events/events|config/contracts/events]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[organisms/section/work|work.njk]]"
  - "[[molecules/list/industry-links|industry-links.njk]]"
  - "[[managers/WorkHeaderManager/WorkHeaderManager|WorkHeaderManager]]"
---

Implements the **scrollspy** half of the work section navigation spec
([work-section-navigation.animation-spec.md](../../../../specs/animation/work-section-navigation.animation-spec.md)).
`WorkHeaderManager` owns the collapse/expand of the sticky jumplinks; this
manager owns which child link is **active**. The two are intentionally separate
concerns.

## Contract

Keys entirely on `data-projects-el` attributes — never classes:

- `industry-group` — observed scroll unit. Its `aria-labelledby` is the shared
  `industry-{slug}` id.
- `industry-link` — jumplink. Its `href` hash is the same `industry-{slug}` id;
  carries `aria-current="true"` when active.

The shared id is the single join key between a group and its link.

## Active-region rule

Two `IntersectionObserver`s watch every group:

- **Band** — `rootMargin: "0px 0px -80% 0px"`, a thin band in the top fifth of
  the viewport. It picks **which** group is current: the lowest group in the
  band, in document order (the reading position).
- **Viewport** — no margin. It decides **whether** any group is current.

The resulting state:

- **No group in the viewport** (on landing, above the first group, or past the
  last): no link carries `aria-current`, and `work:nav:active` is emitted with
  `{ id: null }`.
- **A group in the band**: `aria-current` moves to its link and
  `work:nav:active` is emitted with `{ id }`.
- **Groups visible but none in the band** (the `my-48` gaps between groups are
  wider than the band, or a group only partly scrolled in): the current link is
  kept, so the nav doesn't blink off between groups. On landing this means
  nothing is current until the first group's top reaches the band.

Emits happen only when the id changes. Styling is attribute-driven
(`aria-[current=true]:` utilities in `industry-links.njk`); the manager never
touches classes.

There is no boot seed. Before 2026-09-28 the first group was marked current at
init and `aria-current` stayed on the last group after the reader left them
all; both were removed so the nav shows nothing current when no group is in
view.

## Lifecycle

Instantiated by `AnimationDirector` with the bus. No-ops on pages without work
nav groups/links (constructor returns early). `kill()` disconnects both observers
and clears every `aria-current`.

## Reduced motion

No animation — state is a single attribute toggle, identical whether or not
motion is reduced. No reduced branch required.

## Deferred

Straddle tuning of `rootMargin`/threshold against the sticky header offset
(`top-18`) is an open question, out of foundational scope.
