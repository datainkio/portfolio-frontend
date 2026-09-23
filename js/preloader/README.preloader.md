---
title: "Preloader package"
description: "What the home-page preloader does, the three contracts it participates in (markup, CSS outro, choreography events), and the timing bounds that keep it from ever holding the page."
type: index
tags:
  - preloader
  - choreography
links:
  - "[[Preloader|preloader/Preloader]]"
  - "[[constants|preloader/constants]]"
  - "[[deferred-videos|preloader/deferred-videos]]"
---

# Preloader package

Three files. The visuals are not here — they are pure CSS in
[hanko.css](../../styles/components/hanko.css). This package decides *when*.

## Sequence

```mermaid
sequenceDiagram
    autonumber
    participant B as Browser
    participant PP as session-management-script.njk<br/>(inline, pre-paint)
    participant CSS as hanko.css
    participant P as Preloader.js
    participant SM as SessionManager
    participant F as document.fonts
    participant AD as AnimationDirector
    participant DV as deferred-videos.js
    participant LS as LandingSequence /<br/>HomeHeaderManager

    B->>B: parse #lt;header data-preloader#gt;
    B->>CSS: first paint — hanko-loading-pulse starts (no JS)
    B->>PP: run inline script
    PP->>PP: sessionStorage.dataink_session.visited === true ?
    opt return visit (SESSION_GATING_ENABLED only)
        PP->>CSS: set data-preloader-state="exit" before paint
    end

    Note over B,P: deferred #lt;script type="module"#gt; — AnimationDirector and<br/>Preloader evaluate in either order, readyState is already "interactive"
    B->>AD: import AnimationDirector.js
    B->>P: initPreloader()

    alt no [data-preloader] on page (work, contact)
        P->>DV: hydrateDeferredVideos()
        DV-->>B: every video[data-defer-video] gets src
        Note over P: return — nothing to gate
    else home page
        P->>SM: hasVisited() → isReturnVisit, then markVisited()
        Note over SM: SESSION_GATING_ENABLED=false → always false / no-op
        opt first visit
            P->>B: lock html/body overflow, capture scrollY
        end

        rect rgb(235, 242, 250)
            Note over P,AD: readiness — every gate bounded
            P->>F: await fonts.ready
            F-->>P: resolved, or fontsReadyTimeoutMs (2000) elapsed
            P->>AD: await director:ready
            AD->>AD: construct bus, stage, sections, managers, LandingSequence
            AD-->>P: window "director:ready", or directorReadyTimeoutMs (8000) → console.warn
        end

        P->>DV: hydrateDeferredVideos(deferredBackgroundVideo)
        DV-->>B: background video only gets src — cards wait
        P->>B: background video play()
        B-->>P: play() resolved (playback begun), rejected (refused),<br/>or videoPlayingTimeoutMs (4000) elapsed

        P->>CSS: await intro — subtitle animation `finished`,<br/>or introFallbackMs (1000)

        alt root not hidden (first visit)
            P->>CSS: set data-preloader-state="exit"
            CSS->>CSS: outro — subtitle, author, logo fade out in turn<br/>(0.4s each, 0.2s stagger)
            CSS-->>P: logo animation `finished`, or outroFallbackMs (1000)
            P->>B: preloader.hidden = true
        else root already hidden (return visit, pre-paint)
            Note over P: outro skipped
        end

        P->>LS: window "preloader:out" (exactly once)
        LS->>LS: LandingSequence.start() and HomeHeaderManager._arm()
        Note over LS: CSS → GSAP ownership seam — landing chain begins

        Note over P: finally — runs even if a gate throws
        P->>B: restore overflow + scrollY
        P->>B: main[aria-busy="false"]
        P->>DV: hydrateDeferredVideos() + observeInViewVideos()
        DV-->>B: card videos get src + play() near the viewport, pause off it
    end
```

## States

The same flow as a state machine. The state the CSS reads is
`data-preloader-state` (unset → `exit`); everything else is JS-internal.

