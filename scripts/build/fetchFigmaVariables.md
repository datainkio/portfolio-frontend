---
description: Sidecar for fetchFigmaVariables.js — the build:design:variables entry point, which exports the design-system library's variables to figma/exports/variables.local.json.
type: script
tags:
  - figma
  - design-tokens
  - build
links:
  - "[[VariablesService]]"
  - "[[fetchFigma]]"
---

# fetchFigmaVariables.js

Runs [VariablesService](../../figma/services/VariablesService.md) against the
design-system library and writes `figma/exports/variables.local.json`.

```bash
npm run build:design:variables
```

It reads `FIGMA_LIBRARY_FILE_ID`, not `FIGMA_FILE_ID`, so `build:design` keeps
syncing CSS from the old file. It needs `FIGMA_TOKEN` too. Nothing in `styles/`
changes, and no other build step reads the export yet.
