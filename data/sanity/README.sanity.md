# CMS Integration (frontend/data/sanity)

Build-time CMS data access for the frontend. This folder is the **single entrypoint** for fetching and shaping CMS content that becomes Eleventy collections.

## Responsibilities

- Resolve CMS config (`site.cms` + env overrides)
- Create the CMS client
- Fetch GROQ data with caching
- Aggregate CMS queries into `CMS_QUERIES`

## Files

- `client/` — resolves config + creates CMS client (`index.js`)
- `services/` — fetches data with Eleventy cache and error handling (`fetchSanityData.js`)
- `projections/` — domain-scoped GROQ projection fragments, one subfolder per entity type
- `queries/` — one file per query definition
- `queries.js` — aggregates query definitions into `CMS_QUERIES`

## Data Flow (11ty)

1. `eleventy/collections/sanity.js` initializes CMS fetching.
2. Each query in `CMS_QUERIES` is fetched.
3. Results are registered as Eleventy collections (e.g., `collections.projects`).

## Conventions

- Query IDs become collection names. Keep them **source-agnostic**.
- Add new queries under `queries/` and export them from `queries.js`.
- Add shared GROQ projection fragments to the appropriate subfolder under `projections/`.
- Prefer consistent projection shapes across queries (e.g., shared image fields).

## Env / Config

Defaults live in `site.json` under `cms`:

- `projectId`
- `dataset`
- `apiVersion`
- `useCdn`
- `cache`

Overrides (via environment):

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_READ_TOKEN`
- `SANITY_API_VERSION`
- `SANITY_USE_CDN`
- `SANITY_PARALLEL`
- `SANITY_FORCE_REFRESH`
- `SANITY_FORCE_REFRESH_QUERY`

## Adding a query

1. Create `queries/<name>.js` exporting a `{ id, description, cacheDuration, query }` object.
2. Import and include it in `queries.js`.
3. Use in templates as `collections.<id>`.

## AIX Gain Links

- [aix/context/projects/portfolio-frontend.md](../../aix/context/projects/portfolio-frontend.md)
- [context/constraints.md](dataink.io/context/constraints.md)
- [aix/context/project.md](../../aix/context/project.md)
- [aix/specs/README.md](../../aix/specs/README.md)
- [frontend/docs/sanity-integration.md](../docs/sanity-integration.md)
- [frontend/.github/copilot-instructions.md](../.github/copilot-instructions.md)
