---
description: "The site map: every root-level page, then the Design reference with its top-level entries and parts."
type: template
links:
  - "[main-pages](../../molecules/list/main-pages.md)"
  - "[badge](../header/badge.md)"
---

# Sitemap

Defines Nunjucks macro: `render`.

## Template

- Source: [[sitemap.njk]]
- Path: `views/organisms/navigation/sitemap.njk`

## Purpose

Lists the site's root pages from the Sanity `navigation` document and the docs
from the `eleventyNavigation` tree. Two headed groups, each a `<section>` in a two-column
grid inside one `<nav aria-label="Site map">`:

- **Pages**: the CMS `navigation[0].headerItems`, in the document's order.
  A page missing from the Sanity header (About, User guide) is not listed.
  The section is omitted when there are no header items.
- **Docs**: the children of "Docs" (`pages | eleventyNavigation("Docs")`),
  which is one root, Design. Beneath the Design link, an indented, smaller
  list of its top-level entries as plain links, not their pages. An entry with
  a `part` (Styling, Choreography) isn't listed itself: the part's name is,
  once, linking to the part's first entry, so a title two parts share
  ("Atoms") doesn't appear twice. Top-level pages such as Accessibility and
  Maintenance appear as links. The full tree is the sidebar of
  [[design-pages.njk]]. "Docs" is the parent the root names but no page
  defines (see `ia/docs/design/design.11tydata.js`), so it is a heading here,
  not a nav key.

The Docs group still reads the `eleventyNavigation` tree.

## Role in the System

An **organism**: it composes the [[main-pages.njk]] molecule, used as-is
for every list with the same link styles. Rendered inside the badge dialog
([[badge.njk]]).

## Params

| Param        | Type                          | Description                                                    |
| ------------ | ----------------------------- | -------------------------------------------------------------- |
| `cms`        | object                        | `navigation[0].headerItems` feed the Pages list.               |
| `pages`      | array                         | `collections.all`. The Docs group filters it through `eleventyNavigation("Docs")`. |
| `currentUrl` | string                        | The matching entry is marked `aria-current="page"`.            |
| `classes`    | string, variant map, or array | Applied to the `<nav>` through `classes`.                      |

## Notes

- Link text comes from [[nav-link.njk]], which prints the entry's `title`
  ("Work", "User Guide", …), falling back to the nav `key`.
- It renders no ids of its own, so it can sit on design doc pages beside
  the full [[design-pages.njk]] TOC without duplicating ids.
