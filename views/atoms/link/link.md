---
description: "Base link atom: an anchor with the site baseline, automatic external-link handling (new tab, rel, icon), and optional download and aria attributes."
type: template
links:
  - "[icon](../icon.md)"
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
---

# Link

The base anchor every text link builds on. External URLs (`http…`, `mailto:`, `tel:`) open in a new tab with `noopener noreferrer` and get an `external-link` icon.

## Template

- Source: [[link.njk]]
- Path: `views/atoms/link/link.njk`

## Params

| Param         | Type                           | Description                                                                        |
| ------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `url`         | string                         | `href`. Decides whether the link is external.                                      |
| `text`        | string                         | Link text. Ignored when called with `{% call %}`.                                  |
| `title`       | string                         | Fallback text when `text` is empty; also emitted as the `title` attribute.         |
| `classes`     | string \| variant map \| array | Appended to the `base-link text-current` baseline through the `classes` filter.    |
| `rel`         | string                         | Extra `rel` tokens (e.g. `prev`), merged with the automatic `noopener noreferrer`. |
| `ariaLabel`   | string                         | `aria-label`.                                                                      |
| `ariaCurrent` | string                         | `aria-current`, e.g. `page` for the current nav item.                              |
| `download`    | bool                           | Adds the `download` attribute.                                                     |
| `attrs`       | string                         | Raw extra attributes (`data-*`, `id`), output with `safe`.                         |

Content is plain `text`, or markup through `{% call Link.render({ url: "/work/" }) %}…{% endcall %}`.

- `classes` replaced `class` on 2026-10-02. Callers migrated: `blog.njk`, `skip-links-nav.njk`, `design-pages.njk`.
- `rel` merges with the automatic `noopener noreferrer` on external links, so the element never gets two `rel` attributes.
- Follows the [Component API spec](../../../specs/views/component-api.views-spec.md).

## Relationships

- Imports:
  - [[icon.njk|atoms/icon.njk]] (external-link indicator)
- Used by:
  - [[nav-link.njk]], [[pager.njk]], [[nav-item.njk]]
  - [[child-pages.njk]], [[industry-links.njk]], [[design-pages.njk]], [[social-accounts-list.njk]]
  - [[skip-links-nav.njk]], [[blog.njk]]

## Notes for Future Maintenance

- Keep this sidecar documentation in sync when the template signature changes.
- Preserve semantic HTML and accessibility attributes when editing.
- Run `npm run build` (or `npm start`) after structural changes to validate the Eleventy build.
