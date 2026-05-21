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
  - project metadata (awards, roles, industries, activities)
  - project body, including images and headings
  - link to live project (optional)

- Assume all fields - with the exception of awards - are required.

- The page should be available for download as a formatted PDF.

- One H1 per page, body headings demote correctly.

### Visual Design

- Emphasize content over ornamentation.
- The scan priority needs to reflect the IA.
- It does not need to have a unique layout for each breakpoint, but it should appear intentional (i.e. nothing breaks) at Tailwind breakpoints: base, sm, md, lg, and xl.
- Readability over sexiness.

### Interaction Design

- IxD touchpoints are not a priority, but consider lightweight parallax (including accounting for reduced motion) for images.

### Accessibility & Performance

- Maintain established best practices for structure, tabbed navigation (including skip-links), and aria definitions.
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
- **`README.documents.md` missing** under `content-model/documents/` — flagged for creation rather than silent update.

## Open Questions

- Feature behavior (sections, data shape, routing slug, related-projects rules) — to be defined in a follow-up section of this spec.
