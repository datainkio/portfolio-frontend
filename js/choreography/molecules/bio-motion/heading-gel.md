---
description: "Bio molecule part — holds the gel_bio gel as a full-bleed band filling the viewport (left/top 0, 100vw x 100vh), decoupled from scroll and re-measured only on resize, parked at rest as bio's landing phase (no entrance). The gel is never ScrollTrigger-pinned: it is a child of the fixed-positioned #sizzle-background container, so it is already held in the viewport."
status: stable
tags:
  - choreography
  - bio-motion
  - gel
links:
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|GelAnimationManager]]"
---

`attachHeadingGel(view, gelManager)` resolves `gel_bio` (`HEADING_GEL_ID`) from
the manager, positions it to `left: 0 / top: 0 / width: 100vw / height:
<window.innerHeight>`, and reveals it (`autoAlpha: 1` — `GelAnimationManager`
parks every gel at 0).

## Decoupled from scroll

The band takes **no geometry from any DOM element** — not the bio `<header>`, not
the `<h2>`, not the section root. It fills the viewport and stays there. Nothing
re-measures it as the page scrolls.

This replaces two earlier revisions in the same tuning arc: the band was first
anchored to the `<h2>`'s box (a text-height stripe), then to the `[data-bio-el="header"]`
block (`h-dvh`, hence full-bleed). Both re-read `getBoundingClientRect()` on every
scroll tick and rewrote `top` so the band tracked the element up the page. That
tracking is gone. Since the header is `h-dvh` the resting _size_ is unchanged —
what changed is that the band no longer moves.

Two consequences worth knowing:

- **The per-tick layout read is gone.** `onUpdate` fired a forced reflow on every
  scroll tick for the whole length of the section; the band now only recomputes
  on resize.
- **The band is viewport-persistent.** Previously it scrolled out of view with the
  header. Now it is parked at rest when bio's timelines build and stays filling the viewport — it is
  a standing background plane for the rest of the page, not a bio-scoped element.
  If it should instead fade out past the section, that is a visibility concern
  (an `autoAlpha` toggle), deliberately kept separate from geometry.

The gel is `absolute` inside `#sizzle-background`, which is `fixed inset-0`, so
filling that container is all "full-bleed" requires and no scroll offset is ever
added. The `bio-heading-gel-sync` ScrollTrigger survives **only as a resize
hook**: `ScrollTrigger.refresh()` (on resize, and via `BioTriggers`' explicit
`getById(...).refresh()`) re-runs `sync()` so the band re-fills a changed
viewport. It carries no `onUpdate` and no `onToggle`. The trigger is still killed
by id before being recreated, so matchMedia/resize rebuilds do not stack
duplicates.

## Never pinned

"Anchors" here is positional language, not `ScrollTrigger`'s `pin`. **No gel is
ever a ScrollTrigger pin target**, and none should be: every gel is a child of
`#sizzle-background` (`fixed inset-0`), so it is already positioned against the
viewport and cannot scroll. Pinning it would be redundant at best, and at worst
would inject a pin-spacer into the background layer.

`bio-heading-gel-sync` sets no `pin` (defaults `false`) — it exists only to
re-fill the viewport on resize. The one nearby trigger that _does_ pin,
`bio-outro-pin` ([BioTriggers.md](../../organisms/bio/BioTriggers.md)), targets
the **bio section root** in normal document flow; it merely _animates_ this gel's
`scaleY` as one of its beats. Do not read that pin as pinning the gel.

`gel.refresh()` (SVG mask re-measure) runs only when the viewport height changes.

## Suspend during the outro pin

`suspendHeadingGelSync(view)` / `resumeHeadingGelSync(view)` (module-level
`WeakSet`, keyed on `view`) gate `sync()`. **Suspension defers, it does not
discard:** a `sync()` called while suspended records that one is owed (a `pending`
`WeakSet`) and `resume` runs it immediately, using the live closure held in a
`syncs` `WeakMap`. A resize during a suspend window is applied when the window closes rather than
lost.

`BioTriggers`'
outro pin (`bio-outro-pin`) drives `scaleY` on this gel band directly as one of
its beats (see `split.md`'s outro section) — without the suspend, `sync()` would
reset it the next time it ran. `BioTriggers` suspends on pin activate, resumes on pin deactivate
(and in `kill()`, so a matchMedia teardown mid-pin can't leave the gel stuck),
then force-refreshes the sync trigger by id — necessary now that `sync()` is a
resize hook, since nothing else would restore the band's resting geometry after
the pin released.

`getHeadingGelEl(gelManager)` exports the resolved gel element so the outro
timeline doesn't duplicate the `gelManager.getGel(HEADING_GEL_ID)` lookup.

## Landing phase — at rest, no entrance

`buildHeadingGelRest(view, gelManager)` is the `split` variant's `init` in
[bio-motion.js](bio-motion.md), so `BioAnimations._buildLanding` picks it up. It
calls `attachHeadingGel`, which parks the band full-bleed at its resting geometry
(`autoAlpha: 1`), and returns an empty `TIMELINE_IDS.landing` timeline so the
phase contract holds for `AbstractSection`.

There is no entrance. The band is in place from the moment bio's timelines
build, and [LandingSequence](../../templates/landing/LandingSequence.md) no
longer calls `bio.playLanding()`: after `video:intro:complete` plus the
`BIO_INTRO_HOLD` beat it goes straight to `bio.playIntro()`. The fly-in
(`buildHeadingGelEntrance` / `BIO_GEL_ENTRANCE`) was removed on 2026-09-28; it is
in git history if a landing gesture returns.

Reduced motion: handled upstream — the profile system swaps bio to the `reduced`
variant, which does not call this. The band itself is a static positioned state
outside the reduced path.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`. Against a very dark
backdrop inside `#sizzle-background` the band can read as near-invisible; force
`mixBlendMode: "normal"` on the gel element if that happens.
