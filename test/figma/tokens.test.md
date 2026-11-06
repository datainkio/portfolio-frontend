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
The fixture follows the Figma REST API's documented node shape. It hasn't been
compared with a real response, because the sync has no credentials on this
machine yet.

Runs as part of `npm test` through `test:figma`.
