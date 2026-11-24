---
description: Background video section controller — owns the fullscreen video's playback and broadcasts its playstate as video:media:* events, and holds the section in its static two-point perspective rest pose from before the reveal, owning gel_video, which the intro snaps visible inside a clip-path whose cells the intro pops open right to left; the deferred src is assigned by js/preloader/deferred-videos.js, which cues this section via preloader:video:hydrated.
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

The video gel follows the same paths; see [Video gel](#video-gel).

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

## Video gel

This section owns `gel_video`. The gel sits inside the section root,
`GelAnimationManager` parks it at `autoAlpha: 0`, and nothing else shows it. The
constructor resolves it with `gelManager.getGel(VIDEO_GEL_ID)` (`VIDEO_GEL_ID` is
in `config/contracts/selectors`) before `super()`, because `super()` can already
run the gated path, and hands it to `BackgroundVideoAnimations`, which keeps the
state. It replaced the hero's full-bleed gel on 2026-11-24 and is not part of the hero sequence.

| Path                                  | Hook                                            | Gel                                                             |
| ------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| Played (all tiers)                    | first step of the intro timeline                | snapped visible (with the video) while the clip still hides it |
| Reduced motion / session-gated replay | `_applyPostIntroState` (and `_onIntroComplete`) | snaps to visible, clip removed                                   |
| Held event released (inert)           | `_releaseIntroComplete`                         | clip removed, video and gel snapped visible first                |
| Breakpoint crossing / reduced change  | `_applyResponsiveLifecycle` → `_syncVideoGel`   | re-asserted (gel visible, clip removed once the reveal is done)  |
| Resize                                | `_bindPerspectiveResize` handler                | re-asserted (gel visible, clip removed once the reveal is done)  |

**Clip cells are the only reveal.** The video and gel are never tweened: the intro
snaps them visible at time 0 inside the `clip-path` on `[data-video-grid]`, then pops
cells open right to left (`BACKGROUND_GRID_REVEAL`). `revealAll()` removes the
clip on gated paths, so `_onIntroComplete` reveals nothing on the
played path.

**Once revealed it never re-covers.** The intro is built at construction, outside
any `gsap.matchMedia` context. The matchMedia passes run inside this section's
context, which reverts a previous pass's gated snap before re-running;
`_syncVideoGel` runs in that same synchronous pass, so the revert never paints.

Reduced motion reaches the gated path because `video` has no `reduced` override:
it resolves to the `reduced` profile, whose timeline channel is disabled, so
`AbstractSection` calls `_applyPostIntroState` at construction and again from
`playIntro()`.

Drift: `SECTION_OVERRIDES.video` makes `sm` and wider perspective tiers (since
commit `1a3a033d`). The `lg` wording above and in the
[spec](../../../../specs/animation/background-video-perspective-spec.md) predates
that.
