# Spec: Single Project Page Template

- **Status:** draft
- **Scope:** Per-project detail page (one routed Eleventy page per `project` document)
- **Related:** [card.views-spec.md](./card.views-spec.md)

## Goal

Render an individual `project` document as a routed Eleventy page at a stable per-project URL, using a dedicated Nunjucks template fed by a Sanity-backed projection.

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
