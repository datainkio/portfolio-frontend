---
description: Sidecar for inventoryDesignSystem.js — inventories the tokens declared in code and every Tailwind utility the templates use, as the baseline for deriving the design system.
type: script
tags:
  - design-system
  - design-tokens
  - tailwind
  - tooling
links:
  - "[[fetchFigma]]"
  - "[[buildReadmeAssets]]"
---

# inventoryDesignSystem.js

Writes `docs/design-system/inventory.json` (complete) and `inventory.md`
(summary). It answers one question: what design system does the code already
have? Three sources:

- **Tokens declared:** `@theme` and `:root` custom properties in `styles/`,
  `@utility` names and plain `.class` selectors in `styles/`, and the motion
  tokens in `js/choreography/tokens/motion/motion.js`.
- **Utilities used:** every word inside a string literal in `views/**/*.njk`
  and every `@apply` line in `styles/`, classified by what a token would
  govern: color, spacing, typography, radius, shadow, border, z-index,
  opacity, motion, custom, layout. Comments are stripped first.
- **Candidates:** arbitrary values (`[…]`) with the files that use them, and
  color families by source (`figma`, `tailwind-default`, `built-in`).

## Usage

```bash
npm run inventory:design
```

Not part of `build` or `quick`. Deterministic: same source, same output. Rerun
it after changing templates or tokens and commit the result.

## Reading the output

- `tailwind-default` colour families (`slate`, `gray`, `blue`, …) have no Figma
  record. They are either drift or a decision waiting to be made.
- A value in **Arbitrary values** that recurs across files is a token
  candidate; one that appears once is probably fine where it is.
- **Unclassified** is words the rules don't recognise. Most are ids and data
  keys. A real utility there is a gap in the classifier, so extend the regex.

## Limits

- Reads source, not rendered HTML. Classes assembled at runtime from data
  (Sanity transforms, the `classes` filter's variant maps) count once per
  literal, not per render.
- A word has to sit inside quotes to be seen. Bare words in `{% set %}`
  expressions are missed.
