---
title: Tokens
description: Every design token the site declares, rendered from the theme files that declare it, with where each group comes from and how to change it.
type: index
---

Tokens are the named values every component draws on: colour, spacing, type,
radius, shadow, and motion. Each one is a Tailwind theme variable, so you use
it as an ordinary utility (`bg-primary-500`, `p-4`, `text-2xl`,
`shadow-b-md`, `duration-fast`), never as a raw value.

These pages read the theme files at build time, so they always show what the
CSS declares.

## Where each group comes from

| Group                                                      | Source of truth                           | Written to                           | To change it                               |
| ---------------------------------------------------------- | ----------------------------------------- | ------------------------------------ | ------------------------------------------ |
| [Colour](colour/)                                          | Figma paint styles                        | `styles/colors.css`                  | Edit in Figma, then `npm run build:design` |
| [Spacing and containers](spacing/)                         | Named layers on Figma's Tokens page       | `styles/tokens.css`                  | Edit in Figma, then `npm run build:design` |
| [Radius and shadow](radius-and-shadow/)                    | Named layers on Figma's Tokens page       | `styles/tokens.css`                  | Edit in Figma, then `npm run build:design` |
| [Typography](typography/): size, weight, leading, tracking | Figma text styles and layers              | `styles/tokens.css`                  | Edit in Figma, then `npm run build:design` |
| [Typography](typography/): families                        | Code                                      | `styles/typography/fontFamilies.css` | Edit by hand; the fonts are self-hosted    |
| [Motion](motion/)                                          | `js/choreography/tokens/motion/motion.js` | `styles/motion.css`                  | Edit the JS, then `npm run build:motion`   |

Never edit `colors.css`, `tokens.css`, or `motion.css` by hand: the next sync
overwrites them. After `build:design`, run
`npx prettier --write styles/colors.css`. The decision record is
`docs/design-system/adr-0001-figma-owns-design-tokens.md`.

The current colour file was generated from Figma version
`{{ designTokens.source.figmaVersion }}`, last modified
{{ designTokens.source.figmaModified }}.

## Using tokens in a template

- Reach for the token utility before an arbitrary value. `p-4` is a token;
  `p-[17px]` bypasses the system.
- Use only the palette families on the [colour page](colour/). Tailwind's
  default families (`blue`, `red`, `green`, `yellow`, `gray`) were dropped
  on 2026-11-06. They still compile, because nothing resets Tailwind's
  default theme, so keeping them out is up to you until the planned lint rule
  lands.
- For invalid states, use `semantic-fail`. On paper, check the contrast column
  first: the semantic colours fall short of 4.5:1 there, which is why the
  contact form's status text uses `tertiary-600` and `secondary-700`.
- Project utilities built on these tokens (gels, inner borders, registration
  marks, masks) are on the [utilities page](utilities/).
