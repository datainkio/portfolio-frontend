---
description: "Split variant for hero-motion — the intro opens with the title gel (gel_title, separate from gel_hero) wiping left-to-right into a full-width band behind the h1, then SplitText word-splits the manifesto title, matches keyword words, and color-highlights them via a design-token color. The Blockframes reveal has moved to the Process section (choreography/molecules/process-motion) and is no longer driven from here. Also exports outro(view, gelManager): a two-beat scrub timeline (line fade, gel expand) consumed by HeroTriggers' scrub-driven outro pin. The mission-statement and aside travel beats, and the standalone aside scroll reveal (buildAsideReveal), have been removed."
status: stable
tags:
  - hero-motion
  - hero
  - choreography
  - introduction
  - splittext
  - variant
links:
  - "[[hero-motion]]"
  - "[[molecules/hero-motion/heading-gel|molecules/hero-motion/heading-gel]]"
  - "[[molecules/hero-motion/title-gel|molecules/hero-motion/title-gel]]"
  - "[[molecules/hero-motion/mission-statement|molecules/hero-motion/mission-statement]]"
---

## Heading split lifecycle

`intro()` builds the H2's `SplitText` via a module-level `buildHeadingSplit(view, title)` helper (keyed on `view` in a `WeakMap`) instead of calling `new SplitText` inline. `_buildTimeline()` re-runs `intro()` on every matchMedia breakpoint crossing against the same already-split DOM — without caching + `revert()`-ing the prior instance first, a rebuild would nest split markup inside itself and corrupt both the intro chars and the outro's line targets.

## Intro: gel wipe, then letters

The intro opens with the title gel. The landing phase ([title-gel](title-gel.md)) has parked `gel_title` on the h1 at `scaleX: 0`, in front of `gel_hero`, which stays full-bleed at rest. A leading call at time 0 re-measures it via `syncTitleGel(view)`, because SplitText has re-flowed the h1 since then. The gel then tweens `scaleX` 0 → 1 from `left center` over `HERO_INTRO.gelDuration`, with `immediateRender: false` so the start state stays with the landing park. The `text` label sits at the end of the wipe (at 0 when there is no gel). Every text beat below starts from it, and the context label fades in at `text`.

The letter cascade starts 0.3s before the context label's fade ends. The title's `<span data-hero-el="band">` line bands are not animated: their plain CSS background (see [hero.njk](../../../../views/organisms/section/hero.md)) shows from page load, split or not. The left-to-right line-band grow (`background-size` 0% → 100%, paced by `HERO_INTRO.bandLead`) was removed on 2026-10-26.

## Outro

`outro(view, gelManager)` reads the cached split for `view` and builds two scrub-driven beats, each closed with an `addLabel()` rest point for the pin's `snapTo: "labelsDirectional"` (plus an opening `outro` label):

1. `lines-out` — `split.lines` fade to `opacity: 0`, `stagger: { each: HERO_OUTRO.stagger, from: "end" }` (last line first).
2. `gel-open` — the `gel_hero` element (resolved via `getHeadingGelEl`, see `heading-gel.md`) tweens `scaleY` from its current value to `window.innerHeight / unscaledHeight`, growing from its own vertical center (`transformOrigin: "center center"`, already set by `attachHeadingGel`'s sync) to fill the viewport.

The scale value is function-based (re-evaluated by GSAP on each read), so `invalidateOnRefresh: true` on the pin keeps it correct across resize.

Earlier revisions carried two further beats — `mission-centered` and `aside-centered`, translating `[data-hero-el="mission-statement"]` and `[data-hero-el="aside"]` up to viewport center — along with a standalone `buildAsideReveal`. All are removed; `HERO_OUTRO.travelDuration` went with them.

Returns an empty, id-tagged timeline (no children) if no split is cached yet; `HeroTriggers._bindOutroPin` treats that as "no motion" and skips creating the pin — same contract as before.
