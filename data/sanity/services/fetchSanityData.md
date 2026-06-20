---
id: frontend.cms.fetchdata
role: "Single-query transport: cache-key hashing, AssetCache read/write, force-refresh, error fallback."
status: stable
surface: internal
scope: frontend
runtime: node
aliases:
  - "fetchSanityData"
tags:
  - "#frontend/cms"
  - "#frontend/cms/services"
links:
  - "[[README.services]]"
  - "[[sanityService]]"
---

# fetchSanityData

Single-query transport. Executes one GROQ request with Eleventy's `AssetCache` and graceful
error recovery.

| Concern | Behavior |
| --- | --- |
| Cache key | hashed from the query |
| Cache store | `AssetCache` read/write |
| Force refresh | honors `SANITY_FORCE_REFRESH` |
| Failure | returns a safe fallback rather than breaking the build |

```js
export default async function fetchSanityData({ /* query, cache opts */ }) { … }
```

## Source

- Path: `data/sanity/services/fetchSanityData.js`

Related: [[README.services]], [[sanityService]]
