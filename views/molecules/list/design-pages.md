---
description: The sidebar navigation of the design and motion references, with sections, labelled role groups, and the current page highlighted.
type: template
---

# Design Pages

The sidebar of every page under `/docs/design/`: one list per section
(Tokens, Decoration, Atoms, Molecules, Organisms, and the choreography layers), each divided into labelled role groups
(Cards, Lists, Print proof, Homepage sections, …) with the pages beneath.
Sections collapse; leaf pages are plain links.

## Template

- Source: [[design-pages.njk]]
- Path: `views/molecules/list/design-pages.njk`

## Purpose

Turns the `Design` eleventyNavigation tree into a grouped sidebar. The
groups aren't nav entries of their own: each page carries a `group` key, set
by `ia/docs/design/design.11tydata.js`, and arrives sorted, so the template
turns consecutive runs of one group into one labelled list. A group without a
title (the tokens) renders its pages directly under the section link.

A top-level entry with no children renders as a plain link (a leaf page). One
with children renders as a `<details>` whose `<summary>` is the section
title; inside, the first link is "Overview" (the section's own page), then
the group lists. It is `open` when the current URL is the section's or any of
its pages'. No JavaScript.

The Design root page can't be a child of itself, so the caller passes it as
`home`. It renders first, as a plain link with the same current-page
treatment as the rest.

A top-level entry may carry `part`. When it is set and differs from the
previous entry's, the entries of that run sit under a label (one step more
prominent than the group labels). Entries without `part` get no label.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param        | Type   | Description                                                                                                                                                                                  |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nav`        | array  | eleventyNavigation entries (`title`, `url`, `children`). Each child may carry a `group` label; children are expected pre-sorted. A top-level entry may carry `part`. The caller pre-filters. |
| `currentUrl` | string | The entry whose `url` matches gets `aria-current="page"` and the highlighted style.                                                                                                          |
| `home`       | object | Optional `{ url, title }`. Renders as the first link, before any part or section. The layout passes the Design root as "Introduction".                                                       |
| `label`      | string | The `<nav>`'s accessible name. Defaults to "Design section navigation"; the layout passes "Design section navigation".                                                                       |

Fixed design: takes no styling params. Its colours are set for the dark
docs ground (`neutral-950`): neutral links, `neutral-800` hover, a
`primary-900` current entry, and `neutral-500` uppercase group labels.

## Accessibility

- `<nav aria-label="Design section navigation">` with `role="list"` on every
  list.
- Each part and group label is a `<span>` with an id; its list points at it
  with `aria-labelledby`, so screen readers announce it when entering the
  list. Group ids include the part and section title, so two sections both
  titled "Atoms" keep unique ids.
- `<summary>` carries the same visible focus ring as the links; it holds text
  only, with no link inside.
- The current page is marked with `aria-current="page"`.

## Relationships

- Used by:
  - [[design-doc.njk|layouts/design-doc.njk]], as the sidebar of every page under `ia/docs/design/`, fed `collections.all | eleventyNavigation("Design")`
- Reads `group` from entries computed by `ia/docs/design/design.11tydata.js`

## Notes for Future Maintenance

- The grouping lives in the data file's `GROUPS` table, not here. To move a
  page between groups or reorder one, edit that table.
- Preserve semantic HTML and accessibility attributes when editing.
