---
description: Sidecar for TokensFile.js — renders a design token set as the Tailwind v4 theme block in styles/tokens.css.
type: script
tags:
  - figma
  - design-tokens
  - tailwind
links:
  - "[[TokenService]]"
  - "[[seedDesignTokens]]"
---

# TokensFile.js

Renders a token set as the `@theme` block in `styles/tokens.css`. Both the Figma
sync and `npm run seed:tokens` use it, so the file has one format.

The output is deterministic. It carries no build timestamp, so a sync with no
token changes produces no diff beyond the Figma version in the header.
