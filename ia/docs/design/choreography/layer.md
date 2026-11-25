---
description: "Paginated template that makes one choreography-reference index page per choreography layer, from the layer's README and its sidecars' descriptions."
permalink: false
eleventyExcludeFromCollections: true
---

# Layer page template

Sidecar for `layer.njk`. Paginates over `choreographyDocs.layers`, one page per
folder under `js/choreography/`, at `/docs/design/choreography/<layer>/`.

- The header description is the first paragraph of the layer's `README.md`;
  the rest of that README is the intro.
- **Modules** lists every sidecar in the layer with its `description`, in the
  sidebar's groups: modules straight under the layer first, then one group
  per subfolder that holds more than one page.

The System page also has a **Layers** list, from the reader's `foldedLayers`:
the layers folded into the System sidebar section. Those layers' own index
pages still build, but have no sidebar entry, so this list is how a reader
reaches them. A folded layer's page returns no `eleventyNavigation`.

Root-level modules (`AnimationDirector`, the barrel, the getting-started
guide) are listed under System as "Entry points" on its index page, and under "Core" in the sidebar.

The layer's README body goes through `markdownify(true)`, so its markdown headings get ids.
