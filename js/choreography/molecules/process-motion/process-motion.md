---
id: frontend.js.choreography.molecules.process-motion
role: "Process-Motion Molecule — variant registry for the Process section. Exposes PROCESS_VARIANT_FACTORIES: `ui-components-loop` (the composed live variant — builds the scroll-driven Blockframes reveal + gel_process section-gel band (covers the full section) via reveal.js fire-and-forget, then returns the looping UI-components scene's intro timeline; both self-driving via distinct kill-by-id ScrollTriggers), `blockframes` (Blockframes reveal + section-gel alone), and `reduced` (static builders — loop's first item pinned; Blockframes degrades to the inlined .Basic block at native opacities, grid fill and section-gel never running). buildIntro factories receive (view, gelManager); ProcessAnimations.js selects the active variant via SECTION_OVERRIDES.process in config/ix/profiles.js."
status: stable
surface: internal
scope: frontend
runtime: browser
atomicLevel: "molecule"
tags:
  - process-motion
  - process
  - blockframes
  - choreography
  - frontend
  - js
links:
  - "[[reveal]]"
  - "[[blockframes]]"
  - "[[blockframes-grid]]"
  - "[[molecules/process-motion/section-gel|molecules/process-motion/section-gel]]"
backlinks:
  - "[[ProcessAnimations]]"
---
