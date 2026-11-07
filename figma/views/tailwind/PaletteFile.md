---
description: Sidecar for PaletteFile.js — writes styles/colors.css, the @theme block of --color-* custom properties generated from Figma paint styles.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[PaletteService]]"
  - "[[TokensFile]]"
---

# PaletteFile.js

Writes `styles/colors.css` for [[PaletteService]]. The file is a header
comment (Figma file name, version, file id, last-modified and generated
dates) and one `@theme` block with a `--color-<className>: <hex>` line per
colour.

## Known output quirks

- Hex values are uppercase, as `Color.rgbToHex` produces them.
- The first property is indented with four spaces and the rest with a tab
  (`join(";\n\t")`), and the closing brace is indented.

Both fail `format:check` until Prettier runs, so every `npm run build:design`
needs a `npx prettier --write styles/colors.css` before commit. Fixing the
template string here would end that.

## Relationships

- Called by: [[PaletteService]]
- Sibling: [[TokensFile]], which writes `styles/tokens.css`
