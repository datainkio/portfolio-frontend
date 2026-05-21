---
title: "Spec: Single Project Page Template"
description: "File inventory and structural spec for the single-project detail page template."
docType: "reference"
status: "draft"
owner: "frontend"
tags:
  - spec
  - views
  - project
  - eleventy
  - sanity
  - case study
permalink: false
aliases:
  - "Project Page Spec"
  - "Single Project Page Template Spec"
aix:
  intent: "view-spec"
  audience:
    - frontend
    - content
  canonical: true
---

# Spec: Single Project Page Template

- **Status:** draft
- **Scope:** Per-project detail page (one routed Eleventy page per `project` document)
- **Related:** [card.views-spec.md](./card.views-spec.md)

## Feature

A single Nunjucks template renders one Eleventy page per `project` document. Eleventy paginates over the `projectPages` query (one item per page, slug-based permalink). The template reads a pre-shaped object produced by a GROQ projection plus a JS transform — no Sanity calls or GROQ live in the template.

### Data flow

```
Sanity ──┐
         │  GROQ
         ▼
projectPageProjection.js
         │
         ▼
project-pages.js  (projectPages query)
         │
         ▼
queries.js  (CMS_QUERIES)
         │  Eleventy global data
         ▼
transforms/project.js  (shape for template)
         │
         ▼
views/pages/project/project.njk  (paginated, one page per project)
```

### Routing

- Source: `project.page.slug.current`
- Permalink: `/work/{slug}/index.html` (final segment subject to existing site routing conventions)
- Pagination: `size: 1`, alias `project`

### Region → field map

| Region                | Source field(s)                                                   | Required          |
| --------------------- | ----------------------------------------------------------------- | ----------------- |
| Title                 | `project.page.title`                                              | yes               |
| Byline (organization) | `project.organization` → resolved name                            | yes               |
| Abstract              | `project.page.abstract`                                           | yes               |
| Featured image        | `project.featuredImage` → resolved `imageAsset`                   | yes               |
| Outcome               | `project.outcome` → resolved name                                 | no                |
| Metadata band         | `project.roles[]`, `project.industry`, `project.activities[]`     | yes (per spec IA) |
| Awards                | `project.awards[]` → resolved `award`                             | no                |
| Body                  | `project.body` (Portable Text; H2+ only)                          | yes               |
| Live link             | `project.externalLinks[]` (cardinality tbd)                       | no                |
| End CTA               | Site-global footer contact form                                   | yes               |
| PDF download          | Server-rendered HTML → PDF artifact at `/work/{slug}/project.pdf` | yes               |

### Developer contract

- **Template never queries Sanity.** All data is preloaded via `CMS_QUERIES` and shaped by `transforms/project.js`.
- **Projection owns expansion.** Taxonomy/award/organization/outcome dereferences happen in `projectPageProjection.js`, not the template.
- **Transform owns presentation shape.** Slug derivation, sorted relations, and Portable Text prep happen in `transforms/project.js`.
- **Sidecar (`project.md`) owns metadata.** Template inputs and relationships are documented there, not inline in the `.njk`.
- **One H1, never in body.** Body Portable Text demotes block headings to H2+ via the transform.

### Local dev

- `cd frontend && npm start` — Eleventy dev with live reload.
- `cd backend && npm run dev` — Sanity Studio (for editing source docs).
- Build validation: `cd frontend && npm run build` — must complete with no template errors and a Lighthouse run (a11y/perf/best-practices/SEO) of 100 on a representative project.

### Out of scope (for this iteration)

- Related/next-prev projects surface.
- Breadcrumbs and in-page anchor navigation.
- Per-project art direction beyond the featured image.

## Goal

Render an individual `project` document as a routed Eleventy page at a stable per-project URL, using a dedicated Nunjucks template fed by a Sanity-backed projection.

A successful project page is one that produces an inquiry email, scheduled, call, follow on social, or a download.

## UX

The goal in terms of UX is to make it as easy as possible for people to answer the question, "Is this someone I can work with?" While the content itself may focus on a particular project or concept, the page needs to support the larger goal of communicating thought leadership, skill, experience, and collaboration.

### Audiences

Recruiters, hiring managers, prospective clients, and peer practitioners.

### CTA

The page should include a clear CTA at the end of the content. Consider a contact form in the global footer.

### Information Architecture

- The IA for the page should reflect the following content strategy priorities (in descending order):
  - project title
  - project abstract
  - featured image
  - project metadata (awards, roles, industry, activities, organization, outcome)
  - project body, including images and headings
  - link to live project (optional)

- The URL for the page is based on the slug field.

- Assume all fields - with the exception of awards and outcome - are required.

- The page should be available for download as a formatted PDF.

- One H1 per page, body headings demote correctly.

### Visual Design

- Emphasize content over ornamentation.
- The scan priority needs to reflect the IA:
  - associate organization with title as a byline
  - outcome gets its own treatment either as a section between the metadata and body or as an aside.
  - H2 body headings located outside of the body text; horizontal positioning maintains the connection.
- It does not need to have a unique layout for each breakpoint, but it should appear intentional (i.e. nothing breaks) at Tailwind breakpoints: base, sm, md, lg, and xl.
- Readability over sexiness.

