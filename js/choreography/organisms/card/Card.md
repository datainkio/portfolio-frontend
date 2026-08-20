---
id: frontend.js.choreography.organisms.card.card
role: "Card organism — manages responsive scroll motion (clip/fade/parallax/throw) for a single project card via gsap.matchMedia; the `static` (dev baseline, motion off) and `reduced` (a11y) variants both apply the shared clearProps:all reset so the card renders CSS-only, as if no JS ran. Variant resolved per breakpoint via resolveSectionMotionProfile; `?cardVariant=` overrides it live."
status: stable
surface: internal
scope: frontend
runtime: browser
atomicLevel: "organism"
tags:
  - choreography
  - frontend
  - js
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/index|config/index]]"
  - "[[card-scroll-clip|card-scroll-clip]]"
---
