---
description: Sidecar for seedDesignTokens.js — writes the current rendered values to styles/tokens.css and lists what to create in Figma so the sync can take over.
type: script
tags:
  - design-system
  - design-tokens
  - figma
  - tooling
links:
  - "[[inventoryDesignSystem]]"
  - "[[TokenService]]"
  - "[[TokensFile]]"
---

# seedDesignTokens.js

Bridges the gap until the Figma `Tokens` page exists. It reads the values in use
from `docs/design-system/inventory.json` and looks each one up in Tailwind's
default theme or the shadows already declared in `styles/`. It then writes:

- `styles/tokens.css`: those values as explicit tokens, so rendering doesn't change
- `docs/design-system/figma-worklist.md`: the exact styles and layers to create in Figma

## Usage

```bash
npm run seed:tokens
```

Rerunning is safe while the file is still seeded. **Stop using it once the Figma
`Tokens` page exists**, because it would overwrite Figma's values with Tailwind's.
At that point `npm run build:design` owns `styles/tokens.css`, and this script
can be deleted.

## What gets a token

Values on a scale that the code uses. Layout keywords and relative units stay as
they are, because a Figma number can't express them: `auto`, `full`, `screen`,
fractions, `dvh`, `vh`, `ch`, and `%`. `0`, `px`, and `none` also stay, because
they have no theme entry to override.
