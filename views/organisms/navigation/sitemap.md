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

Lists the whole site from the `eleventyNavigation` tree, so it never drifts
from the pages that exist. Two headed groups, each a `<section>` in a two-column
grid inside one `<nav aria-label="Site map">`:

- **Pages**: root-level entries (`pages | eleventyNavigation`): home, work,
  posts, about, contact, user guide. Single posts and projects carry no
  `eleventyNavigation` key, so only their landing pages appear. Work carries
  a nested list: one link per industry section, `/work/#<slug>`, grouped from
  `projects` the same way `templates/projects/projects.njk` does.
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

It does not use the CMS `navigation` header items: those are curated and
partial.

## Role in the System

An **organism**: it composes the [[main-pages.njk]] molecule, used as-is
for every list with the same link styles. Rendered inside the badge dialog
([[badge.njk]]).

## Params

| Param        | Type                          | Description                                                                                                                                     |
| ------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages`      | array                         | `collections.all`. Filtered here through `eleventyNavigation`.                                                                                  |
| `projects`   | array                         | `collections.projects`. Grouped by industry as the Work page does; each industry becomes a link to `/work/#<slug>` in a nested list under Work. |
| `currentUrl` | string                        | The matching entry is marked `aria-current="page"`.                                                                                             |
| `classes`    | string, variant map, or array | Applied to the `<nav>` through `classes`.                                                                                                       |

## Notes

- Link text comes from [[nav-link.njk]], which prints the entry's `title`
  ("Work", "User Guide", …), falling back to the nav `key`.
- It renders no ids of its own, so it can sit on design doc pages beside
  the full [[design-pages.njk]] TOC without duplicating ids.
