---
id: frontend.js.choreography.organisms.awards.awardsanimations
role: "Awards animations module — builds section-header intro/outro timelines, a two-gel backing composition with full-page scroll track, and a scroll-threshold reveal group for award items."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/atomic-design/organism"
  - "#design/motion/AwardsAnimations"
links:
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[system/gsap|system/gsap]]"
  - "[[section-header-intro|section-header-intro]]"
  - "[[scroll-reveal-group|scroll-reveal-group]]"
  - "[[motion|motion]]"
  - "[[timelines|timelines]]"
  - "[[GelAnimationManager|GelAnimationManager]]"
  - "[[awards-gel-intro-outro.animation-spec|awards-gel-intro-outro.animation-spec]]"
---

## Motion Strategy

```mermaid
flowchart TB

    subgraph layers["Layer stack (bottom → top z-index)"]
        direction TB
        L1["bg-gel-5 · neutral backing · flush to section box"]
        L2["bg-gel-6 · accent · rotate −5° · one z-step above backing"]
        L3["#recognition · transparent background"]
        L4["bg-pixelator · overlay"]
        L1 -.->|"z↑"| L2 -.->|"z↑"| L3 -.->|"z↑"| L4
    end

    subgraph track["Scroll track — both gels, full-page scrub"]
        direction LR
        T1["init / refresh\ntop = docTop · left = docLeft\nwidth/height = section box\ny = 0"]
        T2["per-scroll frame\ny = −scrollY  (GSAP scrub)\nnet position = top + y\n= section viewport position"]
        T1 -->|"ScrollTrigger\ninvalidateOnRefresh: true\nonRefresh → _initGels()"| T2
    end

    subgraph accent["Accent gel lifecycle"]
        direction LR
        A1(["init\noffscreen bottom-right\ntop: docTop + vh\nleft: docLeft + vw\nrotate: −5°"])
        A2["intro playing\ntop → docTop\nleft → docLeft\nAWARDS_GEL_INTRO.ease.out"]
        A3(["registered\nflush + askew\ntop: docTop\nleft: docLeft\nrotate: −5°"])
        A4["outro playing\ntop → docTop + vh\nleft → docLeft + vw\nAWARDS_GEL_INTRO.ease.in"]
        A1 -->|"awards:enter"| A2
        A2 -->|"onComplete\n_accentGelRegistered = true"| A3
        A3 -->|"awards:exit"| A4
        A4 -->|"onComplete\n_accentGelRegistered = false"| A1
    end

    subgraph rm["Reduced motion  (prefers-reduced-motion)"]
        R1["_initGels() → gsap.set() both gels to registered state\nbacking: flush · accent: docTop + rotate −5°\nno tweens · _applyPostIntroState() jumps timeline to end"]
    end
```

**Key constraints:**
- `top` / `left` / `width` / `height` are layout properties — set only at init and on `ScrollTrigger.refresh()`, never during scrub.
- `y` (transform) is the only property animated per scroll frame.
- Rotation (`−5°`) is state, not motion — set at init and never tweened.
- Intro / outro tweens use `immediateRender: false` so the from-state is captured at play time, after `_initGels()` has positioned the gels.
