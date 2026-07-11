---
id: frontend.js.choreography.molecules.process-motion.blockframes-grid
role: "Runtime fill for the Process 6x6 Blockframes grid — clones the library block named by each hidden cell's `data-blockframe-block` attribute into that cell via the js/displays/blockframes package (dynamic-imported with a non-literal specifier so esbuild leaves it out of the choreography bundle; the package's https CDN imports can't be bundled). Blocks are painted with a palette resolved from live design tokens (`--color-primary/secondary/neutral/accent-100/500/900`). Touches only invisible cells (the visible r3c3 Basic cell is inlined at build time), idempotent across matchMedia rebuilds (skips cells that already contain an svg), fire-and-forget from reveal.js `intro()` — failure is invisible. Never runs under reduced motion (the `reduced` variant calls no builders). Normalizes each emitted svg's viewBox to its measured content bbox (Builder.insert omits the viewBox and its scale/move math leaves canvas-positioned block content at unpredictable coordinates) so cells render full-bleed when the reveal's zoom-out stage (blockframes.js) fades them in."
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
