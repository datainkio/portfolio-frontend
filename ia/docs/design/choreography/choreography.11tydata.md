---
description: "Directory data for the choreography reference: computes every page's entry in the Design nav tree, including the pages paginated from choreography sidecars."
permalink: false
eleventyExcludeFromCollections: true
---

# Choreography directory data

Sidecar for `choreography.11tydata.js`. It sits under `ia/`, so `permalink: false`
and `eleventyExcludeFromCollections` keep Eleventy from publishing it or
listing it in the sidebar.

## What it sets for every page under `ia/docs/design/choreography/`

Layout and stylesheet come from `design.11tydata.js` one folder up.

- `eyebrow`: a module page's layer, shown above its title.
- `eleventyNavigation`: everything is a child of the `Design` root, under the
  part `Choreography`, in the slot `design.11tydata.js` reserves.
  - The README is a leaf titled "Overview" (its page title stays
    "Choreography").
  - Atoms, Molecules, Organisms, Pages and System are top-level sections, from
    the layer index pages. A layer the reader folds into System has no entry.
  - System's authored page: Lifecycle (`lifecycle.md`, directly in this
    folder) first with no group, then the `reference/` pages under
    "Contracts" (by their `order`). Accessibility is a top-level page, not
    part of System; see `design.11tydata.js`.
  - A module page takes its parent section, `group` and `order` from the
    reader. System's modules start at order 1000, so they follow the authored
    pages.

## Where the pages come from

| Page                                           | Source                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `/docs/design/choreography/<layer>/`           | `layer.njk`, paginated over `choreographyDocs.layers`                     |
| `/docs/design/choreography/<path to sidecar>/` | `module.njk`, paginated over `choreographyDocs.modules`                   |
| Lifecycle and reference pages                  | Markdown files here, reading `choreographyDocs`; they have no index pages |

The reader is `eleventy/collections/choreographySystem.js`. To change what a module
page says, edit the module's sidecar under `js/choreography/`.
