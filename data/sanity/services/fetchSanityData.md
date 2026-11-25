---
description: "Single-query transport: cache-key hashing, AssetCache read/write, force-refresh, error fallback."
status: stable
tags:
  - cms
  - services
aliases:
  - fetchSanityData
links:
  - "[[data/sanity/services/README|services]]"
  - "[[sanityService]]"
---

# fetchSanityData

Single-query transport. Executes one GROQ request with Eleventy's `AssetCache` and graceful
error recovery.

| Concern       | Behavior                                               |
| ------------- | ------------------------------------------------------ |
| Cache key     | hashed from the query                                  |
| Cache store   | `AssetCache` read/write                                |
| Force refresh | always when `ELEVENTY_RUN_MODE=build`; in dev honors `SANITY_FORCE_REFRESH` (`false` uses the cache; `npm run start:fresh` forces fetches). Logs `using cache` / `fetching from Sanity`. |
| Failure       | returns a safe fallback rather than breaking the build |

```js
export default async function fetchSanityData({ /* query, cache opts */ }) { … }
```

## Source

- Path: `data/sanity/services/fetchSanityData.js`

Related: [[data/sanity/services/README|services]], [[sanityService]]
