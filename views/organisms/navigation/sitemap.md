---
description: "The site map: every root-level page in one list, with industry links nested under Work and the documentation pages under Docs."
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
from the pages that exist. One list inside `<nav aria-label="Site map">`, no
heading: the root-level entries (`pages | eleventyNavigation`), which are
home, work, docs and contact. About, Posts and User Guide set `hide: true`
and are skipped. Single posts and projects carry no `eleventyNavigation` key,
so only their landing pages appear. Two entries carry a nested list:

- **Work**: one link per industry section, `/work/#<slug>`, grouped from
  `projects` the same way `templates/projects/projects.njk` does.
- **Docs**: the pages that name `Docs` as parent. `Docs` is the key of the
  `/docs/` landing (`ia/docs/index.md`). Its children are the Sanity site
  pages under the documentation landing (see `ia/site-page.11tydata.md`),
  plus Design when `DOCS` is on (see `eleventy.config.md`).

Nesting stops at that second level, so Design is a single link. Its full
tree is the sidebar of [[design-pages.njk]].

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
