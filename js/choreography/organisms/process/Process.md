---
id: frontend.js.choreography.organisms.process.process
role: "Process section controller — wires the process section into the AbstractSection lifecycle and drives the motion variant per breakpoint. Mirrors Bio.js: `_applyResponsiveLifecycle` resolves the section motion profile and rebuilds the animations with the resolved variant (`blockframes` at every breakpoint, `reduced` under prefers-reduced-motion)."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#choreography"
  - "#frontend"
  - "#js"
  - "#organism"
links:
  - "[[AbstractSection|AbstractSection]]"
  - "[[config/index|config/index]]"
  - "[[ProcessAnimations|ProcessAnimations]]"
  - "[[ProcessTriggers|ProcessTriggers]]"
---

# Process

Mirrors the `Bio` section controller pattern for variant selection. Resolves its
view via `SELECTORS.process` (`"process"`, the `id="process"` element rendered
by `views/organisms/section/process.njk`), and delegates animation/trigger
behavior to `ProcessAnimations` and `ProcessTriggers`.

`_applyResponsiveLifecycle` resolves the section motion profile via
`resolveSectionMotionProfile("process", conditions)` and calls
`animations.rebuild(variant)` before the base class runs — so a matchMedia
breakpoint change (which reverts and kills the prior context's tweens) rebuilds
the timelines with a fresh variant instance. The default variant is
`blockframes`; reduced motion resolves to `reduced` (empty intro, no grid fill).

The Blockframes display + reveal migrated here from the Bio section. The scroll
reveal itself is self-driving (`process-motion/blockframes.js` owns its own
once-fire ScrollTrigger); the intro timeline the variant returns is empty.
