---
aix:
  id: frontend.data.sanity.transforms
  role: Domain-scoped data normalization layer between raw Sanity records and Eleventy collections.
  status: stable
  surface: internal
  tags:
    -  #frontend
    -  #cms
    -  #transforms
    -  #normalization
  type: guide
  scope: frontend
  audience: maintainers
  perf:
    readPriority: medium
    cacheSafe: true
    critical: false
---

# CMS Transforms (frontend/data/sanity/transforms)

Pure, stateless functions that normalize raw Sanity query results into shaped records consumed by Eleventy collections. This is the boundary between CMS schema and front-end data contracts.

## Why this layer exists

GROQ projections control the _shape_ of what Sanity returns, but projection fields still reflect CMS conventions: reference slugs, portable text blocks, conditional presence of optional fields, SVG asset URLs, etc. Transforms handle the _semantic_ normalization that GROQ cannot: resolving URLs from slug trees, serializing portable text to HTML, hydrating remote SVG markup, and coercing optional fields into safe defaults.

Centralizing this work in a dedicated module layer means:

- `sanityService.js` stays an orchestration file, not a data-munging file
- Each domain's normalization logic is independently readable and testable
- Eleventy collections receive predictable, flat records regardless of CMS schema drift

## Files

| File              | Exports                                                                                                            | Responsibility                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `portableText.js` | `normalizeLinkHref`, `escapeHtml`, `renderAsideResources`, `serializePortableTextToHtml`                           | Serialize Sanity Portable Text blocks to HTML; handle internal vs external href resolution and XSS-safe escaping       |
| `project.js`      | `resolveProjectCardUrl`, `buildProjectCardRecord`, `normalizeProjectRecords`, `normalizeProjectsByIndustryRecords` | Resolve canonical project URLs from slug trees, build card records, normalize flat and industry-grouped project arrays |
| `organization.js` | `buildOrganizationCardRecord`, `normalizeOrganizationRecords`                                                      | Build org card records and normalize organization arrays                                                               |
| `award.js`        | `buildAwardCardRecord`, `fetchSvgMarkup`, `hydrateAwardInlineLogos`, `normalizeAwardRecords`                       | Build award card records; async SVG hydration with in-memory cache; normalize award arrays                             |
| `navigation.js`   | `resolveNavigationHref`, `resolveNavigationLabel`, `normalizeNavigationItems`, `normalizeNavigationRecords`        | Resolve nav item hrefs and labels from internal/external references; normalize nav tree records                        |
| `home.js`         | `normalizeLandingRecords`                                                                                          | Normalize landing page records for the home collection                                                                 |

## Usage

Transforms are called by `services/sanityService.js` as part of the fetch-and-transform pipeline. Each `normalize*Records` function is the public entry point for its domain and is dispatched by query key inside `sanityService.js`.

```js
import { normalizeProjectRecords } from "../transforms/project.js";
import { normalizeAwardRecords } from "../transforms/award.js";

// Inside fetchAllQueries dispatch:
const normalized = normalizeProjectRecords(rawRecords);
```

Lower-level helpers (`buildProjectCardRecord`, `resolveProjectCardUrl`, etc.) are exported for testing and for use by other transforms that need to compose shapes.

## Conventions

- All `normalize*Records(records = [])` functions accept a raw array and return a normalized array
- All `build*Record(item = {})` functions accept a single raw record and return a single shaped record
- Async helpers (`fetchSvgMarkup`, `hydrateAwardInlineLogos`) are isolated to `award.js` and called explicitly
- No side effects; no Sanity client imports; no Eleventy API calls
- Add a new file per domain when a query result requires more than trivial field coercion

## AIX Gain Links

- [data/sanity/README.md](../README.md)
- [data/sanity/services/README.md](../services/README.md)
- [data/sanity/services/sanityService.js](../services/sanityService.js)
