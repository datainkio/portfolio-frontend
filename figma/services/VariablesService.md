---
description: Sidecar for VariablesService.js — reads the library's Tokens page over REST and writes the variables in the shape of Figma's Enterprise-only Variables API.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[tokensPage]]"
  - "[[fetchFigma]]"
  - "[[fetchFigmaVariables]]"
  - "[[TokenService]]"
  - "[[PaletteService]]"
---

# VariablesService.js

Reads the design-system library (`FIGMA_FILE_ID`) for the Figma sync, and
exports its variables to `figma/exports/variables.local.json` in the shape that
`GET /v1/files/:key/variables/local` returns. That endpoint needs an Enterprise
plan. This service uses two calls that a Pro token can make:

1. `GET /files/:key?depth=1` finds the page whose name ends in `Tokens`, using
   `isTokensPage` from [TokenService](TokenService.md).
2. `GET /files/:key/nodes?ids=<page>` returns the page's layers.

[tokensPage.js](../generators/tokensPage.md) builds that page. Each variable's
value is read from its layer's live bound value. Its other fields come from the
layer's hidden `meta` JSON.

On 2026-11-08 the export matched the Plugin API's own values for all 161
variables and 5 collections, field by field.

## Exports

| Export                             | Does                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `extractVariables(pageNode)`       | Pure. The page's `meta` texts and bound values → `{ variables, variableCollections }`. |
| `writeExport(meta, outFile)`       | Writes `meta` wrapped as the Enterprise response.                                      |
| `VariablesService#fetchTokensPage` | The two REST calls. Returns `{ file: { name, version, lastModified }, page }`.         |
| `VariablesService#write`           | Fetch, extract and export in one step, for `npm run build:design:variables`.           |

`npm run build:design` (`scripts/build/fetchFigma.js`) fetches once, writes the
export, and hands the variables and page to [PaletteService](PaletteService.md)
and [TokenService](TokenService.md).

## Output

`{ status: 200, error: false, meta: { variables, variableCollections } }`, both
keyed by ID. Values sit under each collection's default mode. `remote` is always
`false`.

## Failure behaviour

A Tokens page with no `meta` texts fails with a hint to check `FIGMA_FILE_ID`.
That's what the old Figma file returns: it has a `#️ Tokens` page, but not a
generated one.

The run also fails, writing nothing, when the page has drifted from the library:

- A layer isn't bound to a variable, because it was detached.
- A layer is bound to a different variable than its `meta` names.
- A collection lists a variable that has no layer, because the layer was deleted.

Every problem is listed in one error, which says to re-run the generator.

## What it can't see

- **Deleted, added or renamed variables.** Deleting a variable leaves its layers
  bound to the old ID, with the last value, and REST can't tell. A new variable
  has no layer until the generator runs, and a rename keeps exporting the old name
  until then.
- **Aliases.** A value reads as its resolved value. The library has no aliases
  today.

`extractVariables` is pure, so `test/figma/variables.test.js` covers it, and the
REST calls through a fake client, with no network call or Figma token.
