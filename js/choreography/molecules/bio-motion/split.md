---
id: frontend.js.choreography.molecules.bio-motion.split
role: "Split variant for bio-motion — SplitText word-splits the manifesto title, matches keyword words, and color-highlights their letter-cores (punctuation excluded) via a design-token color. The Blockframes reveal has moved to the Process section (choreography/molecules/process-motion) and is no longer driven from here. Also exports outro(view, gelManager): a four-beat scrub timeline (line fade, gel expand, mission-statement travel, aside travel + fade-in) consumed by BioTriggers' scrub-driven outro pin. The standalone aside scroll reveal (buildAsideReveal) was removed — its fade now lives inside the outro's final beat."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - bio-motion
  - biography
  - choreography
  - frontend
  - highlight
  - introduction
  - js
  - splittext
  - variant
links:
  - "[[bio-motion]]"
  - "[[molecules/bio-motion/heading-gel|molecules/bio-motion/heading-gel]]"
  - "[[molecules/bio-motion/overview-gel|molecules/bio-motion/overview-gel]]"
backlinks:
  - "[[bio-motion]]"
---

## Heading split lifecycle

`intro()` builds the H2's `SplitText` via a module-level `buildHeadingSplit(view, title)` helper (keyed on `view` in a `WeakMap`) instead of calling `new SplitText` inline. `_buildTimeline()` re-runs `intro()` on every matchMedia breakpoint crossing against the same already-split DOM — without caching + `revert()`-ing the prior instance first, a rebuild would nest split markup inside itself and corrupt both the intro chars and the outro's line targets.

## Outro

`outro(view, gelManager)` reads the cached split for `view` and builds four scrub-driven beats, each closed with an `addLabel()` rest point for the pin's `snapTo: "labelsDirectional"`:

1. `lines-out` — `split.lines` fade to `opacity: 0`, `stagger: { each: BIO_OUTRO.stagger, from: "end" }` (last line first).
2. `gel-open` — the `gel_bio` element (resolved via `getHeadingGelEl`, see `heading-gel.md`) tweens `scaleY` from its current value to `window.innerHeight / unscaledHeight`, growing from its own vertical center (`transformOrigin: "center center"`, already set by `attachHeadingGel`'s sync) to fill the viewport.
3. `mission-centered` — `[data-bio-el="mission-statement"]` and `[data-bio-el="aside"]` both translate `y: -window.innerHeight`. Mission statement is `h-dvh content-center` sitting exactly one viewport below the `h-dvh` header, so this lands it on-screen, centered by its own layout.
4. `aside-centered` — the same two elements travel the remaining distance so the aside's own vertical center matches the viewport center (measured live off `aside.getBoundingClientRect()`), while `aside.children` fade+lift in via `.from()` (`opacity: 0, y: 100`) — timeline-nested `.from()` tweens don't `immediateRender`, so this needs no separate initial-state call.

All positional/scale values are function-based (re-evaluated by GSAP on each read), so `invalidateOnRefresh: true` on the pin keeps them correct across resize.

Returns an empty, id-tagged timeline (no children) if no split is cached yet; `BioTriggers._bindOutroPin` treats that as "no motion" and skips creating the pin — same contract as before.
