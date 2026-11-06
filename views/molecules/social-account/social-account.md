---
description: "Renders one socialAccount object (title, logo, url) as an external profile link."
type: template
links:
  - "[social-account content model](../../../content-model/objects/content/social-account.md)"
  - "[contact-form](../../organisms/forms/contact-form.md)"
---

# Social Account

Defines Nunjucks macro: `render`.

## Template

- Source: [[social-account.njk]]
- Path: `views/molecules/social-account/social-account.njk`
- Implements: [social-account content model](../../../content-model/objects/content/social-account.md)

## Purpose

Renders a single `socialAccount` array item — from `contact.socialAccounts` — as an
anchor pointing at the profile `url`, always opening externally (`target="_blank"`,
`rel="noopener noreferrer"`). The `logo` image is decorative (`alt=""`); the account
`title` is the accessible name via `aria-label` on the link. Falls back to visible
`title` text if `logo` is absent.

## Role in the System

Classified as a **component** at the atomic **molecule** level, matching the
content model's `socialAccount` object.

## Params

| Param     | Type   | Description                                                                                                                |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| `account` | object | `title`, `logo` (`url`, `alt`, `inline`), and `url`. Renders nothing when `url` is missing.                                |
| `format`  | string | `icon` (default) renders the logo SVG when `logo.url` is set, otherwise the title. Any other value renders the title text. |
| `size`    | string | Logo size class for the icon format. Defaults to `size-10`.                                                                |
| `classes` | string | Applied to the link at `sm` and up only, because the template places it under the `sm` key.                                |

## Relationships

- Used by: callers iterating `contact.socialAccounts` (not yet wired into a page
  template).

## Notes for Future Maintenance

- Keep this sidecar in sync when the macro signature or content model changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the
  Eleventy build.

## Open Questions

- Content model flags `logo` as possibly better served by an icon-set/enum
  approach instead of an editor-uploaded image — this template follows the
  current image-based contract.
