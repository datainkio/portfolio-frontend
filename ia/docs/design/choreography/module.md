---
description: "Paginated template that makes one choreography-reference page per choreography sidecar; the sidecar's body is the page."
permalink: false
eleventyExcludeFromCollections: true
---

# Module page template

Sidecar for `module.njk`. Paginates over `choreographyDocs.modules`, one page per
sidecar under `js/choreography/`, at `/docs/design/choreography/<path to sidecar>/`. A
folder's `README.md` below the layer level becomes the page for that folder.

The template has no body. `design-doc.njk` reads `choreographyModule` and renders
the sidecar's markdown, with Source, Sidecar, Status, Reduced motion, Built
from, Used by, Animates, and Specs in the third column. Built from and Used by come
from the JS import graph, so they can't drift from the code. Animates lists, per
`data-*-el` attribute the module uses, the component pages whose templates emit
it. It is per attribute, so a module links to every template that emits the
attribute; a module that selects by class, id or tag has none, and the block is
left out.

Its sidebar entry's parent, `group` and `order` come from the reader
(`section`, `group`, `order`); `choreography.11tydata.js` only passes them on.

To add a page, add a sidecar. To change one, edit the sidecar.
