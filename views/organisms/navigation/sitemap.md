---
description: "The site map: every root-level page, then the design-system docs and their sections."
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

Lists the whole site from the `eleventyNavigation` tree, so it never drifts
from the pages that exist. Two headed groups inside one `<nav aria-label="Site map">`:

- **Pages**: root-level entries (`pages | eleventyNavigation`): home, work,
  posts, about, contact, user guide. Single posts and projects carry no
  `eleventyNavigation` key, so only their landing pages appear.
- **Docs**: the Design root (`pages | eleventyNavigation("Docs")`), then its
  top-level sections (`pages | eleventyNavigation("Design")`: tokens, atoms,
  molecules, organisms, templates, layouts) as plain links, not their pages.
  A section with no pages is left out, as [[design-pages.njk]] does. "Docs"
  is the parent the Design root names but no page defines (see
  `ia/docs/design/design.11tydata.js`), so it is a heading here, not a nav
  key.

It does not use the CMS `navigation` header items: those are curated and
partial.

## Role in the System

An **organism**: it composes the [[main-pages.njk]] molecule, used as-is
for every list with the same link styles. Rendered inside the badge dialog
([[badge.njk]]).

## Params

| Param        | Type                          | Description                                                    |
| ------------ | ----------------------------- | -------------------------------------------------------------- |
| `pages`      | array                         | `collections.all`. Filtered here through `eleventyNavigation`. |
| `currentUrl` | string                        | The matching entry is marked `aria-current="page"`.            |
| `classes`    | string, variant map, or array | Applied to the `<nav>` through `classes`.                      |

## Notes

- Link text comes from [[nav-link.njk]], which prints the entry's `title`
  ("Work", "User Guide", …), falling back to the nav `key`.
- It renders no ids of its own, so it can sit on design doc pages beside
  the full [[design-pages.njk]] TOC without duplicating ids.
