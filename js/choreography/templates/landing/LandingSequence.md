---
description: "Page narrative flow — choreographs the complete landing page animation sequence by listening to AnimationBus events and coordinating section transitions."
type: template
status: stable
tags:
  - choreography
links:
  - "[[events|events]]"
  - "[[config/index|config/index]]"
---

# LandingSequence

Narrative pacing for the homepage. Owns no DOM and no ScrollTrigger — it listens on `AnimationBus` and cues section lifecycle methods in order.

## Motion strategy

```mermaid
flowchart TD
    subgraph boot["Boot gates — never bypass"]
        DCL["DOMContentLoaded, idle-deferred"] --> AD["AnimationDirector: bus, ScrollEffectsCoordinator,<br/>CardManager, SECTION_REGISTRY, managers, LandingSequence"]
        AD --> DR{{"window: director:ready"}}
        DR --> PRE["Preloader exit animation"]
        PRE --> PO{{"window: preloader:out"}}
    end

    PO --> LS["LandingSequence.start<br/>video.playLanding — hidden resting state"]
    PO --> ARM["HomeHeaderManager._arm<br/>loader role to hero role"]

    subgraph chain["Serial landing chain — the header opens it, then leaves"]
        direction TB
        ARM --> HOLD["HOME_HERO_HOLD.delay<br/>gsap.delayedCall, time is the sole trigger"]
        HOLD --> DECON["HomeHeaderManager._runTransition<br/>hero panel slides off-stage, header dismissed"]
        DECON --> HOC{{"bus: home:outro:complete"}}
        HOC --> VID["LandingSequence._startVideoIntro<br/>video.playIntro, awaits _ensureVideoReady"]
        VID --> VIC{{"bus: video:intro:complete"}}
        VIC --> BEAT["LandingSequence._armBioIntro<br/>gsap.delayedCall BIO_INTRO_HOLD.delay"]
        BEAT --> GEL["await bio.playLanding<br/>gel band flies in from below the fold — BIO_GEL_ENTRANCE"]
        GEL --> GLC{{"landing timeline onComplete<br/>resolves the playLanding promise"}}
        GLC --> BIO["bio.playIntro"]
        BIO --> BIC{{"bus: bio:intro:complete — chain ends"}}
    end

    subgraph scroll["Out of band — self-driven by their own ScrollTriggers"]
        direction LR
        HERO["hero"]
        PROC["process"]
        AWARDS["awards"]
        ORGS["organizations"]
        WORK["work"]
    end

    BIOST["bio ScrollTrigger:<br/>enter / exit / onEnterBack / onLeaveBack"] -.->|"log only — reveal is disengaged from scroll"| LSOBS["LandingSequence listeners"]

    RM["Reduced motion"] -.->|"holds zero, timelines jump to progress 1,<br/>events still emit — chain stays intact"| chain
```

### Why it is shaped this way

- **The header opens the landing, then leaves.** Its hero exit is the page's first statement; the video reveal answers it; Bio follows a beat later and closes the chain. Playing the video intro at `preloader:out` would race the header, so `start()` only stages the video's landing state.
- **The video is cued off `home:outro:complete`.** That is the header's only outward cue — it emits no intro events, because after its exit it is dismissed and gone from the page. The chain now terminates at `bio:intro:complete`; nothing consumes that event today, so it is the natural extension point for anything added later.
- **Every link is an event, not a call.** Cross-section coordination goes through `AnimationBus` with `EVENTS` constants — `LandingSequence` never reaches into an organism's internals beyond its public `play*` methods.
- **Reduced motion zeroes holds rather than skipping links.** A gated profile still emits `…:intro:complete` (`AbstractSection` jumps the intro to `progress(1)`), so the chain completes without motion instead of stalling.
- **Timers are `gsap.delayedCall`, never `setTimeout`** — ticker-synced, pausable, killable in `destroy()`.
- **Bio is disengaged from scroll.** Its ScrollTrigger still fires enter/exit for side effects, but the reveal is owned by this chain.
- **The gel entrance gates the bio intro.** `bio.playLanding()` is awaited, not fired-and-forgotten — the heading band has to land before the SplitText reveal starts over it. See [heading-gel.md](../../molecules/bio-motion/heading-gel.md); the promise resolves via `AbstractSection`'s `PromiseResolverQueue`, and resolves immediately under a gated profile so the await can never stall the chain.

### Known drift

None outstanding.

**Updated 2026-08-28.** The chain previously ended by bringing the header back as a
`menu` navigation rail, cued off `bio:intro:complete`. The sidenav was removed from
the homepage UX strategy; the header is now dismissed after its exit and the chain
ends at `bio:intro:complete`. This also retired the deadlock hazard the old note
described — there is no longer a cycle to respect, because the header never
re-enters the chain.

**Resolved 2026-08-20.** A prior note here flagged `BackgroundVideo.playIntro()`'s comment for claiming `LandingSequence` waits on `video:intro:complete` to trigger `hero.playLanding()`. That comment no longer exists — `playIntro()` now carries only a reduced-motion note, and `hero.playLanding` appears nowhere in `organisms/background/` or `templates/landing/`. The chain has always triggered `bio.playIntro()`; the diagram above (`VIC` → `BEAT` → `GEL` → `BIO`) is the accurate account.
