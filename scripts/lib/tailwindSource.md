---
description: Sidecar for tailwindSource.js — reads Tailwind classes from templates and custom properties from theme CSS, shared by the design inventory and the palette lint.
type: script
tags:
  - design-system
  - tailwind
  - tooling
links:
  - "[[inventoryDesignSystem]]"
  - "[[lintPalette]]"
---

# tailwindSource.js

Helpers that read the design system out of source files. The inventory
(`scripts/generate/`) and the palette lint (`scripts/lint/`) both use them, so
the classes one counts are the classes the other checks.

| Export             | Does                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `customProps`      | Every `--name: value;` inside the blocks a selector regex opens, e.g. `@theme { … }`                                     |
| `stripCssComments` | Removes `/* … */`                                                                                                        |
| `stripNjkComments` | Removes `{# … #}`                                                                                                        |
| `literalWords`     | Words inside every quoted string, including strings nested in `{{ … }}` and `{% … %}` tags                               |
| `jsLiteralWords`   | Words inside every JavaScript string and template literal, split at quotes and `<>`; comments and regex literals skipped |
| `applyWords`       | Words on every `@apply …;` line                                                                                          |
| `splitVariants`    | Splits `md:hover:-mt-4` into variants, base, and a negative flag                                                         |
| `COLOR_RE`         | Matches a colour utility: property, built-in colour or `<family>-<shade>`, optional `/alpha`                             |
