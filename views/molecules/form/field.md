---
description: Labeled form field (input or textarea) with help text and error slot.
type: template
tags:
  - form
links:
  - "[contact.njk](../../organisms/forms/contact.md)"
---

# Field

Renders one accessible form field: `<label>`, an `<input>` or `<textarea>`,
an optional help paragraph, and a hidden error paragraph wired for
`aria-describedby`. Extracted from `organisms/forms/contact.njk` to remove the
duplicated markup between the email and message fields.

## Template

- Source: [[field.njk]]
- Path: `views/molecules/form/field.njk`

## Purpose

One macro for the "label + control + help + error" shape shared by every
field in the contact form. `type: "textarea"` renders a `<textarea>`;
anything else renders an `<input type="{{ type }}">`.

## Role in the System

Classified as a **component** at the atomic **molecule** level (label + atom
input combined into one unit).

## Data and Context

`render(params)`:

- `id` — required. Base id; error paragraph is `{id}-error`, help is `{id}-help`.
- `name` — required. Form field `name` attribute.
- `label` — required. Visible label text.
- `type` — default `"text"`. `"textarea"` switches the control.
- `required` — default `false`.
- `help` — optional help text; when present, adds `{id}-help` to `aria-describedby`.
- `autocomplete` — optional, passed through to `<input>` only.
- `rows` — default `8`, `<textarea>` only.
- `fieldStyles` — Tailwind class string for the control; defaults to the
  contact form's field styling so callers only override it when they need
  something different.

## Relationships

- Used by: [[contact.njk]] (`organisms/forms/contact.njk`) for the email and
  message fields.

## Notes for Future Maintenance

- Keep the `fieldStyles` default here in sync with the design system — this is
  now the single source, do not re-add a duplicate default in callers.
- Preserve `aria-describedby` wiring (error + optional help) when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the
  Eleventy build.
