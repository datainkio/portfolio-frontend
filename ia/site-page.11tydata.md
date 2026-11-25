---
description: "Directory data for ia/site-page.md: computes each site page's eleventyNavigation entry from its sitePage record."
permalink: false
eleventyExcludeFromCollections: true
---

# Site page data

Sidecar for `site-page.11tydata.js`. It sits under `ia/`, so `permalink: false` and
`eleventyExcludeFromCollections` keep Eleventy from publishing it or listing it in navigation.

`eleventyComputed.eleventyNavigation` returns `{ key: url, title: navTitle, parent: navParent }` for
each paginated page (`parent` omitted when undefined). A page under the documentation landing has
parent `Docs`, the key of the `/docs/` landing, so the site map nests it under Docs. A child page's parent is its parent page's URL.
