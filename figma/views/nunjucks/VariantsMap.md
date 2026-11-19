---
description: Sidecar for VariantsMap.js — compares a template's variants map with Figma's colours and writes the bg, text and border utilities in place, reporting a row per slot.
type: script
tags:
  - figma
  - design-system
  - components
links:
  - "[[ComponentService]]"
  - "[[syncComponents]]"
  - "[[button]]"
---

# VariantsMap.js

The diff and the writer for `npm run sync:components`. Pure functions over a
template's text; it reads no file and calls no API. Contract:
[component-sync.spec.md](../../../specs/component-sync.spec.md).

## The map it reads

```njk
{%- set variants = {
  "cta":  "m-4 py-2 px-4 text-neutral-100 bg-secondary-600 hover:bg-secondary-800",
  "dark": "py-1 px-3 rounded text-white bg-neutral-900 hover:bg-neutral-700"
} -%}
```

One `"key": "classes"` entry per line, both double-quoted. Any other line in the
map fails the run rather than being skipped, because a skipped key would be
reported as a Style with no key.

## Exports

| Export                                            | Does                                                                    |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `applyColours(text, colours, { notes, palette })` | The template with Figma's colours written, and the report rows.         |
| `applySlot(variant, slot, figma, palette)`        | One slot's new class string and rows.                                   |
| `findVariantsMap(text)` / `readVariants(text)`    | Each entry's string, with its offsets / as a `{ key: classes }` object. |
| `colourOf(token, prefix, head, palette)`          | The colour in a utility, or null.                                       |
| `HEADS`, `PREFIXES`, `ACTIONS`                    | `bg-` `text-` `border-`; none and `hover:`; the four report actions.    |

## What counts as a colour utility

A class with no prefix or exactly `hover:`, then `bg-`, `text-` or `border-`,
then a colour: `family-step` (`neutral-700`), `white`, `black`, or a palette
name such as `semantic-fail`. So `text-sm`, `border`, `border-2`,
`group-hover:bg-…` and `focus:bg-…` are left alone and never counted.

## What it writes

Per variant × state × property, where the Figma colour is in the palette:

- The slot has a utility with that head: its colour is replaced in place.
- It doesn't: the utility is appended at the end of the string.
- A hover utility is written only where Figma's hover differs from its default.

Nothing else in a slot moves. Nothing outside the map changes, and no key is
added or removed.

## Rows

`{ variant, state, property, figma, template, action, note? }`. `figma` is the
utility Figma implies, `template` the one the slot has now, and either is null
when there isn't one.

| Action             | When                                                                                                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `written`          | The utility was replaced or appended.                                                                                                                                                                                                                                        |
| `unchanged`        | The slot already matches; also a hover that matches its default, with no hover utility.                                                                                                                                                                                      |
| `needs a hand`     | A colour utility with no Figma counterpart, a second one with the same head, a hover utility when Figma's hover matches its default, a hover that drops the default's colour, an unbound colour, a Style with no key or a key with no Style, and the reader's `layer` notes. |
| `unknown variable` | The bound variable isn't in the export, or the colour isn't in `palette`.                                                                                                                                                                                                    |

`test/figma/components.test.js` covers each action.
