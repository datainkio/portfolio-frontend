---
description: "Readers for the living design-system reference: parse the generated theme files into grouped tokens, and pull a component's description and params from its sidecar."
tags:
  - collection
  - design-system
  - design-tokens
aliases:
  - Design system readers
links:
  - "[[eleventy/collections/README|collections]]"
  - "[[index]]"
  - "[[design-doc]]"
---

# Design system readers

Both readers parse files that already exist, so the reference under
`ia/docs/design/` can't drift from them.

## `readDesignTokens()`

Registered by [[index]] as the `designTokens` global. Reads the `@theme`
blocks of `styles/colors.css`, `styles/tokens.css`, `styles/motion.css`, and
`styles/typography/fontFamilies.css`, and groups them:

| Key          | Items                                                 | Utility          |
| ------------ | ----------------------------------------------------- | ---------------- |
| `palette`    | `{ family, shades: [{ shade, value, contrast }] }`    | `bg-primary-500` |
| `spacing`    | `{ key, value }`, numeric order                       | `p-4`, `w-1.5`   |
| `container`  | `{ key, value }`                                      | `max-w-xl`       |
| `radius`     | `{ key, value }`; `key` is `""` for bare              | `rounded-lg`     |
| `shadow`     | `{ key, value }`                                      | `shadow-b-md`    |
| `text`       | `{ key, value, lineHeight }`                          | `text-2xl`       |
| `fontWeight` | `{ key, value }`                                      | `font-semibold`  |
| `leading`    | `{ key, value }`                                      | `leading-snug`   |
| `tracking`   | `{ key, value }`                                      | `tracking-wide`  |
| `font`       | `{ key, value }`                                      | `font-display`   |
| `duration`   | `{ key, value }`                                      | `duration-fast`  |
| `ease`       | `{ key, value, points }`                              | `ease-springy`   |
| `grounds`    | `{ paper, ground }`: `neutral-50` and `slate-950` hex | —                |
| `source`     | `{ figmaVersion, figmaModified }`                     | —                |

Each colour's `contrast` is its WCAG ratio against both grounds,
`{ paper, ground }`, to one decimal place.

Tailwind writes `.` in theme keys as `_`, so `--spacing-1_5` becomes key
`1.5`.

## `readComponentSidecar(component)`

Called by `ia/docs/design/design.11tydata.js` for a page whose frontmatter
names a `component` (a path under `views/`). Returns `source`, `sidecar`,
`importPath`, `alias` (PascalCase of the file name), `description`, and
`params`.

`params` is the first of these the sidecar has: a `## Params` section, a
`| Param` table under another heading, or the `## Data and Context` bullets.
Wikilinks and relative `.md` links are reduced to their text, because they
don't resolve on the site.

## Source

- Path: `eleventy/collections/designSystem.js`
