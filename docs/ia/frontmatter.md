---
title: IA Frontmatter Schema
description: Canonical frontmatter schema for IA and design-system Markdown in Eleventy and Obsidian.
docType: reference
status: active
owner: frontend
tags:
  - #docs
  - #ia
  - #frontmatter
  - #eleventy
  - #obsidian
permalink: /docs/ia/frontmatter/
eleventyComputed:
  title: "{{ title }}"
---

Use this schema for Markdown authored in IA and design-system documentation.

Goals:

- Fast authoring with predictable defaults (DX)
- Stable metadata for AI indexing and retrieval (AIX)
- Clean rendering in Eleventy while staying readable in Obsidian

## Principles

1. Keep required fields minimal and stable.
2. Separate publishing controls from classification metadata.
3. Prefer explicit `docType` and `status` over inferred meaning.
4. Use consistent `tags` for both Eleventy collections and Obsidian search.
5. Keep metadata deterministic; do not auto-stamp timestamps.

## Canonical Schema

Required fields:

- `title` (string): Human-readable page title.
- `description` (string): One-sentence summary for search, cards, and AI context.
- `docType` (enum): `reference | guide | index | pattern | decision | note`.
- `status` (enum): `draft | active | deprecated | archived`.
- `owner` (string): Team or area, for example `frontend`.
- `tags` (string[]): Controlled topical labels.

Recommended 11ty fields:

- `layout` (string, optional): Override layout when needed. Defaults can come from directory data.
- `permalink` (string or false): Public route, or `false` for non-routable notes.
- `eleventyNavigation` (object, recommended for navigable docs): Set `key`, optional `title`, `parent`, and `order`.
- `eleventyComputed.title` (string, optional): Keep display title in sync with `title`.

Recommended Obsidian fields:

- `aliases` (string[], optional): Alternate names used in vault search.
- `cssclass` (string, optional): View-level styling hooks if needed.

Optional AIX fields:

- `aix.intent` (string): Short purpose label, for example `taxonomy`, `component-doc`, `navigation`.
- `aix.audience` (string[]): Intended readers, for example `design`, `frontend`, `content`.
- `aix.canonical` (boolean): Mark one canonical page when duplicates are possible.

## Standard Template

```yaml
---
title: "<Page Title>"
description: "<One sentence summary>"
docType: "reference"
status: "active"
owner: "frontend"
tags:
  - docs
  - ia
permalink: "/docs/<section>/<slug>/"
eleventyNavigation:
  key: "docs-<section>-<slug>"
  title: "<Nav Label>"
  parent: "docs-<section>"
  order: 10
eleventyComputed:
  title: "{{ title }}"
aliases:
  - "<Optional Alias>"
aix:
  intent: "<intent>"
  audience:
    - "frontend"
  canonical: false
---
```

## Profiles

Use one of these two profiles for consistency:

1. Public docs page

- Keep `permalink` as a URL path.
- Use `status: active`.
- Include `docType` and scoped tags.
- Match section prefixes to the published docs taxonomy, for example `/docs/design/...` for design-system docs and `/docs/ia/...` for IA docs.

2. Workspace note or draft

- Set `permalink: false`.
- Use `status: draft`.
- Keep the same classification fields so it can be promoted later.

## Tag Baseline

Start every IA/design-system doc with:

- `docs`
- `ia`

Then add 1-3 domain tags (for example `atoms`, `molecules`, `organisms`, `layouts`, `templates`, `content-strategy`, `sitemap`).

## File Naming And Slugs

- Use lowercase kebab-case filenames for new docs.
- Keep permalink slugs aligned with folder structure.
- Keep directory README pages as section indexes.

## Validation Checklist

Before committing a Markdown doc:

1. All required fields are present and non-empty.
2. `docType` and `status` use allowed values.
3. `permalink` is valid or explicitly `false`.
4. `tags` include both `docs` and `ia` plus domain tags.
5. `eleventyNavigation` includes a unique key and correct parent when page should appear in nav.
6. The `description` clearly states scope in one sentence.
