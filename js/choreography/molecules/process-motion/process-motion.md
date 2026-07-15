---
id: frontend.js.choreography.molecules.process-motion
role: "Process-Motion Molecule — variant registry for the Process section. Exposes PROCESS_VARIANT_FACTORIES: `ui-components-loop` (the composed live variant — builds the scroll-driven Blockframes reveal via reveal.js fire-and-forget, then returns the looping UI-components scene's intro timeline; both self-driving via distinct kill-by-id ScrollTriggers), `blockframes` (Blockframes reveal alone), and `reduced` (static builders — loop's first item pinned; Blockframes degrades to the inlined .Basic block at native opacities, grid fill never running). ProcessAnimations.js selects the active variant via SECTION_OVERRIDES.process in config/ix/profiles.js."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#[process-motion]"
  - "#[process]"
  - "#[blockframes]"
  - "#[choreography]"
  - "#[frontend]"
  - "#[js]"
  - "#[molecule]"
links:
  - "[[reveal]]"
  - "[[blockframes]]"
  - "[[blockframes-grid]]"
backlinks:
  - "[[ProcessAnimations]]"
---
