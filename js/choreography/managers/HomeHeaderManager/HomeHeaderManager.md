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

On the one-shot trigger the trigger is killed once handled. Note that **header
positioning is CSS-owned, not done here.** The template keeps the header
`fixed top-0 left-0 h-dvh w-full` and `hanko.css` no longer returns it to flow on
`data-preloader-state="exit"`, so it persists as a fixed overlay with content
scrolling underneath. ScrollSmoother does not run on the home page (there is no
`#page-main-content`), so native `fixed` holds without a ScrollTrigger pin. This
manager therefore owns only the **behavioural** transition:

1. **Reverse the hgroup intro** (`_hideHGroup`). The hgroup's CSS intro is
   the shared `hanko-enter` keyframe applied under `[data-preloader-state="exit"]`
   (`opacity 0->1`, `translateY 24 -> -12 -> 0`, ease-out, `both` fill). As the
   header sheds its hero role, that intro is played **backward** as a clean exit:
   `opacity 1->0`, `y 0->24`, ease-in, reusing `--hanko-enter-duration` for
   symmetry (the intro's `-12px` overshoot is intentionally dropped).
2. **Reveal the page nav** (`_showNav`). The template hides the nav with Tailwind's
   `hidden` utility (`display: none`); GSAP cannot animate `display`, so the method
   first drops the `hidden` class (the direct inverse of the template's hidden
   state) and then fades the nav in: `opacity 0->1`, ease-out, reusing
   `--hanko-enter-duration`. This is the **opposite direction** of the hgroup exit
   on the same duration, so the two **crossfade**. Per-link staggering is a later
   step.

### The `display: none` reveal

`autoAlpha` drives `visibility`/`opacity`, not `display`, so a `display: none`
element cannot be faded in directly. `_showNav` releases the hide by removing the
`hidden` class before the `fromTo`. This is the one place the manager touches a
class name rather than a `data-*` hook — it mirrors the template's own hidden
state, not element selection (which stays on `SELECTORS.homeNav`).

### Reduced motion (nav)

Under reduced motion the nav skips the fade: drop `hidden` and settle visible
instantly with `gsap.set(autoAlpha: 1)`.

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
- `kill()` removes the `preloader:out` listener, kills the trigger, and tears
  down both the hgroup reversal and the nav reveal — killing their tweens,
  clearing `opacity/visibility/transform`, dropping the hgroup's inline
  `animation: none` (so CSS reclaims the intro), and re-adding the nav's `hidden`
  class (so CSS reclaims its hidden state). The header's position is CSS-owned, so
  teardown does not touch it.

## Notes for future maintenance

- The header is a fixed full-viewport overlay (`h-dvh w-full`, opaque
  `bg-slate-950`); until it is sized/styled for the nav role, it visually covers
  the content scrolling beneath it. Sizing is a later step.
- When continuous nav-role behavior is added, the one-shot trigger teardown in
  `_enterNavRole()` will likely be replaced with a persistent observer.
