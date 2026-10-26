---
description: "Hero molecule part — holds the gel_hero gel as a full-width band behind the hero h1 (left 0, 100vw, the h1's own height and vertical position). The h1 box is measured only on refresh; scroll is followed with a y transform, with no per-tick layout read. As hero's landing phase it parks the band collapsed at scaleX 0, ready for the split intro's left-to-right wipe. The gel is never ScrollTrigger-pinned: it is a child of the fixed-positioned #sizzle-background container."
status: stable
tags:
  - choreography
  - hero-motion
  - gel
links:
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|GelAnimationManager]]"
  - "[[molecules/hero-motion/split|molecules/hero-motion/split]]"
---

`attachHeadingGel(view, gelManager)` resolves `gel_hero` (`HEADING_GEL_ID`) from
the manager and the h1 (`[data-hero-el="heading"]`, `HERO_SELECTORS.title`) from
the view. It places the gel at `left: 0 / width: 100vw`, with the h1's height and
document-relative `top`, and makes it visible (`autoAlpha: 1`), because
`GelAnimationManager` parks every gel at 0. It returns `null` if either the gel
or the h1 is missing.

## Following the h1

The gel is `absolute` inside `#sizzle-background`, which is `fixed inset-0`, so it
cannot scroll. The h1 does. The band stays on the heading by splitting the work:

- **On refresh** (resize, and HeroTriggers' explicit `getById(...).refresh()`),
  `sync()` reads the h1's `getBoundingClientRect()` once. It sets `top` to
  `rect.top + scrollY`, a document-relative position, sets `height` to the h1's
  height, and sets `y: -scrollY`.
- **On scroll**, the `hero-heading-gel-sync` ScrollTrigger's `onUpdate` sets only
  `y = -self.scroll()` through a `quickSetter`. That is not a layout read, so the
  per-tick reflow that earlier header-tracking revisions caused does not come
  back.

The band therefore scrolls away with the heading. It is no longer the standing,
viewport-filling background plane it was before 2026-10-26.

The trigger is killed by id before it is recreated, so matchMedia and resize
rebuilds do not stack duplicates. `gel.refresh()` (the SVG mask re-measure) runs
only when the band's height changes.

## scaleX belongs to the wipe

`sync()` neutralizes stray transforms (`x`, `rotation`, `xPercent`, `yPercent`,
`scaleY: 1`) and sets `transformOrigin: "left center"`, but it never touches
`scaleX`. Two owners hold that property:

- **Landing:** `buildHeadingGelRest(view, gelManager)` is the `split` variant's
  `init` in [hero-motion.js](hero-motion.md), so `HeroAnimations._buildLanding`
  picks it up. It calls `attachHeadingGel`, parks the band at `scaleX: 0`, and
  returns an empty `TIMELINE_IDS.landing` timeline so the phase contract holds
  for `AbstractSection`.
- **Intro:** the split intro wipes `scaleX` 0 → 1 from the left edge
  ([split.md](split.md)). Its leading call runs `syncHeadingGel(view)` first,
  because SplitText re-flows the h1 after the landing phase has measured it.

A rebuild before the intro has been requested re-parks the band at 0. After the
intro, `Hero._settleRevealToEnd` jumps the intro to `progress(1)`, which puts the
band back at `scaleX: 1`.

The mask is measured with `getBoundingClientRect()`, which returns the
transformed box. While the band is collapsed that width is 0, and
`GelGeometry`/`GelMask` fall back to `offsetWidth`, which is the untransformed
width. A refresh at `scaleX: 0` therefore still measures the true band.

## Never pinned

**No gel is ever a ScrollTrigger pin target**, and none should be. Every gel is a
child of `#sizzle-background` (`fixed inset-0`), so pinning would be redundant at
best. At worst it would inject a pin-spacer into the background layer.
`hero-heading-gel-sync` sets no `pin`. The nearby `hero-outro-pin`
([HeroTriggers.md](../../organisms/hero/HeroTriggers.md)) pins the **hero section
root**, and only _animates_ this gel's `scaleY`.

## Suspend during the outro pin

`suspendHeadingGelSync(view)` / `resumeHeadingGelSync(view)` (a module-level
`WeakSet`, keyed on `view`) gate both `sync()` and the scroll `onUpdate`.
**Suspension defers rather than discards:** a `sync()` called while suspended
records that one is owed (a `pending` `WeakSet`), and `resume` runs it
immediately through the live closure held in the `syncs` `WeakMap`.

The outro pin drives `scaleY` on this band (see the outro section of `split.md`),
and `sync()` would reset it. `HeroTriggers` suspends sync when the pin activates
and resumes it when the pin deactivates, as well as in `kill()`. It then
force-refreshes the sync trigger by id. The outro is currently disabled in
`hero-motion.js`.

`getHeadingGelEl(gelManager)` exports the resolved gel element.
`syncHeadingGel(view)` exports an on-demand re-measure.

Reduced motion: the profile system swaps hero to the `reduced` variant, which
hides the gel (`autoAlpha: 0`) and never calls this module.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`. Against a very dark
backdrop inside `#sizzle-background` the band can read as near-invisible. If that
happens, force `mixBlendMode: "normal"` on the gel element.
