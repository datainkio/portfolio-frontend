# Sanity → 11ty data flow

This repo fetches Sanity content with the official client + GROQ during the 11ty build. Sanity helpers live in `data/sanity/` (client, fetcher, queries) and are wired in via `eleventy/collections/sanity.js`.

## Collections

- `siteSettings` – site-wide singleton (siteName, tagline, canonicalUrl, brand logos/OG image, SEO defaults, analytics integrations). Resolved via fixed `_id == "siteSettings"`.
- `organizations` – organizations with industry concept + logo metadata
- `industries` – industry concepts for organizations and projects
- `projectsByIndustry` – industry concepts with nested project lists, resolved via project organization industry references; nested project records are normalized with `project.card`
- `activities` – activity concepts used for project classification
- `roles` – role concepts for project metadata
- `outcomes` – deliverable concepts for projects
- `awards` – awards with grantor + project context (including `organization.logo.asset.url` and `organization.logo.alt` for award logo rendering; SVG logos are inlined during build, tagged with `fill-current`, and non-SVG assets are skipped with console logging)
- `projects` – published projects with relationships, Portable Text `body` narrative content, hero image, and links
- `posts` – published posts with relationships and metadata
- `navigation` – navigation singleton content with normalized `headerItems[]` and `footerItems[]` link data for templates
- `imageAssets` – published image assets with metadata
- `home` – home-page singleton content (hero, value, recognition). `valuePropRichText` is serialized to `valuePropBodyHtml` during build. Legacy `valuePropBody` has been removed from schema and is no longer consumed by frontend rendering.

## Configuration

Defaults live in `site.json` under `cms` (projectId, dataset, apiVersion, cache). Environment variables override everything:

- `SANITY_PROJECT_ID` (required if you override defaults)
- `SANITY_DATASET` (required if you override defaults)
- `SANITY_API_TOKEN` (optional; authenticated requests, forces `useCdn=false`)
- `SANITY_API_VERSION` (default `2025-12-26`)
- `SANITY_PERSPECTIVE` (default `published`; set to `drafts` only for preview workflows)
- `SANITY_USE_CDN` (default `true` when no token, otherwise forced `false`)
- `SANITY_PARALLEL` (default `true`)
- `SANITY_FORCE_REFRESH` (forces all queries to refetch)
- `SANITY_FORCE_REFRESH_QUERY` (force a single query id, e.g., `projects`)

## Build behavior

- Runs inside `eleventy/collections/sanity.js` before navigation collections.
- Helpers reside in `data/sanity/client.js`, `data/sanity/fetchSanityData.js`, and `data/sanity/queries.js`.
- Caches responses with `@11ty/eleventy-fetch` (respecting `cache` duration in `site.json` or per-query).
- Serializes home-page Portable Text (`valuePropRichText`) to HTML using `@portabletext/to-html` and stores it on each home record as `valuePropBodyHtml`.
- Serializes project Portable Text (`body`) to HTML as `bodyHtml` during collection hydration.
- Normalizes navigation references from Sanity into accessible link-ready records (`title`, `url`, `key`) for header and footer rendering.
- Supports `sub_section` custom blocks in `valuePropRichText` during serialization, including nested Portable Text body content and image asset URL expansion.
- Supports `project_aside` custom blocks in project `body` during serialization, rendering semantic `<aside>` elements with optional heading, narrative copy, and resource links.
- Keeps serializer output semantic for `project_aside` (structural class hooks only) and applies Tailwind presentation in the Nunjucks view layer.
- Resolves legacy taxonomy collection ids (`activities`, `roles`, `outcomes`, `industries`) from `skosConcept` records scoped by concept scheme so existing Eleventy collection names remain stable.
- Resolves `projectsByIndustry` by intersecting industry concept schemes with projects linked through `organization[]->industry`, with legacy fallback support for `projectMeta.organization[]` during data migration.
- Normalizes nested projects in `projectsByIndustry` to include canonical card fields (`project.card`) and primary-organization fallback alignment used by project card templates.
- Exposes metadata as `cmsMeta` global data (no secrets stored).

## Project Portable Text Rendering Path

1. Query projection in `data/sanity/queries/projects.js` fetches project `body[]`, including nested fields required by custom object blocks like `project_aside`.
2. `eleventy/collections/sanity.js` converts Portable Text to HTML via `serializePortableTextToHtml`, mapping custom types (for example `project_aside`) to semantic HTML.
3. `views/layouts/case-study.njk` renders `project.bodyHtml` inside the article narrative container.
4. `views/layouts/case-study.njk` applies Tailwind utility classes to style serialized project Portable Text output (including `project_aside` hooks).

## Usage in templates

Access data through Eleventy collections:

```njk
{% for project in collections.projects %}
  {{ project.title }}
{% endfor %}
```

Generate one detail page per published project by paginating over `collections.projects` in `ia/projects/project.md`:

```yaml
---
layout: layouts/case-study.njk
pagination:
  data: collections.projects
  size: 1
  alias: project
permalink: "/case-studies/{{ project.slug }}/"
eleventyComputed:
  title: "{{ project.title }}"
---
```

For navigation rendering:

```njk
{% set nav = cms.navigation[0] if cms.navigation and cms.navigation[0] else {} %}
{% set headerItems = nav.headerItems or [] %}
{% set footerItems = nav.footerItems or [] %}
```

## Local setup

1. Install deps if you haven’t: `npm install`
2. Copy `.env.example` to `.env` and set:

- `SANITY_PROJECT_ID=ofshczbc`
- `SANITY_DATASET=production`
- `SANITY_API_TOKEN=<read token from backend/sanity project settings>`
- (Optional) `SANITY_USE_CDN=false` if you want to be explicit; tokens already disable CDN.

3. Run any 11ty build (`npm run dev` or `npm run build`) – Sanity data is pulled automatically.
