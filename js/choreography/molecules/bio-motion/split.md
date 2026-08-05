---
id: frontend.js.choreography.molecules.bio-motion.split
role: "Split variant for bio-motion — SplitText word-splits the manifesto title, matches keyword words, and color-highlights their letter-cores (punctuation excluded) via a design-token color. Splits the body copy + aside into a separate scroll-triggered reveal (buildAsideReveal) that fires once when the body <p> enters the viewport, no scrub/pin. The Blockframes reveal has moved to the Process section (choreography/molecules/process-motion) and is no longer driven from here. Also exports outro(view): fades the split's lines to opacity 0, last line first, consumed by BioTriggers' scrub-driven outro pin."
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

`outro(view)` reads the cached split for `view` and fades `split.lines` to `opacity: 0` with `stagger: { each: BIO_OUTRO.stagger, from: "end" }` — last line first. Returns an empty, id-tagged timeline (no children) if no split is cached yet; `BioTriggers._bindOutroPin` treats that as "no motion" and skips creating the pin.
