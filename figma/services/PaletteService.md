---
description: Sidecar for PaletteService.js — turns the Figma file's paint styles into the colour palette and hands it to PaletteFile.js, which writes styles/colors.css.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[PaletteFile]]"
  - "[[TokenService]]"
  - "[[fetchFigma]]"
---

# PaletteService.js

The colour half of the Figma sync. `figma/index.js` creates it and calls
`write(colors, metadata)` with the `Color` models built from the file's paint
styles (`figma/models/fills/Color.js`).

| Method                         | Does                                                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `parseColorsToPalette(colors)` | Sorts the colours by class name and groups them as `{ family: { variant: hex } }`. Throws if `colors` isn't an array. |
| `write(colors, metadata)`      | Builds the document metadata (name, last modified, Figma file id, version) and calls [[PaletteFile]]'s `write`.       |

`write` calls `parseColorsToPalette` but doesn't use the result: `PaletteFile`
writes the flat `colors` list. The grouping only matters for the sort, which
mutates `colors` in place.

## Output

`styles/colors.css`, one `--color-<family>-<variant>` per paint style inside
`@theme`. Never edit it by hand; run `npm run build:design`. The palette lint
(`npm run lint:palette`) treats it as the definition of the palette.

## Relationships

- Called by: `figma/index.js`, run through `scripts/build/fetchFigma.js`
- Writes through: [[PaletteFile]]
- Sibling: [[TokenService]], which writes `styles/tokens.css`
