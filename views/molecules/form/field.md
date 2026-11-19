---
description: Labeled form field (input or textarea) with help text and error slot.
type: template
tags:
  - form
links:
  - "[contact.njk](../../organisms/forms/contact.md)"
---

# Field

Styling comes in through `styles`, with `field` and `label` slots. Neither slot has a default, so the caller sets both, including the focus ring and invalid state.

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

## Params

| Param          | Type    | Description                                                                                          |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `id`           | string  | Required. Input `id`. The error paragraph is `{id}-error` and the help paragraph is `{id}-help`.     |
| `name`         | string  | Required. Form field `name`.                                                                         |
| `label`        | string  | Required. Visible label text.                                                                        |
| `type`         | string  | Defaults to `text`. `textarea` renders a `<textarea>`; any other value renders `<input type="...">`. |
| `required`     | boolean | Defaults to `false`.                                                                                 |
| `help`         | string  | Optional help text. When set, `{id}-help` is added to `aria-describedby`.                            |
| `autocomplete` | string  | Optional. Passed to `<input>` only.                                                                  |
| `rows`         | number  | Defaults to 8. `<textarea>` only.                                                                    |
| `styles`       | object  | Slot map. See the slot table.                                                                        |

| Slot    | Element                                  |
| ------- | ---------------------------------------- |
| `field` | The control (`<input>` or `<textarea>`). |
| `label` | The `<label>`.                           |

The molecule has no baseline styling: the caller sets both slots, including the focus ring and invalid state.

## Relationships

- Used by: [[contact.njk]] (`organisms/forms/contact.njk`) for the email and
  message fields.

## Notes for Future Maintenance

- Styling is caller-owned. Set `styles.field` and `styles.label` where the field is used (see `contact-form.njk`).
- Preserve `aria-describedby` wiring (error + optional help) when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the
  Eleventy build.
