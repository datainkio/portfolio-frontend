---
description: "Directory data for the design-system reference: sets the design-doc layout, computes every page's sidebar entry, and reads a component page's sidecar into componentDoc."
permalink: false
eleventyExcludeFromCollections: true
---

# Design directory data

Sidecar for `design.11tydata.js`. It sits under `ia/`, so `permalink: false`
and `eleventyExcludeFromCollections` keep Eleventy from publishing it or
listing it in the sidebar.

## What it sets for every page under `ia/docs/design/`

- `layout: layouts/design-doc.njk`
- `eleventyNavigation`: this folder's README is the `Design` key, whose parent
  `Docs` doesn't exist, which keeps it out of root-level navigation. Each
  subfolder README is a section under `Design`, ordered tokens, atoms,
  molecules, organisms, templates, layouts. Every other page sits under its
  section, sorted alphabetically by title (eleventy-navigation sorts by a
  numeric `order` only, so the title's first six characters are encoded in
  base 37).
- `componentDoc`, when the page names a `component`: the result of
  `readComponentSidecar()` from `eleventy/collections/designSystem.js`.

A page can set its own `eleventyNavigation.key` to opt out of the computed
entry.

## See also

- `views/layouts/design-doc.md`, the page contract
- `eleventy/collections/designSystem.md`, the readers
