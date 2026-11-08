---
description: Sidecar for PaletteService.js — turns the Figma library's colour variables into the palette and hands it to PaletteFile.js, which writes styles/colors.css.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[PaletteFile]]"
  - "[[TokenService]]"
  - "[[VariablesService]]"
  - "[[fetchFigma]]"
---

# PaletteService.js

The colour half of the Figma sync. `scripts/build/fetchFigma.js` calls
`write(variables, { source })` with the variables that
[VariablesService](VariablesService.md) read from the library's Tokens page.

| Export                      | Does                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `extractPalette(variables)` | Each COLOR variable becomes `{ name, hex }`: `accent/500` becomes `accent-500`. Sorted by name. Pure. |
| `PaletteService#write`      | Throws, writing nothing, if there are no colour variables; otherwise calls [[PaletteFile]]'s `write`. |

`base/white` and `base/black` are left out. Tailwind defines `--color-white` and
`--color-black` itself, and `colors.css` never declared them. A colour with
transparency is written as eight-digit hex.

## Output

`styles/colors.css`, one `--color-<family>-<step>` per colour variable inside
`@theme`. Never edit it by hand; run `npm run build:design`. The palette lint
(`npm run lint:palette`) treats it as the definition of the palette.

`test/figma/palette.test.js` covers it with no network call.

## Relationships

- Called by: `scripts/build/fetchFigma.js`, through `figma/index.js`
- Writes through: [[PaletteFile]]
- Sibling: [[TokenService]], which writes `styles/tokens.css`
