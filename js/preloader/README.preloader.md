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

        P->>DV: hydrateDeferredVideos()
        DV-->>B: background + card videos get src (download warms during outro)

        alt first visit
            P->>CSS: set data-preloader-state="exit"
            CSS->>CSS: pulse stops, paths + frame transition to opacity 1<br/>over --hanko-settle-duration (0.4s)
            alt motion allowed
                CSS-->>P: transitionend (opacity, inside .hanko-mount)
            else prefers-reduced-motion (transition: none)
                P-->>P: settleFallbackMs (600) elapses
            end
        else return visit
            P->>CSS: re-assert data-preloader-state="exit" (no-op)
        end

        P->>LS: window "preloader:out" (exactly once)
        LS->>LS: LandingSequence.start() and HomeHeaderManager._arm()
        Note over LS: CSS → GSAP ownership seam — landing chain begins

        Note over P: finally — runs even if a gate throws
        P->>B: restore overflow + scrollY
        P->>B: main[aria-busy="false"]
    end
```

## States

The same flow as a state machine. The state the CSS reads is
`data-preloader-state` (unset → `exit`); everything else is JS-internal.

```mermaid
stateDiagram-v2
    direction TB

    [*] --> Pulsing : first paint — hanko-loading-pulse (CSS, no JS)

    state "Pulsing (data-preloader-state unset)" as Pulsing
    state "Booting — initPreloader()" as Booting
    state "NoSplash — page has no [data-preloader]" as NoSplash
    state "Locked — html/body overflow hidden, scrollY captured" as Locked
    state "Waiting — bounded readiness gates" as Waiting {
        direction LR
        [*] --> Fonts
        Fonts --> Director : fonts.ready resolved<br/>or fontsReadyTimeoutMs (2000)
        Director --> [*] : director#colon;ready received<br/>or directorReadyTimeoutMs (8000) + console.warn
    }
    state "Settling (data-preloader-state=exit) — pulse stops, paths transition to opacity 1" as Settling
    state "Exited — mark fully lit, header persists as hero" as Exited
    state "Released — scroll unlocked, main[aria-busy=false]" as Released

    Pulsing --> Exited : pre-paint script sees visited=true<br/>(return visit, SESSION_GATING_ENABLED only)
    Pulsing --> Booting : deferred module evaluates

    Booting --> NoSplash : no [data-preloader]
    NoSplash --> [*] : hydrateDeferredVideos()

    Booting --> Locked : home, first visit
    Booting --> Waiting : home, return visit (gating on)
    Locked --> Waiting

    Waiting --> Settling : first visit — hydrateDeferredVideos(),<br/>then set data-preloader-state=exit
    Waiting --> Exited : return visit — hydrateDeferredVideos(),<br/>state already exit (re-asserted)

    Settling --> Exited : transitionend (opacity, .hanko-mount)<br/>or settleFallbackMs (600) under reduced motion

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

**Markup** — [home-landing.njk](../../views/organisms/header/home/home-landing.njk).
The landing `<header>` carries `data-preloader`; it *is* the preloader and is
never removed. Its `.hanko-mount` is the element whose settle transition ends
the outro. [session-management-script.njk](../../views/templates/partials/session-management-script.njk)
runs inline right after it and sets the exit state before first paint on return
visits, reading the same `sessionStorage` key as `SessionManager`.

**CSS** — `[data-preloader][data-preloader-state="exit"]` in `hanko.css` stops
the pulse and transitions the paths to full opacity over
`--hanko-settle-duration`. `constants.js` `settleFallbackMs` must exceed it.
Under `prefers-reduced-motion` the global utility forces `transition: none`, so
the fallback is the only path that fires.

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
assigns `src` to those elements.
