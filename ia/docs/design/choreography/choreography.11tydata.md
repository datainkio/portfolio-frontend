---
description: "Directory data for the choreography reference: sets the design-doc layout and the Choreography sidebar, and computes every page's sidebar entry, including the pages paginated from choreography sidecars."
permalink: false
eleventyExcludeFromCollections: true
---

# Choreography directory data

Sidecar for `choreography.11tydata.js`. It sits under `ia/`, so `permalink: false`
and `eleventyExcludeFromCollections` keep Eleventy from publishing it or
listing it in the sidebar.

## What it sets for every page under `ia/docs/design/choreography/`

- `layout: layouts/design-doc.njk` and `stylesheet: /assets/docs.css`, the
  same as the design reference.
- `docsNav: "Choreography"`, which the layout uses to pick the sidebar tree.
- `eyebrow`: a module page's layer, shown above its title.
- `eleventyNavigation`: this folder's README is the `Choreography` key under the
  `Docs` parent. Authored sections (`strategy`, `reference`) come first, in
  `SECTION_ORDER`; then one section per choreography layer. An authored page
  sorts by its `order` frontmatter. A module page takes its `group` and
  `order` from the reader.

## Where the pages come from

| Page                                           | Source                                                  |
| ---------------------------------------------- | ------------------------------------------------------- |
| `/docs/design/choreography/<layer>/`           | `layer.njk`, paginated over `choreographyDocs.layers`   |
| `/docs/design/choreography/<path to sidecar>/` | `module.njk`, paginated over `choreographyDocs.modules` |
| Strategy and reference pages                   | Markdown files here, reading `choreographyDocs`         |

The reader is `eleventy/collections/choreographySystem.js`. To change what a module
page says, edit the module's sidecar under `js/choreography/`.
