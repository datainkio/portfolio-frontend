---
title: Tokens
description: "The primitive motion values every preset and atom derives from: duration, easing, distance, stagger, opacity, blur, and layer order."
type: reference
order: 4
---

From `motionTokens` in `js/choreography/tokens/motion/motion.js`
([sidecar](/docs/motion/tokens/motion/motion/)). `npm run build:motion`
mirrors duration and easing to CSS; the curves are plotted on the design
system's [motion tokens](/docs/design/tokens/motion/) page. The other groups
exist only in the choreography.

{% for g in motionDocs.config.tokens %}

## {{ g.group }}

{% if g.group == "ease" -%}
GSAP can't parse a `cubic-bezier()`, so `motion.ease(name)` returns the GSAP
ease in the last column.

<!-- prettier-ignore-start -->

| Token | Curve | GSAP runs |
| ----- | ----- | --------- |
{% for r in g.rows -%}
| `{{ r.key }}` | `{{ r.value }}` | `{{ r.gsap }}` |
{% endfor %}

<!-- prettier-ignore-end -->

{%- else -%}

<!-- prettier-ignore-start -->

| Token | Value |
| --- | --- |
{% for r in g.rows -%}
| `{{ r.key }}` | {{ r.value }}{{ g.unit }} |
{% endfor %}

<!-- prettier-ignore-end -->

{%- endif %}
{% endfor %}
