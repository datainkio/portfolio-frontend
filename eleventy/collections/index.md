---
description: "Central orchestration point that initializes all Eleventy collections in order (Sanity CMS → Navigation)."
status: stable
tags:
  - collection
aliases:
  - Collections index
links:
  - "[[eleventy/collections/README|collections]]"
  - "[[navigation]]"
  - "[[NavigationBuilder]]"
  - "[[designSystem]]"
---

# Collections index

Central orchestration for all Eleventy collections. Loads `site.json`, then runs the
collection initializers in a deliberate order and isolates their failures so one bad
collection can't break the whole build.

> [!important] Execution order is load-bearing
>
> 1. `site.json` loaded synchronously
> 2. `initSanity()` — fetches CMS data (async)
> 3. `initNavigation()` — builds the nav tree (async)
>
> Navigation depends on content already being present, so Sanity must run first.

## Sources

| Collection source | Module             | Produces                                  |
| ----------------- | ------------------ | ----------------------------------------- |
| Sanity CMS        | [[cms\|sanity.js]] | content collections from GROQ queries     |
| Navigation        | [[navigation]]     | `nav_dirs`, `nav_projects`, `nav_primary` |

Global data set here as well: `site`, `env`, `buildDate`, `colors`,
`buildVersions`, and `designTokens` (every theme token, grouped, from
[[designSystem]]; drives `ia/docs/design/tokens/`).

## Wiring

- Imported by [[.eleventy]] via `eleventyConfig`.
- Errors are caught per-initializer and surfaced with `chalk`.

## Source

- Path: `eleventy/collections/index.js`
