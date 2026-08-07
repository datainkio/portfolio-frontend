---
id: frontend.js.choreography.managers.sectioncapmanager
role: "Section-cap scrollspy — tracks which `main > section` is at the current reading position and writes its label into the section-cap title display."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - js
  - manager
  - scrollspy
  - section-cap
links:
  - "[[AnimationDirector|AnimationDirector]]"
  - "[[config/contracts/events/events|config/contracts/events/events]]"
  - "[[managers/WorkNavManager/WorkNavManager|managers/WorkNavManager/WorkNavManager]]"
backlinks:
  - "[[AnimationDirector|AnimationDirector]]"
---

## Role

Constructed by [[AnimationDirector|AnimationDirector]] with `{ bus }`. Observes
every `main > section` inside `#page-main` and reflects the active one onto
`[data-current-section-title]`.

Spec: `specs/animation/work-section-navigation.animation-spec.md`.

## Mechanism

`IntersectionObserver`, not scroll listeners — no per-frame main-thread work.

- `rootMargin: "0px 0px -80% 0px"` shrinks the observation band to the **top
  fifth of the viewport**. A section counts as active once its top crosses into
  that band.
- Visible sections accumulate in a `Set`; the active one is the **last visible
  section in document order**, i.e. the lowest one the reader has reached.
- The label written is the section's `aria-labelledby` value, so the semantic
  heading id is the single source of truth for the cap text.

Disables itself (logs `no sections found; disabled`) when `#page-main` has no
`main > section` children — non-home pages no-op.

## Lifecycle

`kill()` disconnects the observer and clears `_activeId`. Called from
`AnimationDirector.destroy()`.

## Known risks

- `_setActive` writes `this._title.textContent` **without a null guard**. If
  sections exist but `[data-current-section-title]` is absent from the page, the
  first intersection throws. The constructor guards on `_sections` but not on
  `_title`.
- `EVENTS.sectionCap.activeChange` is commented out — the bus is injected but the
  manager currently broadcasts nothing, so no other surface can react to the
  active section without re-deriving scroll state. The `_bus` field and the
  `EVENTS` import are dormant until that line is restored and the namespace is
  added to the events contract.
- The `WORK_EL_ATTR` / `LINK_VALUE` / `GROUP_VALUE` constants and the
  `_linkById` map are leftovers from the jumplink-scrollspy shape; the live path
  does not use them. Scrollspy for work jumplinks lives in
  [[managers/WorkNavManager/WorkNavManager|WorkNavManager]].
