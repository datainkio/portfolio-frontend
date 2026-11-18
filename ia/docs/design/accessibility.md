---
title: Accessibility
description: "Colour contrast of the palette on the site's paper and ground, and how the choreography honours reduced motion."
type: reference
---

## Colour contrast

Every colour's contrast ratio is worked out from the theme's hex values
against two grounds: **paper** (`neutral-50`, `{{ designTokens.grounds.paper }}`)
and the page **ground** (`neutral-950`, `{{ designTokens.grounds.ground }}`).
These are the same figures the [colour page](/docs/design/tokens/colour/)
shows beside each swatch. Body text needs 4.5:1; large text and UI shapes need
3:1.

{%- macro ratio(value) -%}
{{ value }}:1{% if value >= 4.5 %} · AA{% elif value >= 3 %} · AA large{% endif %}
{%- endmacro %}
{%- set fams = [] -%}
{%- set semantic = [] -%}
{%- for f in designTokens.palette -%}
{%- if f.family == "semantic" -%}{%- set _ = semantic.push(f) -%}{%- else -%}{%- set _ = fams.push(f) -%}{%- endif -%}
{%- endfor %}

### Against paper

<!-- prettier-ignore-start -->

| Step |{% for f in fams %} {{ f.family }} |{% endfor %}
| ---- |{% for f in fams %} ---- |{% endfor %}
{% for c in fams[0].shades -%}
{%- set i = loop.index0 -%}
| {{ c.shade }} |{% for f in fams %} {% if f.shades[i] %}{{ ratio(f.shades[i].contrast.paper) }}{% endif %} |{% endfor %}
{% endfor %}

<!-- prettier-ignore-end -->

### Against the ground

<!-- prettier-ignore-start -->

| Step |{% for f in fams %} {{ f.family }} |{% endfor %}
| ---- |{% for f in fams %} ---- |{% endfor %}
{% for c in fams[0].shades -%}
{%- set i = loop.index0 -%}
| {{ c.shade }} |{% for f in fams %} {% if f.shades[i] %}{{ ratio(f.shades[i].contrast.ground) }}{% endif %} |{% endfor %}
{% endfor %}

<!-- prettier-ignore-end -->

### Semantic colours

For invalid states, use `semantic-fail`. On paper, `semantic-fail` and
`semantic-success` fall short of 4.5:1 (the table below), which is why the contact form's status text uses
`tertiary-600` and `secondary-700`.

<!-- prettier-ignore-start -->

| Colour | Paper | Ground |
| ------ | ----- | ------ |
{% for f in semantic -%}
{%- for c in f.shades -%}
| `{{ c.family }}-{{ c.shade }}` | {{ ratio(c.contrast.paper) }} | {{ ratio(c.contrast.ground) }} |
{% endfor -%}
{%- endfor %}

<!-- prettier-ignore-end -->

## Reduced motion

Reduced motion always wins. When the visitor's system asks for it, every
section resolves the `reduced` profile, whatever the breakpoint (see
[Profiles](/docs/design/choreography/reference/profiles/)).
[ReducedMotionHandler](/docs/design/choreography/managers/ReducedMotionHandler/ReducedMotionHandler/)
is the authority for the system preference.

### Rules

These come from the motion accessibility policy,
`specs/animation/motion-accessibility-policy.md`.

{{ choreographyDocs.overview.accessibilityRules | safe }}

### Media conditions

The conditions `gsap.matchMedia` evaluates, from `config/ix/breakpoints.js`:

<!-- prettier-ignore-start -->

| Key | Media query |
| --- | ----------- |
{% for r in choreographyDocs.config.breakpoints -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

### Settings

`ACCESSIBILITY_SETTINGS`, from `config/ix/profiles.js`:

<!-- prettier-ignore-start -->

| Key | Value |
| --- | ----- |
{% for r in choreographyDocs.config.accessibility -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

### Documentation coverage

Every module that binds a ScrollTrigger or branches on reduced motion, and
whether its sidecar says what happens. "Section" means the sidecar has a
`## Reduced motion` heading; "Mentioned" means the notes cover it somewhere
else. The code columns are a text search of the source, so treat them as a
prompt to look, not as proof.

<!-- prettier-ignore-start -->

| Module | Binds ScrollTrigger | Code branches on reduced motion | Sidecar |
| ------ | ------------------- | ------------------------------- | ------- |
{% for c in choreographyDocs.coverage -%}
| [{{ c.path }}]({{ c.url }}) | {{ "Yes" if c.usesScrollTrigger else "No" }} | {{ "Yes" if c.codeBranch else "No" }} | {{ { "section": "Section", "mentioned": "Mentioned", "none": "**Not documented**" }[c.documented] }} |
{% endfor %}

<!-- prettier-ignore-end -->
