---
id: frontend.eleventy.collections.cms
role: "Re-exports the Sanity CMS collection initializer (init) from the data layer."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "Sanity collection"
tags:
  - "#frontend/eleventy"
  - "#frontend/eleventy/collections"
links:
  - "[[README.collections]]"
  - "[[fetchSanityData]]"
  - "[[sanityService]]"
---

# Sanity collection

One-line bridge: re-exports `init` from the Sanity data services so the collections
manager can initialize CMS-backed collections without reaching into `data/sanity/`
internals.

```js
export { init } from "../../data/sanity/services/index.js";
```

## Related

- Consumed by [[index]] during collection init.
- Backed by [[fetchSanityData]] / [[sanityService]].

## Source

- Path: `eleventy/collections/sanity.js`
