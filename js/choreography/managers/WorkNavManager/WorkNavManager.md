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

`IntersectionObserver` with `rootMargin: "0px 0px -80% 0px"` creates a thin
active band in the top fifth of the viewport. Active = the **lowest visible
group in document order**, i.e. the reading position. On change, `aria-current`
moves to the matching link and `work:nav:active` is emitted with `{ id }`.

Styling is attribute-driven (`aria-[current=true]:` utilities in
`industry-links.njk`); the manager never touches classes.

At init the first group in document order is seeded active synchronously, so the
nav never renders all-inactive before the first IntersectionObserver callback.
The first real callback corrects it if a different group is already in the band.

## Lifecycle

Instantiated by `AnimationDirector` with the bus. No-ops on pages without work
nav groups/links (constructor returns early). `kill()` disconnects the observer
and clears every `aria-current`.

## Reduced motion

No animation — state is a single attribute toggle, identical whether or not
motion is reduced. No reduced branch required.

## Deferred

Straddle tuning of `rootMargin`/threshold against the sticky header offset
(`top-18`) is an open question, out of foundational scope.
