---
description: "Macro that renders a three-sided bordered <section> whose ruled <h2> sits on the open top edge; content via {% call %}."
type: template
tags:
  - component
links:
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
  - "[star-summary](../star-summary/star-summary.md)"
  - "[design-decisions](../design-decisions.md)"
  - "[awards](../awards.md)"
---

# Section Frame

The shared frame for project-page content sections: a `<section>` bordered on three sides, with its `<h2>` translated onto the open top edge and ruled on either side. The caller supplies the content.

## Template

- Source: [[section-frame.njk]]
- Path: `views/molecules/section/section-frame.njk`

## Macro Signature

```njk
{% import "molecules/section/section-frame.njk" as SectionFrame %}
{% call SectionFrame.render({ heading: "Recognition", id: "awards-heading", tone: "accent-600" }) %}
  <ul>…</ul>
{% endcall %}
```

| Param     | Type                           | Required | Description |
| --------- | ------------------------------ | -------- | ----------- |
| `heading` | string                         | Yes      | `<h2>` text. |
| `id`      | string                         | Yes      | `<h2>` id. Also the section's `aria-labelledby`, so it must be unique on the page. |
| `tone`    | string                         | No       | `"slate-700"` (default), `"slate-600"`, or `"accent-600"`. Sets the border and rule colours; the heading text is 2 shades lighter for slate (`slate-700` → `text-slate-500`) and 1 for accent (`accent-600` → `text-accent-500`), because yellow already reads brighter. Unknown values fall back to the default. |
| `classes` | string \| variant map \| array | No       | Appended to the `<section>`. |
| `styles`  | `{ heading }`                  | No       | `heading` is appended to the `<h2>`. |

Follows the [Component API spec](../../../specs/views/component-api.views-spec.md).

## Relationships

- Used by:
  - [[star-summary.njk|molecules/star-summary/star-summary.njk]] — "Overview", `slate-600`
  - [[design-decisions.njk|molecules/design-decisions.njk]] — "Process + Evidence Plates", `slate-700`
  - [[awards.njk|molecules/awards.njk]] — "Recognition", `accent-600`

## Notes for Future Maintenance

- **Adding a tone:** add one entry to both `sectionTones` and `headingTones`, as complete class strings. Don't interpolate colour names (`border-{{ tone }}`), because Tailwind detects only whole literals.
- Tailwind scans the rendered `_site` HTML (`@source` in `styles/main.css`), so a new tone's classes compile only after 11ty has rendered a page that uses it.
- The heading's `-translate-y-1/2` relies on the section having no top border (`border-t-0`). Keep the two together.
