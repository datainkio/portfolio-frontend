---
description: "Macro that renders previous · all · next navigation between sibling pages as a labelled <nav>."
type: template
tags:
  - component
  - navigation
links:
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
  - "[Project page spec](../../../specs/views/project-page.views-spec.md)"
  - "[link](../../atoms/link/link.md)"
  - "[icon](../../atoms/icon.md)"
---

# Pager

Previous · all · next navigation between sibling pages. It's presentational and knows nothing about Eleventy or projects; the caller maps its data to the params.

## Template

- Source: [[pager.njk]]
- Path: `views/molecules/navigation/pager.njk`

## Macro Signature

```njk
{% import "molecules/navigation/pager.njk" as Pager %}
{{ Pager.render({
  label: "Case studies",
  previous: { href, title, meta },
  next: { href, title, meta },
  all: { href: "/work/", label: "All" }
}) }}
```

| Param      | Type                           | Required | Description |
| ---------- | ------------------------------ | -------- | ----------- |
| `label`    | string                         | Yes      | The `<nav>`'s `aria-label`. Must differ from other navs on the page. |
| `previous` | `{ href, title, meta }`        | No       | Omitted → a greyed (`opacity-40`), `aria-hidden` placeholder that keeps the three-column layout. |
| `next`     | `{ href, title, meta }`        | No       | Same. |
| `all`      | `{ href, label }`              | No       | Middle link with the `grid` icon. `label` defaults to "All". |
| `classes`  | string \| variant map \| array | No       | Appended to the `<nav>`. |
| `styles`   | `{ link }`                     | No       | Appended to each of the three links. |

`meta` is an optional second line under the title (client names on project pages).

## Accessibility

- `<nav aria-label>` landmark containing a `<ul role="list">` in reading order: previous · all · next.
- Neighbour links: the accessible name is "Previous: <title>" / "Next: <title>", which contains the visible text (WCAG 2.5.3). They carry `rel="prev"` / `rel="next"`.
- Icons are `aria-hidden`. Focus uses a `focus-visible` outline; the hover transition is `motion-safe:` only.

## Relationships

- Used by: [[project.njk|pages/project/project.njk]], which maps Eleventy's `pagination` with wrap-around.
- Imports: [[link.njk|atoms/link/link.njk]], [[icon.njk|atoms/icon.njk]]
- Replaced `molecules/input/prevnext.njk` and `molecules/input/project-nav.njk` (deleted 2026-10-02). Those had no callers, read variables from the page, and emitted relative hrefs.

## Notes for Future Maintenance

- Guarded by `npm run test:site` ([`test/site/pager.test.js`](../../../test/site/pager.test.js)), which needs a build first.
- `js/choreography/pages/Project/Project.js` still tweens `#project-nav`, which no longer exists (and never rendered). Retarget it to `[aria-label="Case studies"]` or delete the tween when choreography for this page is picked up.
