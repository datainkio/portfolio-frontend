---
aix:
  id: frontend.data.sanity.services
  role: CMS fetch and cache layer for build-time Sanity data access.
  status: stable
  surface: internal
  tags:
    -  #frontend
    -  #cms
    -  #services
  type: guide
  scope: frontend
  audience: maintainers
  perf:
    readPriority: medium
    cacheSafe: true
    critical: false
---

# CMS Services (frontend/data/sanity/services)

Build-time data-fetch layer. Handles Eleventy cache, query execution, and error recovery for all Sanity GROQ requests.

## Files

| File                 | Responsibility                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `fetchSanityData.js` | Single-query transport: cache key hashing, `AssetCache` read/write, `SANITY_FORCE_REFRESH`, error fallback      |
| `sanityService.js`   | Build orchestration: client init, iterates `CMS_QUERIES`, dispatches transforms, registers Eleventy collections |
| `index.js`           | Public API surface — re-exports `init` from `sanityService.js`                                                  |

## Layer responsibilities

- `fetchSanityData` answers: _how do I get one query's data from Sanity?_
- `sanityService` answers: _how do I wire all CMS data into an Eleventy build?_

```
sanityService.init()
  └── for each query in CMS_QUERIES
        └── fetchSanityData({ client, query, ... })   ← single fetch + cache
              └── dispatch transform per query id
        └── eleventyConfig.addCollection(id, data)
```

## Conventions

- `fetchSanityData` handles infrastructure concerns shared by every query: caching strategy, error recovery, force-refresh. Do not duplicate this logic in domain files.
- Domain-specific service files earn their place only if fetch _behavior_ must vary per domain (e.g., authenticated requests, different cache duration). In that case, delegate to `fetchSanityData` rather than reimplement it.
- Services are stateless — they receive a configured client and return data
- Do not add query definitions here; those live in `queries/`

## AIX Gain Links

- [data/sanity/README.md](../README.md)
- [eleventy/collections/sanity.js](../../../eleventy/collections/sanity.js)
