---
description: Renders the contact page — form and social account links.
type: template
links:
  - "[landing](../../templates/landing/landing.md)"
  - "[contact-form](../../organisms/forms/contact-form.md)"
  - "[social-account](../../molecules/social-account/social-account.md)"
---

# Contact

Renders a top-level Eleventy page.

## Template

- Source: [[contact.njk]]
- Path: `views/pages/contact/contact.njk`

## Purpose

Extends the landing template with the contact form and, when
`cms.contact[0].socialAccounts` is populated, a list of social account links
rendered via the `social-account` molecule.

## Role in the System

Classified as a **page** at the atomic **page** level based on its location
under `views/`.

## Data and Context

- `cms.contact[0].socialAccounts` — array of `socialAccount` records, shaped
  by `CONTACT_PROJECTION` (`data/sanity/projections/contact/contactProjection.js`).
  Guarded with `(cms and cms.contact and cms.contact[0] and cms.contact[0].socialAccounts) or []`;
  the list renders nothing when empty.
- `contact_form` — `organisms/forms/contact-form.njk` macro.
- `social_account` — `molecules/social-account/social-account.njk` macro.

## Relationships

- Extends:
  - [[landing.njk]]
- Imports:
  - [[contact-form.njk]]
  - [[social-account.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- Are the inferred data dependencies complete, or are some supplied indirectly (front matter, computed data, Sanity)?
