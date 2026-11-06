---
description: Sidecar for TokenService.js — reads non-colour design tokens from the Figma Tokens page and the file's text styles, and writes styles/tokens.css.
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

Reads tokens from two places in the Figma file.

**Text styles,** which the file already has:

| Group         | Text style          | Value read                       |
| ------------- | ------------------- | -------------------------------- |
| `text`        | `fontSize/*`        | Font size and line height        |
| `leading`     | `lineHeight/*`      | Line height divided by font size |
| `font-weight` | `fontWeight/sans/*` | Font weight                      |

**Named layers** on the page whose name ends in `Tokens`. A layer named
`<group>/<name>` defines one token, and other layers are ignored:

| Group       | Layer     | Value read                              |
| ----------- | --------- | --------------------------------------- |
| `spacing`   | Rectangle | Width, as rem                           |
| `container` | Rectangle | Width, as rem                           |
| `radius`    | Rectangle | Corner radius, as rem                   |
| `shadow`    | Rectangle | Drop and inner shadow effects           |
| `tracking`  | Text      | Letter spacing divided by font size, em |

Why layers and not Figma Variables: the Variables REST API needs an Enterprise
plan, and Figma has no style type for spacing or radius. The file endpoint this
sync already calls returns these layer properties on any plan.

## Failure behaviour

- **No token layers yet:** logs a warning and leaves `styles/tokens.css` alone, so
  `npm run build` keeps working before the page is authored.
- **A group with no tokens:** throws and leaves the file alone. Writing a partial
  set would drop the missing group back to Tailwind's defaults with no warning.
- **A type style with an auto line height:** throws and leaves the file alone. Auto
  is a metric of the font in Figma, not a design decision.

`extractTokens` is pure, so `test/figma/tokens.test.js` covers it without a
network call or a Figma token.
