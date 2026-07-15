---
id: frontend.js.choreography.molecules.process-motion.blockframes-grid
role: "Runtime fill for the Process 12×3 Blockframes grid — clones the library block named by each cell's `data-blockframe-block` attribute into that cell via the js/displays/blockframes package (dynamic-imported with a non-literal specifier so esbuild leaves it out of the choreography bundle; the package's https CDN imports can't be bundled). Blocks are painted with a palette resolved from live design tokens (`--color-primary/secondary/neutral/accent-100/500/900`). All 36 cells are placeholders (none inlined at build time); idempotent across matchMedia rebuilds (skips cells that already contain an svg), fire-and-forget from reveal.js `intro()` — failure is invisible. Never runs under reduced motion (the `reduced` variant calls no builders). viewBox framing is no longer this file's concern — `Builder.insert()` (js/displays/blockframes) now measures the post-transform content bbox and sets a correct viewBox on the emitted svg at the source, so cells render full-bleed when the reveal's grid-stagger timeline (blockframes.js) fades them in."
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
  - "#[svg]"
links:
  - "[[process-motion]]"
  - "[[blockframes]]"
  - "[[process]]"
backlinks:
  - "[[reveal]]"
---
