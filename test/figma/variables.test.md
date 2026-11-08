---
description: Sidecar for variables.test.js — tests how the library's Tokens page becomes the Enterprise variables shape, using fixture nodes with no network call or Figma token.
type: script
tags:
  - figma
  - design-tokens
  - testing
links:
  - "[[VariablesService]]"
  - "[[tokensPage]]"
---

# variables.test.js

Covers `extractVariables`, `VariablesService.fetchTokensPage` and
`VariablesService.write`, including the error a run against the old Figma file
gets. The fixture's node shapes
follow a real `GET /files/:key/nodes` response for the library's Tokens page,
taken on 2026-11-08. That response showed that REST leaves out a gap of 0, and
that a variable's float comes back as Figma's stored float32 value.

The service tests use a fake client, so nothing reaches the network.

Runs as part of `npm test` through `test:figma`.
