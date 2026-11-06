---
description: Sidecar for TokensFile.js — renders a design token set as the Tailwind v4 theme block in styles/tokens.css.
type: script
tags:
  - figma
  - design-tokens
  - tailwind
links:
  - "[[TokenService]]"
---

# TokensFile.js

Renders a token set from the Figma sync as the `@theme` block in `styles/tokens.css`.

The output is deterministic. It carries no build timestamp, so a sync with no
token changes produces no diff beyond the Figma version in the header.
