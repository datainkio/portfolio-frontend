---
id: frontend.js.choreography.molecules.bio-motion.blockframes-grid
role: "Runtime fill for the Bio 6x6 Blockframes grid — clones the library block named by each hidden cell's `data-blockframe-block` attribute into that cell via the js/displays/blockframes package (dynamic-imported with a non-literal specifier so esbuild leaves it out of the choreography bundle; the package's https CDN imports can't be bundled). Touches only invisible cells (the visible r3c3 Basic cell is inlined at build time), idempotent across matchMedia rebuilds (skips cells that already contain an svg), fire-and-forget from split.js `intro()` — failure is invisible. Never runs under reduced motion (the `reduced` variant calls no builders). Normalizes each emitted svg's viewBox to its measured content bbox (Builder.insert omits the viewBox and its scale/move math leaves canvas-positioned block content at unpredictable coordinates) so cells render full-bleed when the reveal's zoom-out stage (blockframes.js) fades them in."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#[bio-motion]"
  - "#[biography]"
  - "#[blockframes]"
  - "#[choreography]"
  - "#[frontend]"
  - "#[js]"
  - "#[svg]"
links:
  - "[[bio-motion]]"
  - "[[blockframes]]"
  - "[[bio]]"
backlinks:
  - "[[split]]"
---
