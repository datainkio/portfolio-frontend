---
description: "Hero molecule part — holds the gel_title gel as a full-width band behind the hero header's content block, the context label through the h1 (left 0, 100vw, that block's height and vertical position), parked collapsed at scaleX 0 for the split intro's left-to-right wipe. It is separate from gel_hero, which stays full-bleed at rest behind it. The block is measured only on refresh; scroll is followed with a y transform, with no per-tick layout read. Never ScrollTrigger-pinned."
status: stable
tags:
  - choreography
  - hero-motion
  - gel
links:
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|GelAnimationManager]]"
  - "[[molecules/hero-motion/heading-gel|molecules/hero-motion/heading-gel]]"
  - "[[molecules/hero-motion/split|molecules/hero-motion/split]]"
---

`attachTitleGel(view, gelManager)` resolves `gel_title` (`TITLE_GEL_ID`) from the
manager. From the view it resolves the context label (`HERO_SELECTORS.context`)
and the h1 (`HERO_SELECTORS.title`), and it measures from the label's top to the
h1's bottom. The `<header>` itself is `h-dvh`, so its own box would be the whole
viewport. The gel is placed at `left: 0 / width: 100vw`, with that block's height
and document-relative `top`, makes it visible (`autoAlpha: 1`), and parks it at
`scaleX: 0`. It returns `null` if the gel or the h1 is missing. With no label, the band covers the h1 alone.

The label's intro tween pre-sets it at `y: 100`, and `getBoundingClientRect()` includes transforms. So each box has its GSAP `y` subtracted before the union is taken.

The markup is in
[sizzle-background.njk](../../../../views/molecules/background/sizzle-background.md),
right after `gel_hero`, so it stacks above that gel. `gel_hero`
([heading-gel](heading-gel.md)) is unchanged and still fills the viewport at rest.

## Where it's called

The `split` variant's `init` in [hero-motion.js](hero-motion.md) calls it
alongside `buildHeadingGelRest`. The split intro ([split.md](split.md)) runs
`syncTitleGel(view)` first, because SplitText re-flows the h1 after the landing
phase has measured it. It then wipes `scaleX` 0 → 1 from `left center`.

`sync()` never sets `scaleX`, so a resize after the intro leaves the band at full
width. A matchMedia rebuild re-parks it at 0. `Hero._settleRevealToEnd` then
jumps the intro to `progress(1)`, which puts the band back at full width.

## Following the header

The gel is `absolute` inside `#sizzle-background`, which is `fixed inset-0`. The
header scrolls, so the work is split:

- **On refresh** (resize), `sync()` reads the label's and the h1's
  `getBoundingClientRect()` once. It sets `top` (the block's top plus `scrollY`), `height`, and `y: -scrollY`.
- **On scroll**, the `hero-title-gel-sync` ScrollTrigger's `onUpdate` sets only
  `y = -self.scroll()` through a `quickSetter`. That is not a layout read.

The band scrolls away with the header. The trigger is killed by id before it is
recreated, so rebuilds don't stack duplicates. It sets no `pin`.

`gel.refresh()` (the SVG mask re-measure) runs only when the band's height
changes. While the band is collapsed, `getBoundingClientRect()` reports a width
of 0, and `GelGeometry` falls back to `offsetWidth`, which is the untransformed
width.

Reduced motion: the `reduced` variant never calls this module. `gel_title` stays
at the `autoAlpha: 0` that `GelAnimationManager` sets.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`, and `gel_title`
sits over `gel_hero`, which has the same colour. Expect the band to read as a
darker stripe of the full-bleed gel rather than as a new colour.
