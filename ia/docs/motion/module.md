---
description: "Paginated template that makes one motion-reference page per choreography sidecar; the sidecar's body is the page."
permalink: false
eleventyExcludeFromCollections: true
---

# Module page template

Sidecar for `module.njk`. Paginates over `motionDocs.modules`, one page per
sidecar under `js/choreography/`, at `/docs/motion/<path to sidecar>/`. A
folder's `README.md` below the layer level becomes the page for that folder.

The template has no body. `design-doc.njk` reads `motionModule` and renders
the sidecar's markdown, with Source, Sidecar, Status, Reduced motion, Built
from, Used by, and Specs in the third column. Built from and Used by come
from the JS import graph, so they can't drift from the code.

To add a page, add a sidecar. To change one, edit the sidecar.
