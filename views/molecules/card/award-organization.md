---
description: "Defines Nunjucks macro: render."
type: template
links:
  - "[award](../../atoms/award.md)"
  - "[inline](../../atoms/svg/inline.md)"
---

# Award Organization

Defines Nunjucks macro: `render`.

## Template

- Source: [[award-organization.njk]]
- Path: `views/molecules/card/award-organization.njk`

## Purpose

Renders one organization's logo and its group of awards as a card. With `logoOnly`, it renders the logo alone, which the homepage awards section uses.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param      | Type                          | Description                                                                                                                                                                                                                                   |
| ---------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `group`    | object                        | `organization` (`logo` with `asset`, `alt`, and `inline`; and `title`) plus `items`, an array of award records. Each item is passed to `atoms/award.njk`, which reads its `title`.                                                            |
| `classes`  | string, variant map, or array | Applied to the `<article>` through `classes`, after the baseline.                                                                                                                                                                             |
| `logoOnly` | boolean                       | Defaults to `false`. When `true`, the card drops the title and award list, renders the logo in a fixed-height box the width of its slot with the artwork centered, and labels the logo with the organization's `title` instead of `logo.alt`. |

## Relationships

- Imports:
  - [[award.njk|atoms/award.njk]]
  - [[inline.njk|atoms/svg/inline.njk]]
- Likely used by:
  - [[awards.njk|molecules/awards.njk]]
  - [[awards.njk|organisms/section/awards.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
- File carries a `TODO` comment noting the card should be "properly abstracted" — leave it, out of scope for a sidecar pass.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
