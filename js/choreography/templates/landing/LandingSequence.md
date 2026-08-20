---
id: frontend.js.choreography.templates.landing.landingsequence
role: "Page narrative flow — choreographs the complete landing page animation sequence by listening to AnimationBus events and coordinating section transitions."
status: stable
surface: internal
scope: frontend
runtime: browser
type: "template"
tags:
  - choreography
  - frontend
  - js
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

    subgraph chain["Serial landing chain — the header opens it and closes it"]
        direction TB
        ARM --> HOLD["HOME_HERO_HOLD.delay<br/>gsap.delayedCall, time is the sole trigger"]
        HOLD --> DECON["HomeHeaderManager._runTransition<br/>deconstruct: hero panel slides off-stage"]
        DECON --> HOC{{"bus: home:outro:complete"}}
        HOC --> VID["LandingSequence._startVideoIntro<br/>video.playIntro, awaits _ensureVideoReady"]
        VID --> VIC{{"bus: video:intro:complete"}}
        VIC --> BEAT["LandingSequence._armBioIntro<br/>gsap.delayedCall BIO_INTRO_HOLD.delay"]
        BEAT --> GEL["await bio.playLanding<br/>gel band flies in from below the fold — BIO_GEL_ENTRANCE"]
        GEL --> GLC{{"landing timeline onComplete<br/>resolves the playLanding promise"}}
        GLC --> BIO["bio.playIntro"]
        BIO --> BIC{{"bus: bio:intro:complete"}}
        BIC --> MENU["HomeHeaderManager._playMenuIn<br/>role flip to menu at the seam, off-screen,<br/>then rail slides in + nav stagger reveal"]
        MENU --> HIC{{"bus: home:intro:complete"}}
    end

    subgraph scroll["Out of band — self-driven by their own ScrollTriggers"]
        direction LR
        HERO["hero"]
        PROC["process"]
        AWARDS["awards"]
        ORGS["organizations"]
        WORK["work"]
    end

    BIOST["bio ScrollTrigger:<br/>enter / exit / onEnterBack / onLeaveBack"] -->|"reveal disengaged from scroll;<br/>gates background video playback"| LSOBS["LandingSequence listeners"]
    LSOBS -->|"play / pause"| VID2["BackgroundVideo.videoEl"]

    RM["Reduced motion"] -.->|"holds zero, timelines jump to progress 1,<br/>events still emit — chain stays intact"| chain
```

### Why it is shaped this way

- **The header opens the landing and closes it.** Its hero exit is the page's first statement; the video reveal answers it; Bio follows a beat later; and the menu rail arrives last, once Bio has had its say. Playing the video intro at `preloader:out` would race the header, so `start()` only stages the video's landing state.
- **The video is cued off `home:outro:complete`, not `home:intro:complete` — and that is load-bearing.** The menu rail's build now waits for `bio:intro:complete` (`HomeHeaderManager._playMenuIn`), so cueing Bio's chain off the rail's *intro* would deadlock: the rail waiting on Bio, Bio waiting on the rail. The hero *exiting* is the earlier, unblocked cue. Anything later added to this chain must respect that cycle.
- **Every link is an event, not a call.** Cross-section coordination goes through `AnimationBus` with `EVENTS` constants — `LandingSequence` never reaches into an organism's internals beyond its public `play*` methods.
- **Reduced motion zeroes holds rather than skipping links.** A gated profile still emits `…:intro:complete` (`AbstractSection` jumps the intro to `progress(1)`), so the chain completes without motion instead of stalling.
- **Timers are `gsap.delayedCall`, never `setTimeout`** — ticker-synced, pausable, killable in `destroy()`.
- **Bio is disengaged from scroll.** Its ScrollTrigger still fires enter/exit for side effects, but the reveal is owned by this chain.
- **Bio's enter/exit pair gates background video playback.** The video is the subject of the landing and of Bio, and backdrop for everything below, so the cue is simply whether Bio is on screen. The video keeps its fixed positioning, size, layer and visibility throughout — only `play()`/`pause()` change, which matters because the gels in `#sizzle-background` blend against the video's painted frame: a paused video holds its last frame and the composite is unchanged.

  Three things make this correct, and each one was a bug first:

  1. **`exit` is not directional.** `AbstractSection._onLeaveBack` emits `onLeaveBack` and *then* routes through `_onLeave`, so `bio:exit` fires when scrolling up above Bio as well as down past it. Only the downward case means "past Bio" — above Bio is the landing, where the video should play. The `onLeaveBack` listener sets `_bioLeftBackwards` (bus dispatch is synchronous, so it always runs first) and the `exit` listener consumes it.
  2. **`BIO_TRIGGER` must set `once: false`.** It inherits `once: true` from `SCROLL_DEFAULTS`, which killed the trigger after one enter/leave — `onEnterBack` never fired and the video, once paused, stayed paused. See [BioTriggers.md](../../organisms/bio/BioTriggers.md).
  3. **Resume is gated twice.** It no-ops under reduced motion (`BackgroundVideo.playIntro` deliberately does not autoplay there) and before `video:intro:complete` (Bio's trigger fires `enter` at load, which would otherwise start the video underneath its own reveal).
- **The gel entrance gates the bio intro.** `bio.playLanding()` is awaited, not fired-and-forgotten — the heading band has to land before the SplitText reveal starts over it. See [heading-gel.md](../../molecules/bio-motion/heading-gel.md); the promise resolves via `AbstractSection`'s `PromiseResolverQueue`, and resolves immediately under a gated profile so the await can never stall the chain.

### Known drift

None outstanding.

**Resolved 2026-08-20.** A prior note here flagged `BackgroundVideo.playIntro()`'s comment for claiming `LandingSequence` waits on `video:intro:complete` to trigger `hero.playLanding()`. That comment no longer exists — `playIntro()` now carries only a reduced-motion note, and `hero.playLanding` appears nowhere in `organisms/background/` or `templates/landing/`. The chain has always triggered `bio.playIntro()`; the diagram above (`VIC` → `BEAT` → `GEL` → `BIO`) is the accurate account.
