---
description: Sidecar for PaletteFile.js — writes styles/colors.css, the @theme block of --color-* custom properties generated from the Figma library's colour variables.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[PaletteService]]"
  - "[[TokensFile]]"
---

# PaletteFile.js

Writes `styles/colors.css` for [[PaletteService]]: a header comment naming the
Figma file and version, then one `@theme` block with a `--color-<name>: <hex>;`
line per colour.

The output is deterministic and already in the form Prettier writes: lowercase
hex, two-space indents, a trailing newline. It carries no build timestamp, so a
sync with no colour changes produces no diff beyond the version in the header.

`eleventy/collections/designSystem.js` reads the header's `@source` line to show
the Figma file and version on the tokens docs page. Keep the
`@source Figma file <name>, version <number>` form if the header changes.

## Relationships

- Called by: [[PaletteService]]
- Sibling: [[TokensFile]], which writes `styles/tokens.css`
