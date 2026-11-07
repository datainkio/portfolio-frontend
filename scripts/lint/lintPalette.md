---
description: Sidecar for lintPalette.js — fails npm run validate when a template uses a colour utility that isn't in the theme palette.
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

## What it checks

- **Scope:** every `views/**/*.njk`, including classes inside `{{ … }}`
  variant maps. Nunjucks comments are skipped.
- **Rule:** a colour utility in `<family>-<shade>` form (`bg-`, `text-`,
  `border-*`, `fill-`, `ring-`, `from-`, and the rest in `COLOR_PROPS`) must
  name a colour declared as `--color-<family>-<shade>` in an `@theme` block
  under `styles/`. Variant prefixes and `/alpha` suffixes are ignored, so a
  `gray` step behind `md:hover:` with `/50` opacity is still caught.
- **Allowed:** `white`, `black`, `transparent`, `current`, and `inherit`.
  Unshaded theme colours such as `semantic-fail` pass, because the rule only
  reads the shaded form.

It catches off-palette families (`blue`, `zinc`) and undeclared steps of a
palette family (`neutral-150`).

## Limits

- Reads source, not rendered HTML. Classes built at runtime from data
  (`data/sanity/transforms/`) or in `ia/**/*.md` aren't scanned.
- Arbitrary colour values (a hex code in square brackets) and colours in
  `styles/*.css` aren't checked.

## Usage

```bash
npm run lint:palette
```
