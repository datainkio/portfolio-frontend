---
description: "Paginated template that makes one motion-reference index page per choreography layer, from the layer's README and its sidecars' descriptions."
permalink: false
eleventyExcludeFromCollections: true
---

# Layer page template

Sidecar for `layer.njk`. Paginates over `motionDocs.layers`, one page per
folder under `js/choreography/`, at `/docs/motion/<layer>/`.

- The header description is the first paragraph of the layer's `README.md`;
  the rest of that README is the intro.
- **Modules** lists every sidecar in the layer with its `description`, in the
  sidebar's groups: modules straight under the layer first, then one group
  per subfolder that holds more than one page.

Root-level modules (`AnimationDirector`, the barrel, the getting-started
guide) are listed under System as "Entry points".
