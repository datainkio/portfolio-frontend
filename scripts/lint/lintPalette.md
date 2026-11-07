---
description: Sidecar for lintPalette.js — fails npm run validate when a template or hand-written stylesheet uses a colour that isn't in the palette.
type: script
tags:
  - design-system
  - design-tokens
  - tooling
links:
  - "[[tailwindSource]]"
  - "[[design-system.spec]]"
---

# lintPalette.js

Enforces the colour rule in [[design-system.spec]]. It's report-only and exits
non-zero on findings, so `npm run validate` fails on drift.

Tailwind's default palette still loads alongside the theme, so a background
from its `blue` family builds and renders, and nothing else would catch it.

## Scope

- Every `views/**/*.njk`, including classes inside `{{ … }}` variant maps.
  Nunjucks comments are skipped.
- Every hand-written stylesheet under `styles/`: declaration values and
  `@apply` lines. CSS comments are skipped. `colors.css`, `tokens.css`, and
  `motion.css` are skipped because the syncs write them: they define the
  palette rather than use it.

The palette is the `--color-*` properties in `styles/colors.css`, plus `black`
and `white`.

## Rules

| Rule               | Fails on                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `off-palette`      | A colour utility whose `<family>-<shade>` isn't in the palette, e.g. a `zinc` step or `neutral-150`                   |
| `literal`          | A colour written as a value: hex, `rgb()`, `hsl()`, `oklch()` and the other colour functions, or a common colour name |
| `undeclared-var`   | `var(--color-…)` naming a colour that isn't in the palette                                                            |
| `declared-outside` | A `--color-…` property declared anywhere but `styles/colors.css`, which the Figma sync owns                           |

- **Colour utilities** are the built-in ones (`bg-`, `text-`, `border-*`,
  `fill-`, `ring-`, `from-`, and the rest of `COLOR_PROPS`), plus every
  `@utility name-*` whose body reads `--value(--color…)`, such as
  `registration-marks-*` and `bg-halftone-*`. Both are checked in the shaded
  form only, because a name like `bg-halftone-*` also takes a spacing step.
  Unshaded palette colours such as `semantic-fail` pass.
- **Variant prefixes and `/alpha`** are ignored, so a `gray` step behind
  `md:hover:` with `/50` opacity is still caught.
- **Arbitrary values** (`[…]`) are checked for literals and colour variables,
  in both utilities and arbitrary properties.
- **Black and white** are written `var(--color-black)` and
  `var(--color-white)`. For transparency, use
  `color-mix(in oklab, var(--color-black) 30%, transparent)`; inside a class,
  spaces become underscores. Tailwind and the minifier compile it back to a
  hex value with alpha.

## Limits

- Reads source, not rendered HTML. Classes built at runtime from data
  (`data/sanity/transforms/`) or in `ia/**/*.md` aren't scanned, nor is
  JavaScript.
- Named colours are a short list (`black`, `white`, `red`, `green`, `blue`,
  `yellow`, `orange`, `purple`, `pink`, `gray`, `grey`), not all 148 CSS names.
- In CSS, declarations are read from innermost blocks. A declaration that sits
  beside a nested rule in the same block is missed.

## Usage

```bash
npm run lint:palette
```
