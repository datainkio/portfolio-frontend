---
description: Sidecar for tokens.test.js — tests how the Figma library's variables and shadow styles become design tokens, using fixtures with no network call or Figma token.
type: script
tags:
  - figma
  - design-tokens
  - testing
links:
  - "[[TokenService]]"
  - "[[TokensFile]]"
---

# tokens.test.js

Covers `extractTokens` and the `TokensFile` renderer. The variables follow
`extractVariables`' output and the effect-style samples follow a real
`GET /files/:key/nodes` response for the library's Tokens page, taken on
2026-11-08. The float values in the fixture are the ones Figma actually stores,
such as 1.1670000553131104 for `leading/snug`.

Runs as part of `npm test` through `test:figma`.