```mermaid
stateDiagram-v2
    direction TB

    [*] --> Intro : first paint — S00, children fade in S01→S03 (CSS, no JS)

    state "Intro → Idle (data-preloader-state unset) — S00…S04, pulse from 0.8s" as Intro
    state "Booting — initPreloader()" as Booting
    state "NoSplash — page has no [data-preloader]" as NoSplash
    state "Locked — html/body overflow hidden, scrollY captured" as Locked
    state "Waiting — bounded readiness gates" as Waiting {
        direction LR
        [*] --> Fonts
        Fonts --> Director : fonts.ready resolved<br/>or fontsReadyTimeoutMs (2000)
        Director --> Video : director#colon;ready received<br/>or directorReadyTimeoutMs (8000) + console.warn
        Video --> IntroDone : hydrate background video, play() settled<br/>or videoPlayingTimeoutMs (4000)
        IntroDone --> [*] : subtitle animation finished<br/>or introFallbackMs (1000)
    }
    state "Outro (data-preloader-state=exit) — S03→S00, intro in reverse" as Settling
    state "Exited — root hidden" as Exited
    state "Released — scroll unlocked, main[aria-busy=false], card videos hydrated" as Released

    Intro --> Exited : pre-paint script sees visited=true — root hidden<br/>(return visit, SESSION_GATING_ENABLED only)
    Intro --> Booting : deferred module evaluates

    Booting --> NoSplash : no [data-preloader]
    NoSplash --> [*] : hydrateDeferredVideos()

    Booting --> Locked : home, first visit
    Booting --> Waiting : home, return visit (gating on)
    Locked --> Waiting

    Waiting --> Settling : root visible — set data-preloader-state=exit
    Waiting --> Exited : root already hidden — outro skipped

    Settling --> Exited : logo animation finished<br/>or outroFallbackMs (1000), then hidden

    Exited --> Released : dispatch preloader#colon;out (once)<br/>then finally
    Waiting --> Released : gate threw — finally still runs<br/>(preloader#colon;out NOT dispatched)

    Released --> [*]

    note right of Exited
        preloader:out is the CSS → GSAP seam.
        LandingSequence.start() and
        HomeHeaderManager._arm() fire here.
    end note
    note left of Waiting
        Neither gate may hold the page.
        The hero is visible throughout,
        so a tripped bound only delays
        the landing chain.
    end note
```

## Contracts

**Markup** — [preloader.njk](../../views/organisms/status/preloader.njk).
A `<div data-preloader>` holding `[data-preloader-logo]`,
`[data-preloader-author]`, `[data-preloader-subtitle]`. The subtitle is the
last child in (intro gate) and the logo the last child out (outro gate); the
root gets `hidden` once the outro lands.
[session-management-script.njk](../../views/templates/partials/session-management-script/session-management-script.njk)
runs inline in `<head>` and sets `hidden` before first paint on return visits,
reading the same `sessionStorage` key as `SessionManager`.

**CSS** — `hanko.css` owns every state (S00–S04, see
[preloader.md](../../views/organisms/status/preloader.md)). Intro and idle are
keyframes that start at first paint with no attribute; `data-preloader-state="exit"`
runs the outro. `constants.js` `introFallbackMs` / `outroFallbackMs` must exceed
each sequence's total (`--preloader-step-duration` + 2 × `--preloader-step-stagger`).
Under `prefers-reduced-motion` the global utility forces `animation: none`; the
stylesheet snaps the states and the JS gates resolve at once (no animations to
await).

**Video** — the home sizzle (`#background video`) must be playing before the
outro. `Preloader.js` calls `play()` itself after hydration and awaits the
promise; `BackgroundVideo.playIntro()` later finds it already playing.

**Events** — `director:ready` in, `preloader:out` out, both on `window`, names
from `js/choreography/config/contracts/events/events.js`. `preloader:out` is
the seam where motion ownership passes from CSS to GSAP; it fires exactly once.

## Session gating

`SESSION_GATING_ENABLED` in `SessionManager.js` (currently `false`) switches
the return-visit path for the whole landing sequence — the preloader's `visited`
check and every section's `played` check. While off, `hasVisited()` is always
`false`, so the splash and outro run on every load and the pre-paint script
never fires.

## Bounds

Every wait is bounded (`constants.js`). The hero is visible throughout the
splash, so the cost of a tripped bound is a late landing chain, never a stuck
page. The director timeout is the only one that warns to the console.

## Deferred video

`deferred-videos.js` is the single owner of `data-defer-video`. Nothing else
assigns `src` to those elements. On the home page it runs twice: the
background video alone at readiness (it is what the playback gate waits on),
then everything left in `finally`, after `preloader:out`. Card videos are
play-in-view (`data-play-in-view`, no `autoplay`): `observeInViewVideos()`
assigns their `src` and calls `play()` only when they come within
`PRELOADER_IN_VIEW.rootMargin` of the viewport, and pauses them when they
leave. `autoplay` is deliberately absent — it overrides `preload="none"` and
would fetch every card video as soon as it had a `src`. While the splash is
up, the only media on the wire is the one video the gate is waiting for.
