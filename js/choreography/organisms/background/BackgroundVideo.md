---
description: Background video section controller — owns the fullscreen video's playback and broadcasts its playstate as video:media:* events, and holds the section in its static two-point perspective rest pose from before the reveal, revealing gel_hero (whose visibility it owns) after the intro; the deferred src is assigned by js/preloader/deferred-videos.js, which cues this section via preloader:video:hydrated.
status: stable
tags:
  - choreography
links:
  - "[[AbstractSection|AbstractSection]]"
  - "[[config/index|config/index]]"
  - "[[BackgroundVideoAnimations|BackgroundVideoAnimations]]"
  - "[[BackgroundVideoTriggers|BackgroundVideoTriggers]]"
  - "[[BackgroundVideoEvent|BackgroundVideoEvent]]"
  - "[[deferred-videos|preloader/deferred-videos]]"
  - "[[Preloader|preloader/Preloader]]"
  - "[[profiles|profiles]]"
  - "[[heading-gel|molecules/hero-motion/heading-gel]]"
---

# BackgroundVideo

## Ownership seam with the preloader

The preloader owns **hydration** — which video gets a `src` and when, a
bandwidth staging decision (hero first, cards after the splash). This section
owns **everything after it**: whether to play, when, and what to report.

The seam is one window event in, `video:media:*` events out:

```
preloader: hydrate background <video>
         → dispatch preloader:video:hydrated
BackgroundVideo._onHydrated()
         ├─ no element / no src        → video:media:unavailable
         ├─ reduced motion             → video:media:ready (paused on purpose)
         ├─ already playing            → video:media:playing (immediately)
         └─ otherwise                  → play()
                                          → video:media:playing
                                          ├─ refused → video:media:error
                                          └─ silent for 4s → video:media:error
```

Playback is **not** gated on `canplay`. `play()` is valid on an unbuffered
element, and waiting for `canplay` first has no upper bound: an mp4 whose `moov`
atom sits after `mdat` (i.e. not written with `-movflags +faststart`) reaches
neither `loadedmetadata` nor `canplay` until the whole file has downloaded. The
4s failsafe covers the rest — LandingSequence's reveal has no timeout of its
own, so a silent path would leave the video hidden permanently, not just late.

**Already playing** means not paused, not ended, and `readyState >= HAVE_FUTURE_DATA`. A non-deferred `src` with `autoplay` (the hero, since `defer: false`) can start playing before this section is constructed. Its native `playing` then fires with nothing listening, and `play()` on a playing element fires no new one, so without this branch the gate would wait for the 4 s failsafe on every first visit. A consumer that already heard an earlier `playing` may hear a second; LandingSequence's reveal runs only once, so that's harmless.

**Every branch emits exactly one event.** A consumer gating on the video always
gets an answer, so its timeout stays a failsafe instead of the normal exit on a
page with no video.

`video:media:ready` is separately emitted by the element's own `canplay` on
every path, so it means _buffered_, not _settled_. A consumer gating on
playback must check `lifecycle.isReducedMotion` in the payload before treating
it as terminal — the preloader does.

The handshake listener binds in the constructor, which runs during Director init
— before `director:ready`, and so before the preloader can dispatch. No race.

## Why events mirror to `window`

`AnimationBus` is instance-created by `AnimationDirector` and injected. The
preloader runs as a deferred module in `<head>`, well before that bus exists,
and a module-singleton bus is forbidden. So `_emitMedia()` emits on the bus
_and_ dispatches a `CustomEvent` on `window`, following the precedent already
set by `director:ready` and `preloader:out`. In-system consumers should use the
bus; the window mirror is the boundary crossing.

Payload for both: [BackgroundVideoEvent](BackgroundVideoEvent.md).

## Reduced motion

`_onHydrated()` checks the media query directly rather than
`_isLifecycleMotionEnabled`. That flag also goes false for session-gated replay,
and a return visitor should still get a moving background.

Note that `playIntro()` still gates on `_isLifecycleMotionEnabled` and pauses —
so on a session-gated return visit it pauses a video `_onHydrated()` started.
Pre-existing behavior, unchanged here.

## Perspective rest pose

On perspective tiers the section root sits in its two-point perspective rest
pose ([spec](../../../../specs/animation/background-video-perspective-spec.md))
before the video is visible, so nothing animates into it. `_syncPerspective`
applies it with `snapPerspective()`, including once inside `super()` at
construction. The intro finishing re-asserts it (`_enterPerspective`); no new
event:

| Path                 | Hook                                                                 | Result                                    |
| -------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| First visit          | rest pose set before reveal; intro `onComplete` → `_onIntroComplete` | pose re-asserted, emits at once           |
| Reduced motion       | `_applyPostIntroState` (intro jumped to progress 1)                  | pose already static, emits at once        |
| Session-gated replay | `_applyPostIntroState`                                               | pose already static, emits at once        |
| Below `lg`           | `SECTION_OVERRIDES.video` variant `flat`                             | no tilt; transform cleared; emits at once |

