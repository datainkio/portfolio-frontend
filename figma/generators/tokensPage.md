---
description: Sidecar for tokensPage.js — Plugin API script that builds the design-system library's Tokens page, one bound layer per variable, so a Pro token can read variables over REST.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[VariablesService]]"
  - "[[fetchFigmaVariables]]"
---

# tokensPage.js

Builds or refreshes the `Tokens` page in the design-system library
([dataink.io Design System](https://www.figma.com/design/tl8ANcSSVEzPOS6ZU6lSI1)).
Figma's Variables REST API needs an Enterprise plan, but the file endpoint
returns a layer's bound value and the bound variable's ID on any plan. This page
gives every variable a layer to be bound to.

## Run it

It's Figma Plugin API code, not Node. Run it through the Figma MCP's `use_figma`
tool with the file's contents followed by `return await buildTokensPage(figma);`,
or call it from a development plugin.

Re-run it after adding, renaming or deleting a variable, text style or effect
style. Editing a value needs no re-run, because the bound layers update with it.
Each run deletes the page's contents and rebuilds them, so node IDs change.

## What it writes

| Variable type | Layer named `{Collection}/{variable}` | Bound property                 |
| ------------- | ------------------------------------- | ------------------------------ |
| `COLOR`       | 32 px frame                           | Fill colour                    |
| `FLOAT`       | Auto-layout frame                     | Gap, which accepts negatives   |
| `STRING`      | Auto-layout frame                     | `characters` of a `value` text |

Each layer also holds a hidden text named `meta`, with JSON that REST can't
return: the variable's key, collection, type, scopes, code syntax, description
and publishing flag. Each collection section holds a `meta` text with the
collection's key, modes and variable IDs.

Below the variables, the page has one sample per text style and per effect
style. REST lists only the styles that some layer uses, so the samples put every
style into the response's `styles` map.

## Limits

- **One mode per collection.** The script throws on a collection with more.
- **COLOR, FLOAT and STRING only.** It throws on BOOLEAN variables, which the
  library doesn't have.
- **DRAFT PAPER can't load in Figma's cloud runtime.** Display samples are typed
  in IBM Plex Sans Light, then given their style. Their `fontFamily` binding to
  `font/display` is lifted for that step and restored afterwards, even when the
  script fails.
