---
description: Contact form markup — writes directly to Sanity from the browser.
type: template
tags:
  - form
links:
  - "[field](../../molecules/form/field.md)"
  - "[ContactForm.js](../../../js/contact-form/ContactForm.md)"
  - "[contact section](../section/contact.md)"
  - "[contact form spec](../../../../specs/contact-form-11ty-sanity-serverless-email-spec.md)"
---

# Contact Form

Defines Nunjucks macro `render`, which outputs the `<form>` element for the
site's contact form: hidden `sourcePage`, a honeypot field, email and message
fields, an `aria-live` status region, and the submit button. No page markup
(heading/copy) — that's `organisms/section/contact.njk`, which wraps this.

## Template

- Source: [[contact.njk]]
- Path: `views/organisms/forms/contact.njk`
- Implements: [contact form spec](../../../../specs/contact-form-11ty-sanity-serverless-email-spec.md) (§4, §9)

## Purpose

Renders the form and loads `ContactForm.js` as a module script at the end of
the macro, which handles submit, client-side validation, and the direct
Sanity write. Without JS the form renders but does not submit (accepted
tradeoff, spec §9). The Sanity **write** token is emitted as a
`data-sanity-write-token` attribute (accepted tradeoff, spec §4).

Email and message fields are rendered via the
[`field`](../../molecules/form/field.md) molecule rather than hand-rolled
markup — both fields share the same label/control/help/error shape.

## Role in the System

Classified as a **component** at the atomic **organism** level. Not rendered
directly by pages — always imported and called by
[`organisms/section/contact.njk`](../section/contact.md).

## Data and Context

- `env` — Sanity public config, expected in context (`SANITY_PROJECT_ID`,
  `SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_WRITE_TOKEN`).
- `page.url` — default for the hidden `sourcePage` input.

`render(params)` accepts: `submitLabel`, `sanityProjectId`, `sanityDataset`,
`sanityApiVersion`, `sanityWriteToken`, `sourcePage`, `sectionId`,
`fieldStyles` (forwarded to the `field` molecule; omit to use its default).

## Relationships

- Imports: [[field.njk]] (`molecules/form/field.njk`)
- Loads: [[ContactForm.js]]
- Used by: [`organisms/section/contact.njk`](../section/contact.md)

## Notes for Future Maintenance

- Keep this sidecar in sync when the form fields or data contract change.
- Preserve semantic HTML and accessibility attributes (labels,
  `aria-describedby`, `aria-live`) when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate
  the Eleventy build.
