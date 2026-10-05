---
description: "Split variant for hero-motion — SplitText word-splits the manifesto title, matches keyword words, and color-highlights them via a design-token color. The Blockframes reveal has moved to the Process section (choreography/molecules/process-motion) and is no longer driven from here. Also exports outro(view, gelManager): a two-beat scrub timeline (line fade, gel expand) consumed by HeroTriggers' scrub-driven outro pin. The mission-statement and aside travel beats, and the standalone aside scroll reveal (buildAsideReveal), have been removed."
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
  - "[[molecules/hero-motion/mission-statement|molecules/hero-motion/mission-statement]]"
---

## Heading split lifecycle

`intro()` builds the H2's `SplitText` via a module-level `buildHeadingSplit(view, title)` helper (keyed on `view` in a `WeakMap`) instead of calling `new SplitText` inline. `_buildTimeline()` re-runs `intro()` on every matchMedia breakpoint crossing against the same already-split DOM — without caching + `revert()`-ing the prior instance first, a rebuild would nest split markup inside itself and corrupt both the intro chars and the outro's line targets.

## Intro: line bands, then letters

The title's `<span data-hero-el="band">` (an opaque `bg-neutral-900` band, see [hero.njk](../../../../views/organisms/section/hero.md)) is cloned once per line by SplitText's `deepSlice`, so each line holds its own band. The intro:

1. Grows each line's band left to right, one line after another, starting at the `bands` label. The grow reads the band's computed colour (so the template's `bg-*` utility is the only place it's set), swaps it for a same-colour gradient, and tweens its `background-size` from `0% 100%` to `100% 100%`, never `scaleX` or `clip-path`, so letters are never squashed or cut. Each band lasts as long as its own line's letter cascade (`chars × stagger`, `ease: "none"`).
2. Starts the letter cascade at `bands+=HERO_INTRO.bandLead` (0.25s), so the text trails the background by a constant step down every line.

The band's plain CSS background stays in place whenever the heading isn't split (no JS, `reduced` variant).

## Outro

`outro(view, gelManager)` reads the cached split for `view` and builds two scrub-driven beats, each closed with an `addLabel()` rest point for the pin's `snapTo: "labelsDirectional"` (plus an opening `outro` label):

1. `lines-out` — `split.lines` fade to `opacity: 0`, `stagger: { each: HERO_OUTRO.stagger, from: "end" }` (last line first).
2. `gel-open` — the `gel_hero` element (resolved via `getHeadingGelEl`, see `heading-gel.md`) tweens `scaleY` from its current value to `window.innerHeight / unscaledHeight`, growing from its own vertical center (`transformOrigin: "center center"`, already set by `attachHeadingGel`'s sync) to fill the viewport.

The scale value is function-based (re-evaluated by GSAP on each read), so `invalidateOnRefresh: true` on the pin keeps it correct across resize.

Earlier revisions carried two further beats — `mission-centered` and `aside-centered`, translating `[data-hero-el="mission-statement"]` and `[data-hero-el="aside"]` up to viewport center — along with a standalone `buildAsideReveal`. All are removed; `HERO_OUTRO.travelDuration` went with them.

Returns an empty, id-tagged timeline (no children) if no split is cached yet; `HeroTriggers._bindOutroPin` treats that as "no motion" and skips creating the pin — same contract as before.
