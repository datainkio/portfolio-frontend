---
description: "Bio molecule part — the mission statement's gel-led arrival: the gel_subheading band wipes in from the left, the overview <h3> rides in behind its tail, then the body copy staggers up. Cued by its own ScrollTrigger (once), not by bio's intro timeline, because the section sits an h-dvh below the header and is off-screen when the intro plays."
status: stable
tags:
  - choreography
  - bio-motion
  - gel
links:
  - "[[molecules/bio-motion/overview-gel|molecules/bio-motion/overview-gel]]"
  - "[[molecules/bio-motion/heading-gel|molecules/bio-motion/heading-gel]]"
  - "[[config/ix/motion|config/ix/motion]]"
---

`attachMissionStatement(view, gelManager)` builds the reveal for
`[data-bio-el="mission-statement"]` and binds the ScrollTrigger that plays it.
Called from [split.js](split.md)'s `intro()` alongside `attachHeadingGel` — it
replaces the bare `attachOverviewGel` call there and now attaches that band
itself, as the arrival's first beat.

## Why it is not on the intro timeline

Bio's intro is cued by the **landing chain** (video intro → hold → gel entrance →
`bio.playIntro()`; see [LandingSequence.md](../../templates/landing/LandingSequence.md)),
not by scroll. The mission statement sits a full `h-dvh` below the header, so it
is comfortably off-screen at that moment. Anything sequenced into the intro
timeline would play unseen and be finished by the time the reader scrolled to it.

So this owns a separate `ScrollTrigger` (`id: bio-mission-reveal`, `once: true`,
`start: BIO_MISSION_REVEAL.start`) on the mission-statement element, playing a
`paused: true` timeline on enter. That mirrors how the gel attachers are wired —
positioned outside the lifecycle timelines, as standing behaviours.

## The three beats

1. **Band wipe** — `gel_subheading` `fromTo` `scaleX: 0 → 1`, `transformOrigin:
"left center"`. The band leads deliberately: it rhymes with the heading gel's
   entrance ([heading-gel.md](heading-gel.md)) so the two headings read as one
   gesture at two scales.
2. **Overview `<h3>`** — `from` `autoAlpha: 0` + `y: distance`, starting
   `BIO_MISSION_REVEAL.overlap` (0.2) of the wipe's duration before it ends, so
   the heading rides the band's tail rather than queueing behind it. Same overlap
   idiom as [sweep.js](sweep.md).
3. **Body copy** — `from` the statement's `:scope > p` children, staggered.

`:scope >` scopes the paragraph query to the statement's own children: the body
is arbitrary Sanity rich text and may nest markup of its own.

**Stagger is `{ amount }`, not `{ each }`.** The paragraph count comes from
Sanity and is variable; a per-item delay would let a long statement drag well
past the reader. GSAP distributes the total across however many exist.

## Suspend contract with the overview gel

The wipe owns `scaleX`/`autoAlpha` on the band, and `overview-gel.js`'s `sync()`
sets both on every scroll tick — it would stomp the wipe mid-flight. So this
calls `suspendOverviewGelSync(view)` before building and parks the band at
`autoAlpha: 0`; the wipe tween's **own** `onComplete` resumes the sync and
force-refreshes it by id (`OVERVIEW_SYNC_ST_ID`), handing resting geometry back.
This is the same contract `heading-gel.js` uses for its entrance — the suspend
`WeakSet` and its two exports were added to `overview-gel.js` to match.

## Rebuilds (viewport resize across a breakpoint)

A breakpoint crossing runs `Bio._applyResponsiveLifecycle` → `animations.rebuild()`
→ `split.js` `intro()`, which calls back in here. A naive re-attach would re-hide
copy the reader has already read and re-arm a trigger they have already scrolled
past — leaving the statement blank permanently, since the reveal only ever plays
once.

A module-level `revealed` `WeakSet` guards that. It is marked in the trigger's
`onEnter` — **on request, not on completion** — so a rebuild landing mid-play
also takes the already-revealed path rather than restarting from hidden. On that
path the function re-attaches the overview gel (which is what re-measures the
band at the new viewport), resumes its sync, clears the reveal's inline
start-frame props off the copy, and returns without building a timeline or
binding a trigger.

## Reduced motion

Everything rests at its natural state: no start frame is applied, no trigger is
bound, and `attachOverviewGel` has already revealed the band. The early return is
belt-and-braces — in practice the profile system swaps bio to the `reduced`
variant, which never reaches `split.js` at all.

## Progressive enhancement

The hidden start states are applied by GSAP (`from` / `fromTo`), never by CSS. If
JS never runs, the mission statement renders at its natural, fully visible state
— which matters more here than elsewhere, since it is the section's actual
argument.
