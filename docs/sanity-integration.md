# CMS → 11ty data flow

This repo now fetches Sanity content with the official client + GROQ during the 11ty build. CMS helpers live in `cms/` (client, fetcher, queries) and are wired in via `eleventy/collections/sanity.js`.

## Collections

- `organizations` – organizations with industry + logo metadata
- `industries` – industry taxonomy for organizations and projects
- `activities` – activities taxonomy used for project classification
- `roles` – roles taxonomy for project metadata
- `outcomes` – outcomes/deliverables taxonomy for projects
- `awards` – awards with grantor + project context
- `projects` – published projects with relationships, hero image, and links
- `posts` – published posts with relationships and metadata
- `imageAssets` – published image assets with metadata

## Configuration

Defaults live in `njk/_data/site.json` under `cms` (projectId, dataset, apiVersion, cache). Environment variables override everything:

- `SANITY_PROJECT_ID` (required if you override defaults)
- `SANITY_DATASET` (required if you override defaults)
- `SANITY_API_TOKEN` (optional; enables draft/preview, forces `useCdn=false`)
- `SANITY_API_VERSION` (default `2025-12-26`)
- `SANITY_USE_CDN` (default `true` when no token, otherwise forced `false`)
- `SANITY_PARALLEL` (default `true`)
- `SANITY_FORCE_REFRESH` (forces all queries to refetch)
- `SANITY_FORCE_REFRESH_QUERY` (force a single query id, e.g., `projects`)

## Build behavior

- Runs inside `eleventy/collections/sanity.js` before navigation collections.
- Helpers reside in `cms/client.js`, `cms/fetchSanityData.js`, and `cms/queries.js`.
- Caches responses with `@11ty/eleventy-fetch` (respecting `cache` duration in `site.json` or per-query).
- Exposes metadata as `cmsMeta` global data (no secrets stored).

## Usage in templates

Access data through Eleventy collections:

```njk
{% for org in collections.organizations %}
  {{ org.title }}
{% endfor %}
```

## Local setup

1. Install deps if you haven’t: `npm install`
2. Copy `.env.example` to `.env` and set:

- `SANITY_PROJECT_ID=ofshczbc`
- `SANITY_DATASET=production`
- `SANITY_API_TOKEN=<read token from backend/sanity project settings>`
- (Optional) `SANITY_USE_CDN=false` if you want to be explicit; tokens already disable CDN.

3. Run any 11ty build (`npm run dev` or `npm run build`) – Sanity data is pulled automatically.
