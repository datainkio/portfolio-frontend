---
description: Sidecar for tokens.test.js — tests how Figma layers become design tokens, using a fixture document with no network call or Figma token.
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

Covers `extractTokens` and the `TokensFile` renderer against a fixture document.
The fixture's shapes were compared with a real response from the project's Figma
file on 2026-11-06, for text styles and the Tokens page. Token layers don't exist
there yet, so the rectangle and shadow shapes follow Figma's documentation.

Runs as part of `npm test` through `test:figma`.
