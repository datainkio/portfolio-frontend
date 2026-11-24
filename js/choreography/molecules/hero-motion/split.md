---
description: "Split variant for hero-motion — the intro opens with the title band (a solid, inset-shadowed plate in hero.njk) revealed left-to-right (clip-path) into a full-width band behind the header's label + h1 block, then SplitText word-splits the manifesto title, matches keyword words, and color-highlights them via a design-token color. The Blockframes reveal has moved to the Process section (choreography/molecules/process-motion) and is no longer driven from here. Also exports outro(view): a one-beat scrub timeline (line fade) consumed by HeroTriggers' scrub-driven outro pin. The mission-statement and aside travel beats, and the standalone aside scroll reveal (buildAsideReveal), have been removed."
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
  - "[[molecules/hero-motion/mission-statement|molecules/hero-motion/mission-statement]]"
---

## Heading split lifecycle

`intro()` builds the H2's `SplitText` via a module-level `buildHeadingSplit(view, title)` helper (keyed on `view` in a `WeakMap`) instead of calling `new SplitText` inline. `_buildTimeline()` re-runs `intro()` on every matchMedia breakpoint crossing against the same already-split DOM — without caching + `revert()`-ing the prior instance first, a rebuild would nest split markup inside itself and corrupt both the intro chars and the outro's line targets.

## Intro: tagline gel, band wipe, then letters

> **Deprecated (2026-11-11):** the title band strategy is deprecated and won't be implemented. `hero.njk` no longer renders `[data-hero-el="band"]`, so the wipe below is skipped and `text` sits right after the tagline gel fade. The band code in `split.js` remains until it is removed. See [homepage-initialization](../../../../specs/animation/homepage-initialization.animation.md).

The intro opens with `gel_tagline` fading from opacity 0 to 1 (`addTaglineGelFade`, see [tagline-gel](tagline-gel.md)). A `header` label follows it, and the band wipe starts there, so the gel lands before the header's band and text.

Next comes the title band, `[data-hero-el="band"]` (`HERO_SELECTORS.band`): a solid, full-bleed plate in [hero.njk](../../../../views/organisms/section/hero.md) behind the context label and the h1. Its inset shadows make it read as a cut through the background video to the layer beneath. It's in the header's normal flow, so it scrolls with the text and nothing has to be measured. A `fromTo` tweens `clipPath` from `inset(0% 100% 0% 0%)` to `inset(0% 0% 0% 0%)` over `HERO_INTRO.bandDuration`. The intro uses `clip-path`, not `scaleX`, so the band's parallax image is revealed instead of squashed. Because `fromTo` renders its start at build time, the band is hidden before the intro plays. Without the intro (no JS, `reduced`), the band shows at full width. The `text` label sits at the end of the wipe (at 0 when there is no band). Every text beat below starts from it, and the context label fades in at `text`.

The letter cascade starts 0.3s before the context label's fade ends. The per-line h1 bands and their `background-size` grow (paced by `HERO_INTRO.bandLead`) were removed on 2026-10-26, and so was the interim `gel_title` gel.

## Outro

`outro(view)` reads the cached split for `view` and builds one scrub-driven beat, closed with an `addLabel()` rest point for the pin's `snapTo: "labelsDirectional"` (plus an opening `outro` label). The `gel-open` beat (the hero gel growing to fill the viewport) was removed on 2026-11-24; `HERO_OUTRO.gelDuration` went with it.

1. `lines-out` — `split.lines` fade to `opacity: 0`, `stagger: { each: HERO_OUTRO.stagger, from: "end" }` (last line first).

Earlier revisions carried two further beats — `mission-centered` and `aside-centered`, translating `[data-hero-el="mission-statement"]` and `[data-hero-el="aside"]` up to viewport center — along with a standalone `buildAsideReveal`. All are removed; `HERO_OUTRO.travelDuration` went with them.

Returns an empty, id-tagged timeline (no children) if no split is cached yet; `HeroTriggers._bindOutroPin` treats that as "no motion" and skips creating the pin — same contract as before.
