---
description: "The <button> atom: owns the a11y baseline (type, focus ring, disabled styling); callers add classes, attributes, and content."
type: template
figma: "25:43"
tags:
  - atom
aliases:
  - Button atom
---

# Button

The single `<button>` primitive. Its job is the part every button needs and
callers tend to drop when restyling: a safe default `type`, a visible
`focus-visible` ring, and disabled styling. Callers **add** classes on top;
they can't replace the baseline.

The `figma` key is the node ID of the Figma Button component set (Style = CTA,
Submit, Dark, Icon, mapping 1:1 onto `variants.cta | submit | dark | icon`). The
component colour sync (`npm run sync:components`, spec
[component-sync.spec](../../specs/component-sync.spec.md)) reads it to find the
set. Figma owns the colour utilities inside `variants`; hand edits there are
reverted by the sync.

## Template

- Source: [[button.njk]]
- Path: `views/atoms/button.njk`

## Macro Signature

```njk
{% import "atoms/button.njk" as Button %}

{# Text label #}
{{ Button.render({ label: "Send", type: "submit", variant: "cta" }) }}

{# Markup content + ARIA/data attributes (disclosure toggle) #}
{% call Button.render({ classes: toggleStyles, attrs: 'data-x-el="toggle" aria-expanded="false" aria-controls="x-list"' }) %}
  <svg aria-hidden="true">…</svg>
{% endcall %}
```

| Param        | Type                             | Default                               | Description                                                                                                                                                                           |
| ------------ | -------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`       | `string`                         | `"button"`                            | `button`, `submit`, or `reset`. The default avoids accidental form submits.                                                                                                           |
| `label`      | `string`                         | `"Button"`                            | Text content. Ignored when called with `{% call %}`.                                                                                                                                  |
| `variant`    | `string`                         | none                                  | `"cta"` \| `"submit"` \| `"dark"` \| `"icon"`. Omit for an unstyled button. See Variants. |
| `classes`    | `string` \| variant map \| array | none                                  | Appended to the baseline through the `classes` filter.                                                                                                                                |
| `focusColor` | `string`                         | `"focus-visible:outline-primary-500"` | Ring colour utility. A separate param so a caller can recolour the ring without two colour utilities conflicting.                                                                     |
| `attrs`      | `string`                         | none                                  | Raw extra attributes (`aria-*`, `data-*`, `id`, `disabled`). Rendered with `\| safe`: escape interpolated values (build the string in a `{% set %}` block, where autoescape applies). |

Content comes from `label`, or from the `{% call %}` body when present
(`caller()`), so icons, media, and nested spans work.

## Variants

| Variant  | Look                                                                         | Used by                                          |
| -------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| `cta`    | Call to action: secondary fill, display type, `m-4`                          | Specimens, ad hoc calls                          |
| `submit` | Stamped action mark: flat, uppercase display type, trailing arrow, `busy` pulse | Contact form submit                           |
| `dark`   | Dark fill, white text, small radius                                          | Lightbox dialog Close                            |
| `icon`   | Outlined, `rounded-xl`, no fill; content is an icon                          | Build drawer close                               |

Callers still pass layout (`col-span-*`, margins, `justify-self-*`) and cursor
classes through `classes`.

## Baseline

Always applied: `focus-visible:outline focus-visible:outline-2
focus-visible:outline-offset-2` + `focusColor`, `disabled:opacity-60
disabled:cursor-not-allowed`. No `cursor-*` utility is applied, so callers'
`cursor-zoom-in`, `cursor-pointer`, and so on don't conflict with it.

## Relationships

- Used by:
  - [[contact-form.njk|organisms/forms/contact-form.njk]] (submit; `variant: "submit"`, `primary-950` ring)
  - [[media.njk|molecules/figure/media.njk]] (lightbox zoom trigger, `{% call %}` with media)
  - [[lightbox-dialog.njk|molecules/lightbox/lightbox-dialog.njk]] (dialog Close; `variant: "dark"`)
  - [[article-nav-links.njk|molecules/navigation/article-nav-links.njk]] (disclosure toggle)
  - [[industry-nav.njk|organisms/navigation/industry-nav/industry-nav.njk]] (drawer toggle)
  - [[build-view.njk|organisms/status/build-view/build-view.njk]] (drawer toggle + close; `variant: "icon"` on close)
- Mirrored by hand in the PortableText image serializer's lightbox trigger
  (`data/sanity/transforms/portableText.js`). Keep its baseline classes in sync.
- Intentionally not used: `molecules/section-playback.njk` (dev-only debug tool; see its comment).

## Notes for Future Maintenance

- Add looks as named `variant` entries rather than new params. Don't grow
  this into a many-prop Button.
- Changing the baseline changes every button above. Rebuild and check
  `contact`, `work`, `user-guide`, and a case study.
