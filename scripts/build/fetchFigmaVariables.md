---
description: Sidecar for fetchFigmaVariables.js — the build:design:variables entry point, which exports the design-system library's variables to figma/exports/variables.local.json without touching styles/.
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
design-system library (`FIGMA_FILE_ID`) and writes
`figma/exports/variables.local.json`.

```bash
npm run build:design:variables
```

`npm run build:design` writes the same export as part of a full sync. Use this
command to refresh the export, or to check that the Tokens page still matches the
library's variables, without regenerating any CSS. It needs `FIGMA_TOKEN`.
