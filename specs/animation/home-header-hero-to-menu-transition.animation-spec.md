---
title: "Home Header — Hero → Menu Timed Transition"
description: "The hero view holds long enough to be consumed, then automatically animates itself out to reveal page content, resolving into the persistent menu rail."
type: spec
status: historical
tags:
  - animation-spec
  - choreography
  - home-landing
---

# Home Header — Hero → Menu Timed Transition Spec

- **Status:** superseded (2026-08-28) · **Last reviewed:** 2026-06-18

> [!warning] Superseded — retained as prior art only
> The `menu` role this spec designs **no longer exists.** The sidenav was removed
> from the homepage UX strategy on 2026-08-28: the header now runs
> `loader → hero → dismissed`, sliding off-stage and hiding for good, and the
> homepage has no in-page section navigation. The parts of this spec that survive
> are the **trigger model** (time is the sole trigger; scroll and tap are inert)
> and the **CSS/GSAP seam discipline** (CSS owns each role's rest layout, GSAP
> animates only the transitions between them) — both still govern
> [HomeHeaderManager](../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager.js).
> Everything describing the rail, the build phase, the nav reveal, or the side
> drawer is historical. Do not implement from it.

- **Scope:** The `hero → menu` role transition in [HomeHeaderManager](../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager.js) — trigger model, two-phase timeline, CSS/GSAP seam, tunability, reduced motion. The in-`menu` side drawer (base–md) is unchanged.
- **Links:** [HomeHeaderManager.js](../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager.js) + [sidecar](../../js/choreography/managers/HomeHeaderManager/HomeHeaderManager.md), [home-landing.njk](../../views/organisms/header/home/home-landing.njk), [config/ix/motion.js](../../js/choreography/config/ix/motion.js), [events.js](../../js/choreography/config/contracts/events/events.js), [motion-accessibility-policy.md](motion-accessibility-policy.md), handoff [2026-06-18-home-header-side-drawer.md](../../../context/handoffs/2026-06-18-home-header-side-drawer.md).

## Intent

The hero view holds long enough to be consumed, then **automatically animates itself out** to reveal page content, resolving into the persistent menu rail. The transition is **time-driven** — never gated on interaction, and scrolling never makes the view vanish.

This replaces the current `hero → menu` swap (ScrollTrigger `start: "top top"` + immediate `isActive` → instant CSS attribute flip), which hides content behind an interaction gate, gives no forward cue, and reacts unexpectedly to scroll. It also makes `hero` the stable resting state the manager sidecar flags as open.

### State model

| State                   | User perception                                  | Implementation                                                                                  |
| ----------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **hero (hold)**         | Full-bleed hero; nothing demanded.               | `data-header-role="hero"`; CSS-owned overlay at rest. Tunable hold timer runs.                  |
| **deconstruct (outro)** | Hero comes apart and clears, uncovering content. | GSAP animates the hero layer **out of** rest.                                                   |
| **(seam)**              | —                                                | `data-header-role` flips `hero → menu` in one tick, hero already gone; CSS resets to rail rest. |
| **build (intro)**       | Rail and nav assemble.                           | GSAP animates the menu layer **into** rest; `_showNav` stagger is the tail.                     |
| **menu (rest)**         | Persistent left rail; content scrolls beneath.   | `data-header-role="menu"`; CSS-owned. Side drawer unchanged.                                    |

## Motion Principles

- **Time is the trigger.** A hold timer armed at the CSS→GSAP seam (`preloader:out`) owns the transition. Remove the `ScrollTrigger`/`isActive` block from this path.
- **Two phases = outro then intro.** Reuse existing lifecycle/event vocabulary (`EVENTS.home` outro/intro keys, `TIMELINE_IDS.outro`/`.intro`); do not invent state names.
- **The attribute flip is the instant midpoint, never the animation.** CSS owns each role's untweenable rest layout; GSAP animates only the transitions into/out of those rests. Flip `data-header-role` at the phase seam, when the hero is already cleared — so progressive GSAP and instant CSS never fight (the hazard the removed `pin: true` experiment hit).
- **Reveal by clearing a layer, not tweening `width`.** Clear the full-bleed overlay with transform / `clip-path`; never per-frame `width`/`top`/`left`.
- **Hold is inert to input.** Scroll and tap during the hold do nothing — the timer is the sole trigger; there is no fast-forward.
- **Store the master timeline** (as `_navReveal` is stored) so it stays nestable/seekable.

## Primitives & Utilities

- **Hold token:** add `HOME_HERO_HOLD = { delay: <seconds> }` to [config/ix/motion.js](../../js/choreography/config/ix/motion.js) beside `HOME_NAV_REVEAL`. No magic number in the manager.
- **Dev override:** read an optional `?heroHold=0` URL param at arm time for rebuild-free tuning (mirrors the `testReducedMotion` dev-override idiom); the token stays the source of truth.
- **Timer:** `gsap.delayedCall(hold, …)` — ticker-synced and killable, not `setTimeout`. Store and kill in `kill()`.
- **Master timeline:** one `gsap.timeline` with labeled `"deconstruct"` → `"build"` phases. `_showNav` nests as the build tail (keep its `HOME_NAV_REVEAL` distance/stagger/ease and its `--hanko-enter-duration` seam token; do not fork them).

## Patterns by Component/View

- **Layer strategy — scrim.** The hero is a separate full-bleed panel; the rail is a persistent layer. The outro slides/clips the scrim away while the rail stays put, and the build assembles within the rail. Clean two-layer split, no `width` tweening.
- **Role flip:** set `data-header-role="menu"` at the `"deconstruct" → "build"` seam (timeline `.call()`), after the scrim clears. JS sets only the attribute; layout stays CSS-owned.
- **Nav reveal:** unchanged mechanism, now sequenced as the build tail rather than firing on role entry — which also fixes the handoff's "nav stagger spent invisibly" note.
- **Collapsed-rail handle:** the hanko mark is the collapsed `w-12` rail's handle/icon — it persists into the rail and signals the drawer is tappable, replacing the empty rail.

## Event Orchestration

- Emit on `EVENTS.home`: `home:outro:start/complete` (deconstruct), `home:intro:start/complete` (build, via the nav tail). Never hardcode strings.
- Arm point unchanged: on `EVENTS.system.preloaderOut`, resolve seam tokens → `_enterHeroRole()` → start the hold timer (no ScrollTrigger).

## Performance & Budget

- Target 60fps; drive the outro with transform / opacity / `clip-path` only. The overlay is opaque full-viewport (`fixed h-dvh w-full bg-slate-950`), so the outro must actually clear it or content stays covered.

## Accessibility

- **Reduced motion is mandatory** (a timed full-viewport move is vestibular-trigger territory). Under `prefers-reduced-motion: reduce`: **zero the hold**, skip the progressive timeline, `gsap.set()` straight to menu rest, and emit both event pairs instantly so coordinating sequences aren't left waiting (mirrors the `_showNav` reduced branch). Conform to [motion-accessibility-policy.md](motion-accessibility-policy.md).

## Testing & Validation

- Hero holds the token duration, then deconstructs and reveals content; `data-header-role` flips at the seam with no wrong-layout flash.
- Scroll/tap during hold does not trigger or skip the transition.
- Reduced-motion: hold zeroed, instant resolve to menu rest, both event pairs emitted.
- The hanko mark shows as the handle in the collapsed `w-12` rail.
- `?heroHold=0` collapses the hold; `kill()` tears down the `delayedCall` and master timeline.
