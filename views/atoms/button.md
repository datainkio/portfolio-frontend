---
description: "The <button> atom: owns the a11y baseline (type, focus ring, disabled styling); callers add classes, attributes, and content."
type: template
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

| Param        | Type                            | Default                               | Description |
| ------------ | ------------------------------- | ------------------------------------- | ----------- |
| `type`       | `string`                        | `"button"`                            | `button`, `submit`, or `reset`. The default avoids accidental form submits. |
| `label`      | `string`                        | `"Button"`                            | Text content. Ignored when called with `{% call %}`. |
| `variant`    | `string`                        | none                                  | `"cta"`: the call-to-action look (secondary fill, display type, `m-4`). Omit for an unstyled button. |
| `classes`    | `string` \| variant map \| array | none                                  | Appended to the baseline through the `classes` filter. |
| `focusColor` | `string`                        | `"focus-visible:outline-primary-500"` | Ring colour utility. A separate param so a caller can recolour the ring without two colour utilities conflicting. |
| `attrs`      | `string`                        | none                                  | Raw extra attributes (`aria-*`, `data-*`, `id`, `disabled`). Rendered with `\| safe`: escape interpolated values (build the string in a `{% set %}` block, where autoescape applies). |

Content comes from `label`, or from the `{% call %}` body when present
(`caller()`), so icons, media, and nested spans work.

## Baseline

Always applied: `focus-visible:outline focus-visible:outline-2
focus-visible:outline-offset-2` + `focusColor`, `disabled:opacity-60
disabled:cursor-not-allowed`. No `cursor-*` utility is applied, so callers'
`cursor-zoom-in`, `cursor-pointer`, and so on don't conflict with it.

## Relationships

- Used by:
  - [[contact-form.njk|organisms/forms/contact-form.njk]] (submit; own look, `primary-950` ring)
  - [[media.njk|molecules/figure/media.njk]] (lightbox zoom trigger, `{% call %}` with media)
  - [[lightbox-dialog.njk|molecules/lightbox/lightbox-dialog.njk]] (dialog Close)
  - [[article-nav-links.njk|molecules/navigation/article-nav-links.njk]] (disclosure toggle)
  - [[build-info.njk|molecules/list/build-info.njk]] (drawer toggle + close)
  - [[projects.njk|pages/projects/projects.njk]] (industries drawer toggle)
- Mirrored by hand in the PortableText image serializer's lightbox trigger
  (`data/sanity/transforms/portableText.js`). Keep its baseline classes in sync.
- Intentionally not used: `molecules/section-playback.njk` (dev-only debug tool; see its comment).

## Notes for Future Maintenance

- Add looks as named `variant` entries rather than new params. Don't grow
  this into a many-prop Button.
- Changing the baseline changes every button above. Rebuild and check
  `contact`, `work`, `user-guide`, and a case study.
