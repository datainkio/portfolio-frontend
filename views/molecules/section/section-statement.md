---
description: "Macro that renders one full-viewport statement <section>: an <h2>, body HTML, and a decorative portrait figure, mirrored left or right by layout."
type: template
tags:
  - component
links:
  - "[Component API spec](../../../specs/views/component-api.views-spec.md)"
  - "[media](../figure/media.md)"
  - "[hero](../../organisms/section/hero.md)"
---

# Section Statement

One mission statement on the homepage: a full-viewport `<section>` holding an `<h2>`, the statement's body HTML, and a portrait image behind the text. `layout` mirrors the composition. `"left"` sets the text in the left columns with the figure flush right; `"right"` sets the text in the right columns with the figure flush left.

## Template

- Source: [[section-statement.njk]]
- Path: `views/molecules/section/section-statement.njk`

## Macro Signature

```njk
{% import "molecules/section/section-statement.njk" as Statement %}
{{ Statement.render({ statement: statement, layout: "right" }) }}
```

| Param       | Type                          | Required | Description                                                                                                                                                                                                                                                                                                                                   |
| ----------- | ----------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `statement` | `{ subheading, body, image }` | Yes      | One item of the home singleton's `statements[]`, as shaped by `data/sanity/transforms/home.js`. `subheading` is the `<h2>` text and the image's alt; `body` is serialized HTML, output with `safe`; `image` is a Sanity image object rendered by [[media.njk\|molecules/figure/media.njk]], lazy-loaded. Each part renders only when present. |
| `layout`    | `"left"` \| `"right"`         | No       | Which side the text sits on. Defaults to `"left"`. Any value other than `"right"` renders as `"left"`.                                                                                                                                                                                                                                        |

Follows the [Component API spec](../../../specs/views/component-api.views-spec.md), except that it takes no `classes` or `styles`: the layout is fixed by `layout`.

## Layout

The section is a 12-column grid with `prose` (and `max-w-none`, which cancels prose's 65ch cap so the section spans its container). The `<h2>` and the body's `<p>` elements share the same columns:

| Breakpoint | `left`          | `right`         |
| ---------- | --------------- | --------------- |
| base       | `col-span-full` | `col-span-full` |
| md         | columns 1–8     | columns 5–12    |
| lg         | columns 1–6     | columns 7–12    |

At lg the paragraphs take `row-start-2`, under the heading.

The figure is `absolute`, full statement height, `-z-10`, and `opacity-50` until lg. It is flush to the side opposite the text. From md it takes the background video's rest pose (`perspective(125vw)` and a 15° `rotateY`), turned about the edge it is flush to: `origin-right` and `-15deg` for `left`, `origin-left` and `15deg` for `right`. Its caption is `sr-only`.

## Relationships

- Imports: [[media.njk|molecules/figure/media.njk]]
- Used by: [[hero.njk|organisms/section/hero.njk]], once per statement, alternating `left` and `right` from `loop.index`.

## Notes for Future Maintenance

- **Choreography hooks:** `data-hero-el="mission-statement"` on the `<section>` is how `HeroTriggers.js` pins each statement and `mission-statement.js` reveals it. Don't rename it in markup alone; it lives in `HERO_SELECTORS` in `selectors.js`. The `<h2>` carries `data-hero-el="statement-heading"`, which no script reads yet.
- `mission-statement.js` targets the body's paragraphs with `:scope > p`. Don't wrap the body in another element.
- Every layout class is a literal string in an inline conditional (`"…" if isRight else "…"`). Don't interpolate column numbers, because Tailwind detects only whole literals.
- Nunjucks has no dict merge, so vary a style map by setting the value inline rather than by merging maps.
