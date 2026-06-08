---
title: "ContactForm"
module: "[[ContactForm.js]]"
modulePath: "js/contact-form/ContactForm.js"
engine: "Browser ESM"
system: "Eleventy"
type: "script"
scriptRole: "controller"
status: "active"
tags:
  - "#frontend/js"
  - "#frontend/js/module"
  - "#frontend/html/form"
  - "#forms"
  - "#backend/sanity"
links:
  - "[contact.njk](../../views/organisms/section/contact.md)"
  - "[contact form spec](../../../specs/contact-form-11ty-sanity-serverless-email-spec.md)"
  - "[contactSubmission schema](../../../backend/schemaTypes/documents/content/contactSubmission.md)"
---

# ContactForm

Browser-side controller for the site-global contact form. Progressive
enhancement: without JavaScript the form renders but does not submit (accepted
tradeoff, spec §9).

## Source

- Module: [[ContactForm.js]]
- Path: `js/contact-form/ContactForm.js`
- Loaded via: `<script type="module">` at the end of
  [`contact.njk`](../../views/organisms/section/contact.md). Passed through to
  `/assets/js/contact-form/ContactForm.js` by `.eleventy.js`.

## Responsibilities

1. Find each `[data-contact-form]` and read Sanity config from its data attributes.
2. Intercept submit; short-circuit to silent success if the honeypot is filled.
3. Sanitize (trim, normalize line endings, strip null bytes, collapse blank lines).
4. Validate email and message client-side — the **only** validation layer.
5. POST a `create` mutation to the Sanity Content Lake REST API via native `fetch`
   (no `@sanity/client` in the frontend bundle).
6. Announce success/error in the `[data-contact-form-status]` `aria-live` region;
   render field-level errors and set `aria-invalid` on the offending input.
7. Disable the submit button while in flight; re-enable on completion.

## Validation Rules (spec §12)

| Field | Rule |
| --- | --- |
| `email` | required, trimmed, lowercased, RFC-ish pattern, ≤ 254 chars |
| `message` | required, trimmed, 20–5000 chars |
| `sourcePage` | optional, ≤ 500 chars |
| `botField` | must be empty (honeypot) |

## Security Notes

- The Sanity write token lives in the page markup (spec §4). This module reads it
  from `data-sanity-write-token` and **never logs it** or the message content.
- User-facing errors are generic; underlying transport errors are swallowed.
- `message` is stored as plain text and must never be rendered as HTML downstream.

## Public Exports

- `ContactForm` — the controller class (one instance per form element).
- `initContactForms(root = document)` — wires all forms under `root`.

The module self-initializes on import (on `DOMContentLoaded`, or immediately if
the DOM is already parsed).

## Notes for Future Maintenance

- Keep this sidecar in sync with the validation rules and the Sanity document shape.
- If email notifications / Turnstile are added later, they belong behind a
  serverless function — see spec §26, not this module.
