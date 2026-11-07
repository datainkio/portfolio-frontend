---
description: Sidecar for lintPalette.js — fails npm run validate when a template, hand-written stylesheet, or script uses a colour that isn't in the palette, or an arbitrary value recurs across files.
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

Enforces rules 1 (colour) and 2 (tokens) in [[design-system.spec]]. It's
report-only and exits non-zero on findings, so `npm run validate` fails on
drift.

Tailwind's default palette still loads alongside the theme, so a background
from its `blue` family builds and renders, and nothing else would catch it.

## Scope

- Every `views/**/*.njk`, including classes inside `{{ … }}` variant maps.
  Nunjucks comments are skipped.
- Every hand-written stylesheet under `styles/`: declaration values and
  `@apply` lines. CSS comments are skipped. `colors.css`, `tokens.css`, and
  `motion.css` are skipped because the syncs write them: they define the
  palette rather than use it.
- Every `js/**/*.js` (except `js/vendor/`) and `data/sanity/transforms/**/*.js`:
  the words in string and template literals, including strings inside
  `${…}`, so `classList.toggle("…")` and serializer markup are both read.
  Comments and regex literals are skipped.

The palette is the `--color-*` properties in `styles/colors.css`, plus `black`
and `white`.

## Rules

| Rule                  | Fails on                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `off-palette`         | A colour utility whose `<family>-<shade>` isn't in the palette, e.g. a `zinc` step or `neutral-150`                   |
| `literal`             | A colour written as a value: hex, `rgb()`, `hsl()`, `oklch()` and the other colour functions, or a common colour name |
| `undeclared-var`      | `var(--color-…)` naming a colour that isn't in the palette                                                            |
| `declared-outside`    | A `--color-…` property declared anywhere but `styles/colors.css`, which the Figma sync owns                           |
| `recurring-arbitrary` | The same arbitrary-value utility, e.g. `max-w-[68ch]`, used in more than one file: a missing token                    |

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
- **Recurring arbitrary values** are keyed by utility with variants stripped,
  so `p-[13px]` and `md:p-[13px]` in two files count as one value. A value
  that reads a variable (`[var(--…)]`) already uses a token and is skipped.
  `MIRRORS` names files that copy another file's markup by hand, as
  `portableText.js` copies `lightbox-dialog.njk`; the pair counts as one file.
  A one-off arbitrary value is allowed, per the spec.
- **Black and white** are written `var(--color-black)` and
  `var(--color-white)`. For transparency, use
  `color-mix(in oklab, var(--color-black) 30%, transparent)`; inside a class,
  spaces become underscores. Tailwind and the minifier compile it back to a
  hex value with alpha.

## Limits

- Reads source, not rendered HTML. Classes in `ia/**/*.md` aren't scanned,
  nor are class names assembled from fragments (`"bg-" + name`).
- In JavaScript only class words are checked. Colour literals in JS values
  (logger styles, SVG `fill` attributes, GSAP tweens) aren't.
- Bare arbitrary properties (`[mask-type:alpha]`) aren't counted as recurring,
  because in JavaScript they look like attribute selectors.
- Named colours are all 148 CSS names, matched in any case, but only in values:
  CSS declarations and `[…]` arbitrary values.
- In CSS, declarations are read from innermost blocks. A declaration that sits
  beside a nested rule in the same block is missed.

## Usage

```bash
npm run lint:palette
```