The heading gel follows the same paths; see [Heading gel](#heading-gel).

**`video:intro:complete` is not held.** `_onIntroComplete` emits it as soon as
the intro completes. LandingSequence cues hero's intro from that event, with
`HERO_INTRO_HOLD` as the beat after it. The idle timeline is never played;
`snapPerspective()` finishes it, and its progress is the "settled" flag.
`_pendingIntroComplete` and `_releaseIntroComplete` remain but are inert.

`_isPerspectiveTier()` resolves the active breakpoint's profile with reduced
motion set aside: the `reduced` profile has no breakpoint, and reduced motion
does not change the pose. A matchMedia crossing clears the pose below `lg` and
re-applies it on perspective tiers. A plain `resize` re-sets the pose, since
perspective is proportional to width.

## Heading gel

This section is the single owner of `gel_hero`'s visibility. The gel sits inside
the section root, `GelAnimationManager` parks it at `autoAlpha: 0`, and nothing
else shows it. Hero's [heading-gel](../../molecules/hero-motion/heading-gel.md)
`sync()` positions it but never writes `autoAlpha`. The constructor resolves it
with `getHeadingGelEl(gelManager)` before `super()`, because `super()` can already
run the gated path, and hands it to `BackgroundVideoAnimations`, which keeps the
reveal state.

| Path                                  | Hook                                            | Gel                                                                                 |
| ------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| Played, perspective tier              | `stagePanes()` at construction                  | shown while the sheet and panes cover it; `_onIntroComplete`'s fade is then a no-op |
| Played, flat tier                     | `stagePanes()` at construction                  | same; nothing is held                                                               |
| Reduced motion / session-gated replay | `_applyPostIntroState` (and `_onIntroComplete`) | snaps to visible                                                                    |
| Held event released (inert)           | `_releaseIntroComplete`                         | snapped to 1 first                                                                  |
| Breakpoint crossing / reduced change  | `_applyResponsiveLifecycle` → `_syncHeadingGel` | re-asserted once revealed                                                           |
| Resize                                | `_bindPerspectiveResize` handler                | re-asserted once revealed, unless the fade is still running                         |

**Played path: shown at staging.** With the landing panes present,
`stagePanes()` calls `showHeadingGel()` while the sheet and panes cover the
page, before the preloader hides, so the gel never visibly pops;
`fadeInHeadingGel()` in `_onIntroComplete` then finds the gel already shown and
does nothing. The fade described below applies only when there are no panes.

**All tiers fade (no panes).** The gel could simply appear, but a
cut right after the video's soft fade-in reads as a pop. It fades with the same
`BACKGROUND_HEADING_GEL_REVEAL` timing instead, so it arrives the same way at
every width. `video:intro:complete` is not held for it, so the fade finishes
during `HERO_INTRO_HOLD` and the start of hero's intro.

**Once revealed it never re-hides.** The fade is a standalone tween, not a child
of the idle timeline, so `clearPerspective()` (which rewinds idle) can't hide it.
The matchMedia passes run inside this section's `gsap.matchMedia` context, which
reverts a previous pass's gated snap before re-running; `_syncHeadingGel` runs
in that same synchronous pass, so the revert never paints.

Reduced motion reaches the gated path because `video` has no `reduced` override:
it resolves to the `reduced` profile, whose timeline channel is disabled, so
`AbstractSection` calls `_applyPostIntroState` at construction and again from
`playIntro()`.

## Landing panes

On the played path, a flat graph-paper sheet (`data-video-el="sheet"`, a sibling
after the section root so it stays outside the tilt) covers three transient
colour panes (slate, yellow, orange-red; `data-video-el="pane"`, inside the root,
above the gels). `_syncPanes` stages them: it runs from `_applyResponsiveLifecycle`
(so also inside `super()` at construction, which is before `director:ready` and
so before the preloader hides), and calls `stagePanes()` only when the section is
enabled, `_isLifecycleMotionEnabled` is true (not reduced motion, not
session-gated) and the intro is still pristine. The preloader therefore exits
onto a surface identical to the page. When a pass finds a gated state it calls
`unstagePanes()`; a pass during the intro leaves them to the timeline.

The intro is one timeline: the video fades in from 0, the sheet is clipped away
right to left from 0, and the panes contract toward the left edge one after
another, the first starting when the sheet is half gone (each starts when the
previous is half done). There is no veil. `video:intro:complete` fires when that
whole timeline completes, after the last pane has gone. Values:
`BACKGROUND_PANES`. Gated paths (reduced motion, session-gated replay) jump the
intro to its end, so the sheet and panes are hidden and nothing tweens.

Drift: `SECTION_OVERRIDES.video` makes `sm` and wider perspective tiers (since
commit `1a3a033d`). The `lg` wording above and in the
[spec](../../../../specs/animation/background-video-perspective-spec.md) predates
that.