### Interaction Design

- IxD touchpoints are not a priority, but consider lightweight parallax (including accounting for reduced motion) for images.

### Accessibility & Performance

- Maintain established best practices for structure, tabbed navigation (including skip-links), and aria definitions.
- Adhere to [motion-accessibility-policy](motion-accessibility-policy.md)
- Color, layout, and imagery should not be required for a reader to gain value from the content.
- Success looks like perfect Lighthouse scores.

## Assumptions

- Canonical frontend data paths are `frontend/data/sanity/projections/...` and `frontend/data/sanity/queries/...` (not `frontend/data/projections/...` / `frontend/data/queries/...`).
- The `project` document type is the authoritative content source; no new document type is introduced.

## Files / Areas

### 1. Content model — `content-model/`

| Status              | Path                                          | Purpose                                                                                                                      |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ✏️ new              | `content-model/documents/work/project.md`     | Human-readable content contract for the `project` document: fields, relationships, editorial rules.                          |
| ✏️ new (if missing) | `content-model/patterns/project-page.md`      | Pattern doc describing the page-level composition (hero → body → awards → related).                                          |
| 🔎 verify           | `content-model/objects/`                      | Confirm reusable objects referenced by `project` (portable text body, link, image) are documented; add only what is missing. |
| 🔎 verify           | `content-model/taxonomies/`                   | Confirm `industry`, `role`, `activity`, `outcome` taxonomy docs exist; add only what is missing.                             |
| ✏️ update           | `content-model/documents/README.documents.md` | Add `work/project.md` to the index. (File currently missing — may also need to be created.)                                  |

### 2. Backend schema — `backend/schemaTypes/`

| Status    | Path                                               | Purpose                                                                                                                |
| --------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ✅ exists | `backend/schemaTypes/documents/content/project.ts` | Sanity schema for the `project` document. Note any field additions required by the page template; otherwise no change. |
| 🔎 verify | `backend/schemaTypes/index.ts`                     | Confirm `project` is registered.                                                                                       |

### 3. Frontend template — `frontend/views/pages/project/`

| Status              | Path                                       | Purpose                                                                                                                                                       |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ exists (rewrite) | `frontend/views/pages/project/project.njk` | Nunjucks template for the single-project page. Currently appears placeholder/landing-shaped; repurpose as per-item template (pagination over `projectPages`). |
| ✅ exists (update)  | `frontend/views/pages/project/project.md`  | Sidecar front-matter doc: template metadata, data dependencies, relationships. Update to reflect per-project page role (not "Projects" landing).              |

### 4. Transform — `frontend/data/sanity/transforms/`

| Status             | Path                                         | Purpose                                                                                                                                                              |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ exists (extend) | `frontend/data/sanity/transforms/project.js` | Normalize the raw projected document into the shape the template consumes (slugs, derived URLs, sorted relations, portable-text prep). Extend for page-level fields. |

### 5. Projection — `frontend/data/sanity/projections/project/`

| Status             | Path                                                                | Purpose                                                                                   |
| ------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ✅ exists (extend) | `frontend/data/sanity/projections/project/projectPageProjection.js` | GROQ projection for the detail page: body, taxonomy expansions, awards, related projects. |

### 6. Query — `frontend/data/sanity/queries/project/`

| Status    | Path                                                    | Purpose                                                                                            |
| --------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| ✅ exists | `frontend/data/sanity/queries/project/project-pages.js` | `projectPages` query — full collection used by Eleventy pagination to emit one page per `project`. |
| 🔎 verify | `frontend/data/sanity/queries.js`                       | Confirm `projectPages` is registered/exported so 11ty data sees it.                                |

## Validation

- Repo greps confirm only the locations above own `project`-page concerns; no duplicate templates/projections/queries surface elsewhere.
- All listed paths conform to the canonical `frontend/data/sanity/...` layout.

## Risks & Mitigations

- **Path drift** in earlier informal references (`data/projections`, `data/queries`) — mitigated by anchoring this spec to `data/sanity/...`.
- **Spec/schema field drift:** the IA originally named `outcome` (singular); the schema exposes `project.outcomes[]` (plural). Reconcile naming in the template + transform.
- **PDF requirement without a pipeline:** the IA requires a downloadable PDF but no build mechanism is defined; risks scope creep into the template work. Decide pipeline or move to a follow-up spec.
- **Lighthouse-100 target with parallax:** image-driven parallax can regress perf and a11y; mitigated by tying motion to `prefers-reduced-motion` per [`motion-accessibility-policy.md`](../animation/motion-accessibility-policy.md) and budgeting hero image weight.

## Open Questions

- **Outcome region treatment:** between metadata and body, or as an aside?
- **PDF pipeline:** print stylesheet only, headless-browser post-build, or third-party service.
- **SEO surface:** confirm `project.seo` (already on the schema) drives `<title>`, meta description, and OG image; document defaults when fields are empty.
- **Body H2 placement:** confirm grid/column system for headings rendered outside the body text column at each Tailwind breakpoint (base, sm, md, lg, xl).
