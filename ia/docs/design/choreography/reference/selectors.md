---
title: Selectors
description: "The DOM hooks the choreography binds to: section ids, and the data-attribute values each section's elements carry."
type: reference
order: 1
---

From `js/choreography/config/contracts/selectors/selectors.js`
([sidecar](/docs/design/choreography/config/contracts/selectors/selectors/)). JS finds
elements through these, never through CSS classes.

## Section ids

`SELECTORS` maps a registry key to the rendered DOM id. They differ: the
`hero` section renders as `#manifesto`.

<!-- prettier-ignore-start -->

| Key | DOM id |
| --- | ------ |
{% for r in choreographyDocs.config.sectionIds -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

## Element hooks

{% for set in choreographyDocs.config.elementSets %}

### {{ set.name }}

{% if set.attribute %}Elements carry `{{ set.attribute }}="<value>"`.{% endif %}

{% if set.rows.length -%}

<!-- prettier-ignore-start -->

| Key | Value |
| --- | --- |
{% for r in set.rows -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

{%- else -%}
No named elements yet.
{%- endif %}
{% endfor %}
