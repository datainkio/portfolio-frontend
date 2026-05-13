---
aix:
  id: frontend.data.sanity.services
  role: CMS fetch and cache layer for build-time Sanity data access.
  status: stable
  surface: internal
  tags:
    - frontend
    - cms
    - services
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

- `fetchSanityData.js` — fetches a single query with Eleventy asset cache, cache-key hashing, and graceful error fallback

## Responsibilities

- Accept a Sanity client, query, params, and cache duration
- Generate a stable cache key from the query signature
- Return cached data when valid; re-fetch otherwise
- Handle empty-cache edge cases and fetch errors without breaking the build

## Conventions

- Services are stateless — they receive a configured client and return data
- Add new services here when fetch behavior needs to vary (e.g., preview mode, authenticated queries)
- Do not add query definitions here; those live in `queries/`

## AIX Gain Links

- [data/sanity/README.md](../README.md)
- [eleventy/collections/sanity.js](../../../eleventy/collections/sanity.js)
