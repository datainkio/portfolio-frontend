---
description: Sidecar for components.test.js — tests the component colour sync's reader, diff, writer and --check exit code against the real Button set response, with no network call or Figma token.
type: script
tags:
  - figma
  - design-system
  - testing
links:
  - "[[ComponentService]]"
  - "[[VariantsMap]]"
  - "[[syncComponents]]"
---

# components.test.js

Covers `extractComponentColours`, `applyColours` and `syncComponents`'s
`checkStatus`, from the fixture in `fixtures/button-set.nodes.json`: the real
`GET /files/:key/nodes?ids=25:43` response for the Button component set, taken
on 2026-11-08. That response showed that REST carries `boundVariables` on
`strokes[]` and `effects[]` as it does on `fills[]`.

The variables are the nine the set's Default and Hover variants bind, built in
the test rather than loaded from the 98 KB export. The template is the spec's
example `variants` map. Each case edits a copy of the fixture or the template:

- **unchanged**: the spec's map against the fixture.
- **replace**: CTA's hover rebound from `secondary/800` to `secondary/700`.
- **append**: Icon's slot without `border-neutral-700`.
- **needs a hand**: an extra colour utility, a hover utility that matches the
  default, a Style with no key and a key with no Style, Submit's arrow and
  Icon's glyph, an unbound colour.
- **unknown variable**: a bound ID missing from the variables, and a colour
  outside the palette.
- **`--check`**: the exit code, through the pure `checkStatus`.

`ComponentService.fetchComponentSet` runs through a fake client, so nothing
reaches the network.

Runs as part of `npm test` through `test:figma`.
