---
description: Sidecar for palette.test.js — tests how the Figma library's colour variables become styles/colors.css, using fixtures with no network call or Figma token.
type: script
tags:
  - figma
  - design-tokens
  - testing
links:
  - "[[PaletteService]]"
  - "[[PaletteFile]]"
---

# palette.test.js

Covers `extractPalette` and the `PaletteFile` renderer. The fixture's colour
values are the float values Figma stores for the library's variables. The test
pins the sort order and the exact rendered text, because the docs page and
`lint:palette` both read `styles/colors.css`.

Runs as part of `npm test` through `test:figma`.
