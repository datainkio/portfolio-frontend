---
description: Sidecar for fetchFigma.js — the build:design entry point, which syncs styles/colors.css and styles/tokens.css from the Figma design-system library, then rebuilds the CSS.
type: script
tags:
  - figma
  - design-tokens
  - build
links:
  - "[[VariablesService]]"
  - "[[PaletteService]]"
  - "[[TokenService]]"
  - "[[fetchFigmaVariables]]"
---

# fetchFigma.js

The `npm run build:design` orchestrator. It reads the design-system library
named by `FIGMA_FILE_ID`, with `FIGMA_TOKEN`:

1. [VariablesService](../../figma/services/VariablesService.md) fetches the
   library's Tokens page and reads its variables. A page that has drifted from
   the variables fails the run before anything is written.
2. It writes `figma/exports/variables.local.json`.
3. [PaletteService](../../figma/services/PaletteService.md) writes
   `styles/colors.css`.
4. [TokenService](../../figma/services/TokenService.md) writes
   `styles/tokens.css`.
5. `buildCSS.js` rebuilds the site CSS.

Any failure exits with code 1. Fonts and motion aren't synced: see
`docs/design-system/adr-0001-figma-owns-design-tokens.md`.
