---
description: "Runtime manager — drives the home landing header's role state machine (loader -> hero -> dismissed) via the `data-header-role` attribute, playing the hero's exit on the transition."
tags:
  - choreography
  - manager
links:
  - "[[system/gsap|system/gsap]]"
  - "[[AnimationBus|AnimationBus]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[config/contracts/events/events|config/contracts/events]]"
  - "[[motion|config/ix/motion]]"
  - "[[home-landing|organisms/header/home/home-landing]]"
  - "[[hanko|styles/components/hanko]]"
---

# HomeHeaderManager

Owns the home landing header's **role state machine**, expressed as
`data-header-role` on the `<header>`. The header has three roles:

1. **`loader`** — initial state; the header is the preloader / loading view. The
   preloader runtime (pure CSS, via `data-preloader-state`) owns the visuals here.
2. **`hero`** — idle state; the header is a hero design element. Entered when the
   manager arms on `preloader:out`.
3. **`dismissed`** — the hero has played and cleared. The header is `hidden` and
   takes no further part in the page.

Each role's layout is declared in the template as Tailwind data-variants keyed on
`data-header-role`, so the manager flips **one attribute** per transition and
never couples to utility-class names. On top of each instant CSS swap it plays the
one piece of behavioural motion it owns: the hero's exit.

## Ownership seam

The preloader runtime (`js/preloader/`, pure CSS) owns the header through its
intro → idle → outro **while in the `loader` role**, and ends by dispatching
`preloader:out`. That event is the handoff where motion/IX ownership moves from
**CSS to GSAP**. This manager arms only on `preloader:out`; before then the header
is `position: fixed` and CSS-owned (see `styles/components/hanko.css`), so touching
it early would fight the loader outro. `loader` and `hero` differ behaviourally
(loader runs the preloader animation; hero is the resting idle state), not
necessarily in layout — the visible difference is driven by the preloader CSS.

## loader → hero

When `_arm()` runs on `preloader:out`, `_enterHeroRole()` sets
`data-header-role="hero"` — the loader is finished and the header settles into its
idle hero role. The manager then arms the hold timer.

## hero → dismissed

The trigger is **time, and nothing else**. On `_arm()` the header enters `hero`
and a `gsap.delayedCall` runs for `HOME_HERO_HOLD.delay` seconds; when it fires,
`_runTransition` slides the hero panel off-stage left and the header is dismissed.

**Scroll and tap are inert by design** — an earlier scroll-gated swap
(`ScrollTrigger start: "top top"` + an immediate `isActive` check) flipped the
whole view away on the first scroll, hiding page content behind an interaction
gate with no forward cue. That ScrollTrigger is removed.

- **Tunability (DX):** the hold lives in the `HOME_HERO_HOLD` motion token
  (`config/ix/motion.js`). `?heroHold=<seconds>` overrides it at runtime for
  rebuild-free tuning (`_resolveHold` / `_readHoldOverride`); the token stays the
  source of truth. Reduced motion zeroes the hold.
- **Timer primitive:** `gsap.delayedCall` (not `setTimeout`) so the hold is
  ticker-synced, pausable and killable; the handle is stored as `this._holdCall`.
- **`hero` is a real resting state**, not a transient one.

### The exit, and why it is load-bearing

`_buildDeconstruct` slides the hero panel off-stage left (`xPercent: -100`,
**transform-only / compositor-safe — never width/layout**), revealing page content
beneath. The lockup rides the header off, so the hero reads as exiting. Held on
`this._master`, stored so it stays seekable/killable.

On completion it calls `_dismiss()` **before** emitting `home:outro:complete`, so
no listener can observe a half-gone header.

`home:outro:complete` is the cue the rest of the landing hangs off:
`LandingSequence` starts the background video's intro there, which chains to the
gel entrance and the bio intro. **The header opens the landing and then leaves.**
Anything added to that chain must not expect the header to still be present.

Under **reduced motion** there is no slide: `_runTransition` emits `outro:start`,
dismisses, and emits `outro:complete` — all instantly — so the chain downstream is
never left waiting.

