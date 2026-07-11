---
id: frontend.js.choreography.molecules.process-motion.reveal
role: "Blockframes intro factory for process-motion — fires the two self-driving blockframes side-effects (buildBlockframesReveal, which creates its own once-fire ScrollTrigger; fillBlockframesGrid, a fire-and-forget async that clones library blocks into the hidden 6x6 grid cells) in that fixed order, then returns an empty intro timeline so AbstractSection.playIntro has something to bind while the reveal stays scroll-owned. The Process heading is static — no header animation."
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
  - "#[introduction]"
  - "#[js]"
  - "#[variant]"
links:
  - "[[process-motion]]"
  - "[[blockframes]]"
  - "[[blockframes-grid]]"
backlinks:
  - "[[process-motion]]"
---
