---
title: "Contact"
template: "[[contact.njk]]"
templatePath: "views/organisms/section/contact.njk"
engine: "Nunjucks"
system: "Eleventy"
type: "template"
templateRole: "component"
atomicLevel: "organism"
status: "active"
tags:
  - "#frontend/eleventy"
  - "#frontend/nunjucks"
  - "#frontend/eleventy/template"
  - "#frontend/html/form"
  - "#forms"
  - "#tooling/Obsidian"
  - "#frontend/eleventy/component"
  - "#design/atomic-design/organism"
  - "#design/atomic-design"
links:
  - "[section-cap](../../molecules/section-cap.md)"
  - "[ContactForm.js](../../../js/contact-form/ContactForm.md)"
  - "[contact form spec](../../../../specs/contact-form-11ty-sanity-serverless-email-spec.md)"
  - "[contactSubmission schema](../../../../backend/schemaTypes/documents/content/contactSubmission.md)"
---

# Contact

Site-global contact section. Defines Nunjucks macro `render`, which outputs an
accessible contact form that writes directly to Sanity from the browser.

## Template

- Source: [[contact.njk]]
- Path: `views/organisms/section/contact.njk`
- Implements: [contact form spec](../../../../specs/contact-form-11ty-sanity-serverless-email-spec.md) (§5, §8, §9, §10)

## Purpose

Renders the contact form (email + message), a honeypot field, a hidden
`sourcePage`, and an `aria-live` status region. Submission is handled by
[`ContactForm.js`](../../../js/contact-form/ContactForm.md), loaded via a
`<script type="module">` at the end of the macro. Without JS the form renders
but does not submit (accepted tradeoff, spec §9).

## Role in the System

Classified as a **component** at the atomic **organism** level (location under
`views/`). Rendered **site-wide** by the
[global footer](../footer/global-footer.md), so it appears once near the bottom
of every page that renders the footer.

## Data and Context

Imported `with context` so these globals resolve inside the macro:

- `env` — Sanity public config (`SANITY_PROJECT_ID`, `SANITY_DATASET`,
  `SANITY_API_VERSION`, `SANITY_WRITE_TOKEN`), exposed by
  `eleventy/collections/index.js`. Written into the form's `data-sanity-*`
  attributes at build time.
- `page.url` — default value for the hidden `sourcePage` input.
- `SectionCap` — section heading cap molecule.

`render(params)` also accepts overrides: `id`, `classes`, `order`, `copy`
(`heading` / `body`), `submitLabel`, and the `sanity*` / `sourcePage` values.

## Security Note

The Sanity **write** token appears in the rendered `data-sanity-write-token`
attribute. This is the accepted tradeoff documented in spec §4 — use a
minimal-permission token and review CORS before deploying.

## Relationships

- Imports: [[section-cap.njk]]
- Loads: [[ContactForm.js]]
- Writes to: `contactSubmission` Sanity document
- Used by: [`global-footer.njk`](../footer/global-footer.md) (rendered site-wide)

## Notes for Future Maintenance

- Keep this sidecar in sync when the form fields or data contract change.
- Preserve semantic HTML and accessibility attributes (labels, `aria-describedby`,
  `aria-live`, focus states) when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the
  Eleventy build.
