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

The figure is `absolute`, full statement height, `-z-10`, and `opacity-50` until lg. It is flush to the side opposite the text. From md it takes the background video's rest pose (`perspective(125vw)` and a 15° `rotateY`), turned about the edge it is flush to: `origin-right` and `-15deg` for `left`, `origin-left` and `15deg` for `right`. From md it also carries a horizontal alpha mask (`mask-l-from-40% mask-l-to-90%` for `left`, `mask-r-…` for `right`): opaque at the flush edge, fading to transparent toward the text, so the art recedes behind the text. The mask is applied before the transform, so it tilts with the perspective plane. Both `figure_styles` and `svg_figure_styles` carry it. Its caption is `sr-only`.

**Body wrapper (2026-11-24).** The body HTML renders inside one `<div>` (`body_styles`), so the paragraphs are a single grid item of the section and the figure beside them at lg cannot stretch the rows between them. The section is a 12-column grid at every breakpoint with `gap-y-4`; the wrapper is its own grid with the same `gap-y-4`, and paragraph prose margins are zeroed (`prose-p:m-0`), so stacked paragraphs sit 1rem apart. Below md the wrapper is one column; at md two columns (`gap-x-8`); at lg one column in the four columns opposite the figure, which sits in row 2 beside it. The paragraphs are no longer direct children of the section: the disabled `attachMissionStatement` reveal selects `:scope > p` and would need the wrapper in its selector if re-enabled.

**Print marks (2026-11-24).** Each figure carries [[printmarks.njk|molecules/printmarks.njk]] through Media's `overlay` slot: ink bars and registration targets in the gutter, then a solid margin box, a dashed bleed box and trim corners stepping in toward the art. The figure is `relative`, so the marks sit on its graph paper and tilt with it from md. Lines are `primary-100` (the graph paper's grid colour; the boxes at 60%) so they read on neutral-950. Insets are set in `print_marks` and measured from the figure's edge: root `inset-2`, margin box `10`, bleed box `12`, trim corners `14`. They are tuned to the inline-SVG figure, whose art sits 4rem in (the figure's `p-8` plus the image wrapper's `p-8`); on the raster path the art sits 2rem in, so the boxes and corners overlap it.

## Relationships

- Imports: [[media.njk|molecules/figure/media.njk]], [[printmarks.njk|molecules/printmarks.njk]]
- Used by: [[hero.njk|organisms/section/hero.njk]], once per statement, alternating `left` and `right` from `loop.index`.

## Notes for Future Maintenance

- **Choreography hooks:** `data-hero-el="mission-statement"` on the `<section>` is how `HeroTriggers.js` finds each statement for its SVG-reveal trigger (the statements are not pinned) and `mission-statement.js` reveals it. Don't rename it in markup alone; it lives in `HERO_SELECTORS` in `selectors.js`. The `<h2>` carries `data-hero-el="statement-heading"`, which no script reads yet.
- **Inline SVG:** when `statement.image` is set and `statement.imageInline` is also set, the template renders the SVG markup inline through `atoms/svg/inline.njk` (`preserveFills: true`, `attrs: data-hero-el="statement-svg"`), passed to Media's `picture` slot. It keeps the sr-only caption and image styles, but its `<figure>` takes `svg_figure_styles`: a definite width (in flow below `md`; `absolute`, full width and full height from `md`) with the SVG filling that box and `preserveAspectRatio` set to `meet`, aligned to the flush edge. The whole artwork stays on screen whatever its aspect ratio; the raster path sizes by height and suits portrait images only. Without `imageInline` the raster `<img>` path is unchanged. `imageInline` is set at build time by `hydrateStatementInlineSvgs` in [home transforms](../../../data/sanity/transforms/home.md).
- `mission-statement.js` targets the body's paragraphs with `:scope > p`. Don't wrap the body in another element.
- Every layout class is a literal string in an inline conditional (`"…" if isRight else "…"`). Don't interpolate column numbers, because Tailwind detects only whole literals.
- Nunjucks has no dict merge, so vary a style map by setting the value inline rather than by merging maps.
