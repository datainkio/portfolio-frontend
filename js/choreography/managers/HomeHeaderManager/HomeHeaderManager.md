---
id: frontend.js.choreography.managers.homeheadermanager
role: "Runtime manager — transitions the home landing header into its navigation-device role once it reaches the top of the viewport, lifting it out of flow into an absolute overlay."
status: active
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/motion/choreography/manager"
  - "#design/motion/choreography/HomeHeaderManager"
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[config/contracts/events/events|config/contracts/events]]"
  - "[[home-landing|organisms/header/home/home-landing]]"
backlinks:
  - "[[AnimationDirector|AnimationDirector]]"
---

# HomeHeaderManager

Owns the home landing header's transition from **page hero** into its
**navigation-device** role.

## Ownership seam

The preloader runtime (`js/preloader/`, pure CSS) owns the header through its
intro → idle → outro and ends by dispatching `preloader:out`. That event is the
handoff where motion/IX ownership moves from **CSS to GSAP**. This manager arms
only on `preloader:out`; before then the header is `position: fixed` and
CSS-owned (see `styles/components/hanko.css`), so touching it early would fight
the outro.

## Trigger

User-facing trigger: **the top of the header reaches the top of the viewport**,
expressed as a ScrollTrigger `start: "top top"`. Because the header is the
topmost in-flow element, this is already true at scroll 0 — so the manager both
registers `onEnter` (forward crossing) and checks `isActive` immediately after
creating the trigger to cover the at-top case.

**The two paths are mutually exclusive at load — the trigger must not be
pinned.** A plain (unpinned) ScrollTrigger created while already past its `start`
does *not* fire `onEnter`, so at scroll 0 only the `isActive` check fires
(`onEnter` covers the inverse case: a load that starts scrolled below the header,
where the top later crosses going forward). An earlier experiment added
`pin: true`; that forced a refresh which re-crossed the start and fired `onEnter`
*as well* — producing a redundant `_enterNavRole` call — and the pin's
fixed/spacer layout both conflicted with the `position: absolute` overlay and
thrashed layout (a `min-height:100dvh` pin-spacer inserted then removed),
re-running the CSS context reveal. Pinning was removed. `_enterNavRole()` still
guards on `_inNavRole` as cheap insurance, and the `isActive` check uses optional
chaining (`this._trigger?.isActive`) in case `onEnter` fires synchronously during
`create()` and nulls the trigger.

## Initial response (current scope)

A single state change: the header is lifted out of normal flow into its resting
nav state — `position: absolute; top: 0; left: 0` — so page content **rises
underneath it** (overlay approach). This is a positioning `gsap.set()`, no tween,
so motion and reduced-motion are identical; a `reduced` branch will be added when
actual motion is introduced. The trigger is one-shot: it is killed once the state
is applied.

## DOM contract

- Hook: `[data-home-header]` on the home landing `<header>`
  (`views/organisms/header/home/home-landing.njk`), resolved via
  `SELECTORS.homeHeader`. The choreography decouples from the element's `id`
  (`#overview`) and from `data-preloader`, which belongs to the preloader domain.

## Lifecycle

- Instantiated by [[AnimationDirector|AnimationDirector]] alongside the other
  header managers; no-ops off the home page (hook absent).
- `kill()` removes the `preloader:out` listener, kills the trigger, and clears
  the applied position props.

## Notes for future maintenance

- The absolute resting state intentionally leaves width/height as the CSS leaves
  them; sizing of the nav-role header is a later step, not part of this initial
  response.
- When continuous nav-role behavior is added, the one-shot trigger teardown in
  `_enterNavRole()` will likely be replaced with a persistent observer.
