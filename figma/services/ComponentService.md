---
description: Sidecar for ComponentService.js — reads a Figma component set over REST and turns each variant's bound colours into the bg, text and border colours its template should use.
type: script
tags:
  - figma
  - design-system
  - components
links:
  - "[[VariablesService]]"
  - "[[VariantsMap]]"
  - "[[syncComponents]]"
---

# ComponentService.js

The reader for `npm run sync:components`. It fetches a component set from the
design-system library (`FIGMA_FILE_ID`) and reads the colours each variant
applies. Contract: [component-sync.spec.md](../../specs/component-sync.spec.md).

1. `GET /files/:key/nodes?ids=<set>` returns the set and its variants.
2. Variable IDs resolve to names through
   [VariablesService](VariablesService.md)'s `fetchTokensPage` and
   `extractVariables`, the same way `build:design` reads them.

## Exports

| Export                                        | Does                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `extractComponentColours(setNode, variables)` | Pure. The set's variants → `{ colours, notes }`.                                     |
| `variantProperties(name)`                     | `Style=CTA, State=Default` → `{ Style: "CTA", State: "Default" }`.                   |
| `colourName(variableName)`                    | `secondary/600` → `secondary-600`; `base/white` and `base/black` → `white`, `black`. |
| `ComponentService#fetchComponentSet(nodeId)`  | One REST call. Fails when the node is missing or isn't a `COMPONENT_SET`.            |
| `ComponentService#fetchVariables()`           | A fresh Tokens page through `extractVariables`, keyed by variable ID.                |

`figma/index.js` exports an instance as `componentService`.

## What it reads

Each variant's `Style` option, lowercased, is its key: `Style=CTA` → `cta`.
Only the `Default` and `Hover` states are read; Focus and Disabled aren't in v1.

| Layer                              | Property |
| ---------------------------------- | -------- |
| The variant's root fill            | `bg`     |
| The variant's root stroke          | `border` |
| The fill of the text layer `Label` | `text`   |

A property Figma doesn't set is left out, so Icon's colours are
`{ default: { border: "neutral-700" }, hover: { border: "neutral-700" } }`.

## What it can't resolve

A slot the sync mustn't write keeps a marker in place of its colour, so the
diff reports it against the right utility:

- `{ unknown: "VariableID:…" }`: the bound variable isn't in `variables`.
- `{ raw: "#rrggbb" }`: an unbound colour. A gradient or more than one paint
  is marked the same way.

`notes` lists every problem in reading order, by `kind`:

- `layer`: a visible layer other than the root and `Label` that carries its own
  colour, such as Submit's `Arrow (::after)` and Icon's `Icon / Glyph`. The
  root's effects and the Label's strokes count too.
- `raw` and `unknown`: the markers above.
- `name`: a variant with no `Style` option.

`test/figma/components.test.js` covers the reader with the real response for
the Button set, `test/figma/fixtures/button-set.nodes.json`.