## Dismissal (`_dismiss`)

Sets `data-header-role="dismissed"`, which the template styles as `hidden`, and
clears the inline transform the slide left behind (the element is hidden, so the
cleared transform is never seen).

Retiring the header matters: left parked off-stage it would be a full-viewport
opaque `fixed z-[9999] h-dvh` overlay sitting just outside the viewport — still in
the accessibility tree, and able to widen the scrollable area on mobile. `_dismiss`
is idempotent (`_dismissed` guards it).

Because the header is retired the moment its exit finishes, there is **no long
"parked off-stage" window** — which is why this manager no longer carries a
debounced resize-settle pass. An `xPercent` park is a percentage of a width a
resize changes, so a durable park would need re-asserting; a dismissal does not.

## The CSS-owned role layouts

Each role's layout lives entirely in the template as Tailwind classes gated by
`data-header-role` on the header — JS flips one attribute, CSS owns the styling.
The header config (`home-landing.njk`) keys a class set per role; the `classes`
filter prefixes each with its `data-[header-role=…]:` variant:

- **`loader` / `hero`:** `w-full flex items-center` (centred full-width lockup).
  They share a layout today but are kept separate so they can diverge.
- **`dismissed`:** `hidden`.

This keeps all styling in markup (single source of truth, Tailwind-idiomatic) and
keeps the manager off class names entirely — it satisfies the choreography
decoupling rule (`data-*`, never CSS classes) instead of fighting it.

## Bus events

`HomeHeaderManager` receives the `AnimationBus` from the Director and resolves its
event names from `EVENTS.home` (`makeSectionEvents("home")`). It emits
`home:outro:start` / `home:outro:complete` around the hero's exit.

It emits **no intro events** — there is no longer anything for the header to
introduce. `EVENTS.home.introStart` / `.introComplete` still exist (they come from
the shared `makeSectionEvents` factory) but are unused; do not wire new work to
them expecting this manager to fire them.

`_emit(name, payload)` mirrors `AbstractSection._emit` (no-ops without a bus or
event name).

## DOM contract

- Hook: `[data-home-header]` on the home landing `<header>`
  (`views/organisms/header/home/home-landing.njk`), resolved via
  `SELECTORS.homeHeader`. The choreography decouples from the element's `id`
  (`#overview`) and from `data-preloader`, which belongs to the preloader domain.
- State attribute: `data-header-role` on the same `<header>`, values
  `loader` (initial, set in the template) → `hero` → `dismissed`. JS owns the
  value; the template owns the styling that responds to it. Distinct from
  `data-preloader-state`, which the preloader runtime owns for the loader's
  internal phases.

## Lifecycle

- Instantiated by [[AnimationDirector|AnimationDirector]] alongside the other
  header managers, receiving the shared `AnimationBus`; no-ops off the home page
  (hook absent).
- `kill()` removes the `preloader:out` listener, kills the **hold timer
  (`_holdCall`)** and the **exit timeline (`_master`)**, resets
  `data-header-role="hero"` and **clears the header transform** (releasing the
  slide so CSS owns the resting position). `loader` is a one-time boot phase that
  can't be re-entered, so `hero` is the idle fallback. The header's position and
  the hgroup are CSS-owned, so teardown does not touch them.

## Notes for future maintenance

- The header carries **no heading**. The page's `<h1>` is the bio section's
  headline (`views/organisms/section/bio.njk`); the header's brand text is a
  plain `<p>`. Do not reintroduce an `<h1>` here — it would give the page two.
- The header is a fixed full-viewport overlay (`h-dvh`, opaque `bg-slate-950`)
  while in `loader`/`hero`, and hidden thereafter.
- **The side drawer and the `menu` rail were removed** when the sidenav left the
  homepage UX strategy. The page has no in-page section navigation; sections are
  reached by scroll, by heading (AT), or by anchor deep-link. If navigation
  returns it should be designed fresh, not restored from this manager's history.
- **Visual tuning is browser-verified follow-up.** The exit is a transform-only
  `xPercent` slide of the single header element; geometry/feel are the open knobs.
