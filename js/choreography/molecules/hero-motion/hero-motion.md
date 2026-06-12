---
id: frontend.js.choreography.molecules.hero-motion
role: "Hero-Motion Molecule — variant factories (reveal, reduced) for the hero section; top-level API selected by SECTION_OVERRIDES.hero. Mirrors the award-motion pattern."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/atomic-design/molecule"
  - "#design/motion/choreography/hero-motion"
  - "#ux/accessibility/reduced-motion"
links:
  - "[[organisms/hero/HeroAnimations|organisms/hero/HeroAnimations]]"
  - "[[config/ix/profiles/profiles|config/ix/profiles/profiles]]"
backlinks:
  - "[[organisms/hero/HeroAnimations|organisms/hero/HeroAnimations]]"
---

## Variants

Each variant is `{ init, buildIntro, buildOutro }`, returning GSAP timelines for
the landing / intro / outro lifecycle phases. `HeroAnimations` delegates to the
active variant; `Hero._applyResponsiveLifecycle` selects it from the resolved
motion profile (`profile.animation.variant`).

- **reveal** — full motion. Tagline word split-reveal as the lifecycle landing;
  gel transform (`HERO_INTRO`) and `scaleY` collapse outro driven by the pinned
  scrub `HERO_TRIGGER` / the hero gel scrub trigger.
- **reduced** — low-vestibular. Gentle tagline fade only, paced from the shared
  `ACCESSIBILITY_SETTINGS.reducedMotion*` vocabulary; gel left at CSS rest. Intro
  and outro are intentionally empty: the `reduced` motion profile sets
  `trigger.enabled:false`, so there is no pin/scrub to drive them, while
  `timeline.enabled:true` keeps the landing playing.

## SplitText state

The tagline split is tracked per-view in a module `WeakMap` so a variant rebuild
reverts the prior split before re-splitting. `getLastWordBottom()` remains on
`HeroAnimations` (it measures `#hero-heading` directly and is variant-independent).
