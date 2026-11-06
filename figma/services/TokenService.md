---
description: Sidecar for TokenService.js — reads non-colour design tokens from named layers on the Figma Tokens page and writes styles/tokens.css.
type: script
tags:
  - figma
  - design-tokens
links:
  - "[[TokensFile]]"
  - "[[fetchFigma]]"
  - "[Decision](../../docs/design-system/adr-0001-figma-owns-design-tokens.md)"
---

# TokenService.js

Reads spacing, container, radius, shadow, and type tokens from a Figma page
named `Tokens`. A layer named `<group>/<name>` defines one token. Other layers
are ignored, so the page can carry labels.

| Group         | Layer     | Value read                              |
| ------------- | --------- | --------------------------------------- |
| `spacing`     | Rectangle | Width, as rem                           |
| `container`   | Rectangle | Width, as rem                           |
| `radius`      | Rectangle | Corner radius, as rem                   |
| `shadow`      | Rectangle | Drop and inner shadow effects           |
| `text`        | Text      | Font size and line height               |
| `font-weight` | Text      | Font weight                             |
| `leading`     | Text      | Line height divided by font size        |
| `tracking`    | Text      | Letter spacing divided by font size, em |

Why layers and not Figma Variables: the Variables REST API needs an Enterprise
plan, and Figma has no style type for spacing or radius. The file endpoint this
sync already calls returns these layer properties on any plan.

## Failure behaviour

- **No `Tokens` page:** logs a warning and leaves `styles/tokens.css` alone.
- **A group with no layers:** throws and leaves the file alone. Writing a partial
  set would drop the missing group back to Tailwind's defaults with no warning.

`extractTokens` is pure, so `test/figma/tokens.test.js` covers it without a
network call or a Figma token.
