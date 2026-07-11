---
id: frontend.js.choreography.organisms.process.processanimations
role: "Process animations module — variant-driven intro/idle/outro timeline builder. Selects the active variant from PROCESS_VARIANT_FACTORIES (default `blockframes`) and delegates buildIntro/buildOutro to it; the idle phase is an empty timeline. Mirrors BioAnimations."
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
  - "[[AbstractSectionAnimations|AbstractSectionAnimations]]"
  - "[[system/gsap|system/gsap]]"
  - "[[timelines|timelines]]"
  - "[[process-motion|process-motion]]"
---

# ProcessAnimations

Variant-driven animations module mirroring `BioAnimations`. Holds the active
variant string (default `"blockframes"`) and resolves it against
`PROCESS_VARIANT_FACTORIES` from `molecules/process-motion/process-motion.js`.

- `setVariant(variant)` — switch variant, short-circuiting when unchanged and
  an intro timeline already exists.
- `rebuild(variant)` — force a fresh build of every phase timeline, ignoring
  the unchanged-variant short-circuit. Needed after a matchMedia breakpoint
  change reverts (and kills) the prior context's tweens; `Process.js` drives
  the first build via `_applyResponsiveLifecycle` (the constructor does NOT
  call `_buildTimeline`, matching Bio).
- `_buildIntro` / `_buildOutro` — delegate to the active factory's
  `buildIntro` / `buildOutro`; `buildOutro` is currently unused by every
  variant.
- `_buildIdle` — an empty timeline.

The `blockframes` variant's intro fires the self-driving Blockframes reveal +
grid fill as side-effects and returns an empty timeline; the `reduced` variant
returns an empty intro so only the static inlined `.Basic` block shows.
