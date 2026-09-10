---
description: Renders the contact page's social account links plus mailto/location contact info.
type: template
---

# Social Accounts List

Renders `contact.socialAccounts` as an icon list, and `contact.mailto` / `contact.location` as
contact info below it.

## Template

- Source: [[social-accounts-list.njk]]
- Path: `views/molecules/list/social-accounts-list.njk`

## Purpose

Contact page molecule. Reads the `contact` singleton from `cms.contact[0]` and renders:

- `socialAccounts[]` — icon links, one per account, via `molecules/social-account/social-account.njk`.
- `mailto` — rendered as a `mailto:` link via `atoms/link/link.njk`.
- `location` — plain text.

Each piece is independently optional: `socialAccounts` empty renders a "No social accounts
available" message; `mailto`/`location` absent omits the `<address>` block entirely.

## Data and Context

- `cms.contact[0].socialAccounts` — array of `{ title, logo, url }`.
- `cms.contact[0].mailto` — string.
- `cms.contact[0].location` — string.
- `params.classes` — passed through to both the `<ul>` and `<address>` wrappers.

## Relationships

- Used by: `views/pages/contact/contact.njk`
- Related document: [`documents/singletons/contact.md`](../../../../content-model/documents/singletons/contact.md)

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.

## Open Questions

- `patterns/contact.md` (content-model) still only documents a "social accounts" region; it doesn't
  yet describe mailto/location as a page region. Worth updating there too.
