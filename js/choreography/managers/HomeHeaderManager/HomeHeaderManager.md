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

## Response on entering nav role (`_enterNavRole`)

On the one-shot trigger, two things happen (the trigger is killed once applied):

1. **Overlay lift (parked).** The header is meant to lift out of normal flow into
   its resting nav state — `position: absolute; top: 0; left: 0` — so page content
   rises underneath it. This `gsap.set()` is currently commented out while the
   nav-role layout is tuned.
2. **Reverse the hgroup intro** (`_reverseHgroupIntro`). The hgroup's CSS intro is
   the shared `hanko-enter` keyframe applied under `[data-preloader-state="exit"]`
   (`opacity 0->1`, `translateY 24 -> -12 -> 0`, ease-out, `both` fill). As the
   header sheds its hero role, that intro is played **backward** as a clean exit:
   `opacity 1->0`, `y 0->24`, ease-in, reusing `--hanko-enter-duration` for
   symmetry (the intro's `-12px` overshoot is intentionally dropped).

### The `both`-fill gotcha

A CSS animation with `both` fill **holds its end frame and overrides inline
styles**, and the base rule beneath the hgroup hides it (`opacity: 0` under
`prefers-reduced-motion: no-preference`). So the reversal cannot just `gsap.to()`:
it first releases the hold with `el.style.animation = "none"`, then uses a
`fromTo` whose immediate-render `from` pins the visible state inline (inline beats
the base rule) so there is no flash to hidden.

### Reduced motion

Under reduced motion the CSS intro never runs (its hidden state is gated behind
`prefers-reduced-motion: no-preference`), so there is nothing to play backward —
the reversal settles to the hidden end state instantly with `gsap.set()`.

## DOM contract

- Hook: `[data-home-header]` on the home landing `<header>`
  (`views/organisms/header/home/home-landing.njk`), resolved via
  `SELECTORS.homeHeader`. The choreography decouples from the element's `id`
  (`#overview`) and from `data-preloader`, which belongs to the preloader domain.

## Lifecycle

- Instantiated by [[AnimationDirector|AnimationDirector]] alongside the other
  header managers; no-ops off the home page (hook absent).
- `kill()` removes the `preloader:out` listener, kills the trigger, clears the
  applied header position props, and tears down the hgroup reversal — killing its
  tween, clearing `opacity/visibility/transform`, and dropping the inline
  `animation: none` so CSS reclaims ownership of the intro.

## Notes for future maintenance

- The absolute resting state intentionally leaves width/height as the CSS leaves
  them; sizing of the nav-role header is a later step, not part of this initial
  response.
- When continuous nav-role behavior is added, the one-shot trigger teardown in
  `_enterNavRole()` will likely be replaced with a persistent observer.
