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
`docNo` (two-digit parent document number; the form header renders `Doc {docNo} / {docTitle}` and the sheet id `DOC {docNo}A`; default `00`), `docTitle` (default `Contact`),
`fieldStyles` (forwarded to the `field` molecule; omit to use its default).

## Relationships

- Imports: [[field.njk]] (`molecules/form/field.njk`)
- Loads: [[ContactForm.js]]
- Used by: [`organisms/section/contact.njk`](../section/contact.md)

## Stroke Hierarchy

The form is styled as a drafting sheet. Every rule is `primary-950` (blueprint navy — never pure black or `slate-*`) at one of four weights, so new rules must pick a tier rather than invent a fifth:

| Tier | Utility | Where |
| --- | --- | --- |
| Outer border | `inner-border-2 inner-border-primary-950` on `<form>` | sheet edge |
| Title-block dividers | `border-primary-950/85` | `<header>` bottom, header `<ul>` left, `<footer>` top |
| Field dividers | `border-primary-950/50`, `divide-primary-950/50` | description rule, `<ol>` left, between fields, header `<ul>` rows |
| Micro-label rules | `border-primary-950/30` | footer note left, revision `<dl>` left and `<dt>` |

Corner registration marks belong to the paper-artifact treatment below, not this table.

## Paper Artifact

The `<form>` is meant to read as a sheet laid on the drafting surface, not a panel:

- `bg-accent-100 bg-graphpaper-sm` — paper with the site's faint graph grid.
- `inner-border inner-border-2 inner-border-primary-950` — the ruled sheet edge (`::after`, inset 8px).
- `registration-marks` — 10px × 1px corner ticks in `currentColor` (`::before`, at the outer corners, outside the ruled edge). Utility lives in `styles/decorations.css` beside `inner-border`.
- `shadow-[3px_3px_0_0_color-mix(…primary-950 35%…)]` — hard offset shadow, no blur.

Both pseudo-elements are spoken for; anything else decorative needs real markup.

## Fields

Fields are drawn into the paper via `field.njk`'s `fieldStyles` / `labelStyles` params (the molecule's defaults are untouched):

- `fieldBase` — `bg-accent-50` fill, no outline at rest, `border-primary-950/30` rule colour, `rounded-none`.
- `lineFieldStyles` (email) — `border-0 border-b`: a single underline.
- `boxFieldStyles` (message) — `border`: a light rectangle.
- Focus — `focus-visible:outline-2 outline-secondary-500` plus `border-secondary-500`: the orange-red stamp is the only strong contrast at rest-to-active.
- Invalid — `aria-[invalid=true]:border-red-600`; the error `<p>` remains the primary signal.
- Labels — `text-xs uppercase tracking-wider text-primary-950/80`.

## Notes for Future Maintenance

- Keep this sidecar in sync when the form fields or data contract change.
- Preserve semantic HTML and accessibility attributes (labels,
  `aria-describedby`, `aria-live`) when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate
  the Eleventy build.
