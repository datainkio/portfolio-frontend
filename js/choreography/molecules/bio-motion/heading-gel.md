---
id: frontend.js.choreography.molecules.bio-motion.heading-gel
role: "Bio molecule part — holds the gel_bio gel as a full-bleed band filling the viewport (left/top 0, 100vw x 100vh), decoupled from scroll and re-measured only on resize, plus the band's landing-phase entrance that gates the bio intro. The gel is never ScrollTrigger-pinned: it is a child of the fixed-positioned #sizzle-background container, so it is already held in the viewport."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - bio-motion
  - gel
  - js
  - molecule
links:
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[managers/GelAnimationManager/GelAnimationManager|GelAnimationManager]]"
backlinks:
  - "[[molecules/bio-motion/split|molecules/bio-motion/split]]"
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
tracking is gone. Since the header is `h-dvh` the resting *size* is unchanged —
what changed is that the band no longer moves.

Two consequences worth knowing:

- **The per-tick layout read is gone.** `onUpdate` fired a forced reflow on every
  scroll tick for the whole length of the section; the band now only recomputes
  on resize.
- **The band is viewport-persistent.** Previously it scrolled out of view with the
  header. Now, once the entrance reveals it, it stays filling the viewport — it is
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
re-fill the viewport on resize. The one nearby trigger that *does* pin,
`bio-outro-pin` ([BioTriggers.md](../../organisms/bio/BioTriggers.md)), targets
the **bio section root** in normal document flow; it merely *animates* this gel's
`scaleY` as one of its beats. Do not read that pin as pinning the gel.

`gel.refresh()` (SVG mask re-measure) runs only when the viewport height changes.

## Suspend during the outro pin

`suspendHeadingGelSync(view)` / `resumeHeadingGelSync(view)` (module-level
`WeakSet`, keyed on `view`) gate `sync()` with an early return. `BioTriggers`'
outro pin (`bio-outro-pin`) drives `scaleY` on this gel band directly as one of
its beats (see `split.md`'s outro section), and the entrance below owns
`x`/`y`/`rotation` — without the suspend, `sync()` would reset those the next
time it ran. `BioTriggers` suspends on pin activate, resumes on pin deactivate
(and in `kill()`, so a matchMedia teardown mid-pin can't leave the gel stuck),
then force-refreshes the sync trigger by id — necessary now that `sync()` is a
resize hook, since nothing else would restore the band's resting geometry after
the pin released.

`getHeadingGelEl(gelManager)` exports the resolved gel element so the outro
timeline doesn't duplicate the `gelManager.getGel(HEADING_GEL_ID)` lookup.

## Entrance — bio's landing phase, and the intro's gate

`buildHeadingGelEntrance(view, gelManager)` returns a `TIMELINE_IDS.landing`
timeline holding a single `gsap.from`: the band starts
`BIO_GEL_ENTRANCE.yViewportRatio` (1.2) viewport heights below the fold, offset
right by `BIO_GEL_ENTRANCE.xViewportRatio` (0.33) of the viewport width, tilted
`BIO_GEL_ENTRANCE.rotation` (-16) degrees, and resolves to its
synced resting geometry on a short `power2.out`. It is wired as the `split`
variant's `init` in [bio-motion.js](bio-motion.md), so `BioAnimations._buildLanding`
picks it up with no bespoke plumbing.

It is played — and **awaited** — by
[LandingSequence](../../templates/landing/LandingSequence.md): after
`video:intro:complete` plus the `BIO_INTRO_HOLD` beat, it calls
`bio.playLanding()` and only then `bio.playIntro()`. `playLanding()`'s promise
resolves on the landing timeline's `onComplete` (via `AbstractSection`'s
`PromiseResolverQueue`), so the entrance gates the reveal rather than racing it.

Four ordering constraints make this one factory rather than a loose tween:

1. `attachHeadingGel` runs **first**, so the band already holds its resting
   geometry — `gsap.from` reads the current values as its end state.
2. `suspendHeadingGelSync(view)` runs **next**. Without it, `sync()` rewrites
   `x`/`y`/`rotation` on the next scroll tick and stomps the entrance mid-flight.
   The suspend also survives `intro()`'s later `attachHeadingGel` call — that
   re-attach's own initial `sync()` respects the same gate, so the offscreen
   start frame is not wiped in the window between build and play.
3. The `from` renders immediately (GSAP default), parking the band offscreen at
   **build** time — the gel is never briefly visible in its resting spot first.
   `_registerTimeline`'s `pause(0)` reinforces the same frame.
4. The completion hook lives on the **tween**, not the timeline:
   `AbstractSection._bindCallbacks` owns the landing timeline's
   `onStart`/`onComplete` and would overwrite a timeline-level one. On complete
   it resumes the sync and force-refreshes the trigger by id.

`sync()` resets `rotation: 0` alongside `x`/`y` so a suspend/kill mid-entrance
cannot leave the band tilted.

Reduced motion never reaches this: the profile swaps bio to the `reduced`
variant, whose `init` is `initReduced`. `playLanding()` also early-returns (and
resolves) whenever `timeline.enabled` is false, so a gated profile skips the
entrance without stalling the chain.

Reduced motion: handled upstream — the profile system swaps bio to the `reduced`
variant, which does not call this. The band itself is a static positioned state
outside the reduced path.

Visibility caveat: `.bg-gel` sets `mix-blend-mode: multiply`. Against a very dark
backdrop inside `#sizzle-background` the band can read as near-invisible; force
`mixBlendMode: "normal"` on the gel element if that happens.
