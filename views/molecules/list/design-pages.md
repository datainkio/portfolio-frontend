---
description: The sidebar navigation of these design-system docs, with sections, labelled role groups, and the current page highlighted.
type: template
---

# Design Pages

The sidebar of every page under `/docs/design/`: one list per section
(Tokens, Atoms, Molecules, Organisms), each divided into labelled role groups
(Cards, Lists, Print proof, Homepage sections, …) with the pages beneath.

## Template

- Source: [[design-pages.njk]]
- Path: `views/molecules/list/design-pages.njk`

## Purpose

Turns the `Design` eleventyNavigation tree into a grouped sidebar. The
groups aren't nav entries of their own: each page carries a `group` key, set
by `ia/docs/design/design.11tydata.js`, and arrives sorted, so the template
turns consecutive runs of one group into one labelled list. A group without a
title (the tokens) renders its pages directly under the section link.

A section with no pages is skipped, so an empty section README (Templates,
Layouts) doesn't appear as a dead end until it has pages.

## Role in the System

Classified as a **component** at the atomic **molecule** level based on its location under `views/`.

## Params

| Param        | Type   | Description                                                                                                                                              |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nav`        | array  | eleventyNavigation entries (`title`, `url`, `children`). Each child may carry a `group` label; children are expected pre-sorted. The caller pre-filters. |
| `currentUrl` | string | The entry whose `url` matches gets `aria-current="page"` and the highlighted style.                                                                      |

Fixed design: takes no styling params. Its colours are set for the dark
docs ground (`neutral-950`): neutral links, `neutral-800` hover, a
`primary-900` current entry, and `neutral-500` uppercase group labels.

## Accessibility

- `<nav aria-label="Design section navigation">` with `role="list"` on every
  list.
- Each group label is a `<span>` with an id; the group's list points at it
  with `aria-labelledby`, so screen readers announce the group when entering
  the list.
- The current page is marked with `aria-current="page"`.

## Relationships

- Used by:
  - [[design-doc.njk|layouts/design-doc.njk]], as the sidebar of every page under `ia/docs/design/`, fed `collections.all | eleventyNavigation("Design")`
- Reads `group` from entries computed by `ia/docs/design/design.11tydata.js`

## Notes for Future Maintenance

- The grouping lives in the data file's `GROUPS` table, not here. To move a
  page between groups or reorder one, edit that table.
- Preserve semantic HTML and accessibility attributes when editing.
