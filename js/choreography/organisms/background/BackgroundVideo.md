---
description: Background video section controller — owns the fullscreen video's playback and broadcasts its playstate as video:media:* events; the deferred src is assigned by js/preloader/deferred-videos.js, which cues this section via preloader:video:hydrated.
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
every path, so it means *buffered*, not *settled*. A consumer gating on
playback must check `lifecycle.isReducedMotion` in the payload before treating
it as terminal — the preloader does.

The handshake listener binds in the constructor, which runs during Director init
— before `director:ready`, and so before the preloader can dispatch. No race.

## Why events mirror to `window`

`AnimationBus` is instance-created by `AnimationDirector` and injected. The
preloader runs as a deferred module in `<head>`, well before that bus exists,
and a module-singleton bus is forbidden. So `_emitMedia()` emits on the bus
*and* dispatches a `CustomEvent` on `window`, following the precedent already
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
