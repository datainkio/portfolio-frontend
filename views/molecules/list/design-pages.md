---
description: Reusable presentational component.
type: template
---

# Design Pages

Reusable presentational component.

## Template

- Source: [[design-pages.njk]]
- Path: `views/molecules/list/design-pages.njk`

## Purpose

Encapsulates a reusable molecule per the project's atomic design conventions.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param        | Type   | Description                                                                                                                  |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `nav`        | array  | eleventyNavigation entries (`title`, `url`, `children`), up to three levels. The caller pre-filters them. Defaults to empty. |
| `currentUrl` | string | The entry whose `url` matches gets `aria-current="page"` and the highlighted style.                                          |

Fixed design: takes no styling params. Its colours are set for the dark
docs ground (`slate-950`): neutral links, `slate-800` hover, and a
`primary-900` current entry.

## Relationships

- Used by:
  - [[design-doc.njk|layouts/design-doc.njk]], as the sidebar of every page under `ia/docs/design/`, fed `collections.all | eleventyNavigation("Design")`

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
