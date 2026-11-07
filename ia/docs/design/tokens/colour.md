---
title: Colour
description: The palette from Figma, as swatches with each colour's utility name, hex value, and contrast against the site's paper and page grounds.
type: reference
templateEngineOverride: njk
---

<p>Six families of eleven steps, plus three semantic colours. Use them as
<code>bg-*</code>, <code>text-*</code>, <code>border-*</code>, and so on,
e.g. <code>text-neutral-300</code>. Each swatch shows its contrast ratio
against <strong>paper</strong> (<code>neutral-50</code>,
<code>{{ designTokens.grounds.paper }}</code>) and the page
<strong>ground</strong> (<code>slate-950</code>,
<code>{{ designTokens.grounds.ground }}</code>). Body text needs 4.5:1; large
text and UI shapes need 3:1.</p>

{%- macro ratio(value) -%}
{{ value }}:1{% if value >= 4.5 %} · AA{% elif value >= 3 %} · AA large{% endif %}
{%- endmacro %}

{% for f in designTokens.palette %}

<section aria-labelledby="colour-{{ f.family }}" class="not-prose mt-12 space-y-4">
  <h2 id="colour-{{ f.family }}" class="capitalize">{{ f.family }}</h2>
  <ul role="list" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
    {%- for c in f.shades %}
    <li class="space-y-1">
      <span aria-hidden="true" class="mb-2 block h-16 rounded-lg inner-border inner-border-slate-700 bg-{{ c.family }}-{{ c.shade }}"></span>
      <code class="block text-sm text-neutral-100">{{ c.family }}-{{ c.shade }}</code>
      <span class="block text-xs text-neutral-400">{{ c.value }}</span>
      <span class="block text-xs text-neutral-400">Paper {{ ratio(c.contrast.paper) }}</span>
      <span class="block text-xs text-neutral-400">Ground {{ ratio(c.contrast.ground) }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>
{% endfor %}
