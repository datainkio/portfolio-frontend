---
id: frontend.js.choreography.molecules.bio-motion.split
role: "Split variant for bio-motion — SplitText word-splits the manifesto title, matches keyword words, and color-highlights them via a design-token color. The Blockframes reveal has moved to the Process section (choreography/molecules/process-motion) and is no longer driven from here. Also exports outro(view, gelManager): a two-beat scrub timeline (line fade, gel expand) consumed by BioTriggers' scrub-driven outro pin. The mission-statement and aside travel beats, and the standalone aside scroll reveal (buildAsideReveal), have been removed."
status: stable
surface: internal
scope: frontend
runtime: browser
animation:
  - highlight
tags:
  - bio-motion
  - biography
  - choreography
  - frontend
  - introduction
  - js
  - splittext
  - variant
links:
  - "[[bio-motion]]"
  - "[[molecules/bio-motion/heading-gel|molecules/bio-motion/heading-gel]]"
  - "[[molecules/bio-motion/mission-statement|molecules/bio-motion/mission-statement]]"
backlinks:
  - "[[bio-motion]]"
---

## Heading split lifecycle

`intro()` builds the H2's `SplitText` via a module-level `buildHeadingSplit(view, title)` helper (keyed on `view` in a `WeakMap`) instead of calling `new SplitText` inline. `_buildTimeline()` re-runs `intro()` on every matchMedia breakpoint crossing against the same already-split DOM — without caching + `revert()`-ing the prior instance first, a rebuild would nest split markup inside itself and corrupt both the intro chars and the outro's line targets.

## Outro

`outro(view, gelManager)` reads the cached split for `view` and builds two scrub-driven beats, each closed with an `addLabel()` rest point for the pin's `snapTo: "labelsDirectional"` (plus an opening `outro` label):

1. `lines-out` — `split.lines` fade to `opacity: 0`, `stagger: { each: BIO_OUTRO.stagger, from: "end" }` (last line first).
2. `gel-open` — the `gel_bio` element (resolved via `getHeadingGelEl`, see `heading-gel.md`) tweens `scaleY` from its current value to `window.innerHeight / unscaledHeight`, growing from its own vertical center (`transformOrigin: "center center"`, already set by `attachHeadingGel`'s sync) to fill the viewport.

The scale value is function-based (re-evaluated by GSAP on each read), so `invalidateOnRefresh: true` on the pin keeps it correct across resize.

Earlier revisions carried two further beats — `mission-centered` and `aside-centered`, translating `[data-bio-el="mission-statement"]` and `[data-bio-el="aside"]` up to viewport center — along with a standalone `buildAsideReveal`. All are removed; `BIO_OUTRO.travelDuration` went with them.

Returns an empty, id-tagged timeline (no children) if no split is cached yet; `BioTriggers._bindOutroPin` treats that as "no motion" and skips creating the pin — same contract as before.
