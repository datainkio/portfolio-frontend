---
description: Sidecar for TokenService.js — reads non-colour design tokens from the Figma library's variables and shadow styles, and writes styles/tokens.css.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[TokensFile]]"
  - "[[VariablesService]]"
  - "[[fetchFigma]]"
  - "[Decision](../../docs/design-system/adr-0001-figma-owns-design-tokens.md)"
---

# TokenService.js

Reads tokens from the design-system library through
[VariablesService](VariablesService.md), which reads the library's Tokens page.

**FLOAT variables,** grouped by the first part of their name:

| Group         | Variables                                     | Value written                                  |
| ------------- | --------------------------------------------- | ---------------------------------------------- |
| `spacing`     | `spacing/*`                                   | px as rem. `spacing/0_5` becomes the `0.5` key |
| `container`   | `container/*`                                 | px as rem                                      |
| `radius`      | `radius/*`                                    | px as rem. `radius/default` becomes `--radius` |
| `text`        | `text/<step>/size`, `text/<step>/line-height` | Size as rem, line height as a ratio of it      |
| `font-weight` | `font-weight/*`                               | The number                                     |
| `leading`     | `leading/*`                                   | The ratio, to 3 places                         |
| `tracking`    | `tracking/*`                                  | em, to 3 places                                |

Other variables are ignored: colours (see [PaletteService](PaletteService.md)),
font families and motion (both maintained in code), and `screen/*` (declared by
hand in `styles/sizes.css`).

**Shadow effect styles.** Figma has no variable type for a shadow, so `shadow`
comes from the `EffectStyle/Shadow/*` samples on the Tokens page. Visible drop
and inner shadows are written in Figma's order.

`isTokensPage` and `shadowValue` are exported for VariablesService and the tests.

## Failure behaviour

- **A group with no tokens:** throws and leaves the file alone. Writing a partial
  set would drop the missing group back to Tailwind's defaults with no warning.
- **A type size without its line height,** or the reverse: throws.

`extractTokens` is pure, so `test/figma/tokens.test.js` covers it without a
network call or a Figma token.
