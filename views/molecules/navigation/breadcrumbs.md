---
description: "Macro that renders the path from a root page to the current page as a labelled <nav> with an ordered list."
type: template
tags:
  - component
  - navigation
links:
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
  - "[link](../../atoms/link/link.md)"
  - "[design-doc](../../templates/design-doc/design-doc.md)"
---

# Breadcrumbs

The path from a root page down to the current one. It's presentational and knows nothing about Eleventy; the caller maps its data to the params.

## Template

- Source: [[breadcrumbs.njk]]
- Path: `views/molecules/navigation/breadcrumbs.njk`

## Macro Signature

```njk
{% import "molecules/navigation/breadcrumbs.njk" as Breadcrumbs %}
{{ Breadcrumbs.render({
  trail: [{ url: "/docs/", title: "Docs" }, { url: "/docs/design/", title: "Design" }, { url: page.url, title: title }],
  label: "Breadcrumb"
}) }}
```

| Param     | Type                           | Required | Description |
| --------- | ------------------------------ | -------- | ----------- |
| `trail`   | `{ url, title }[]`             | Yes      | Root first, current page last. Fewer than two items renders nothing. |
| `label`   | string                         | No       | The `<nav>`'s `aria-label`. Defaults to "Breadcrumb"; must differ from other navs on the page. |
| `classes` | string \| variant map \| array | No       | Appended to the `<nav>`. |

## Accessibility

- `<nav aria-label>` landmark containing an `<ol>`, so the order is announced.
- The last item is the current page: text, not a link, with `aria-current="page"`.
- The `/` separators are `aria-hidden`.
- Links keep an underline and a `focus-visible` outline.

## Relationships

- Used by: [[design-doc.njk|templates/design-doc/design-doc.njk]], which builds the trail with the `navigationTrail` filter ([[design.md|eleventy/filters/design.md]]).
- Imports: [[link.njk|atoms/link/link.njk]]

## Notes for Future Maintenance

- The trail is built by the caller. The `Docs` root has no page of its own in the navigation tree (`Design` names it as a parent that doesn't exist, which keeps `Design` out of root-level lists), so the layout prepends it by hand.
