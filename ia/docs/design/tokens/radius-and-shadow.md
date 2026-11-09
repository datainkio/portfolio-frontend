---
title: Radius and shadow
description: Corner radii and the shadow set, including the directional shadows that lift an edge rather than the whole element.
type: reference
templateEngineOverride: njk
---

<p>Shadows are shown on paper, where they read. The ambient shadows
(<code>shadow-sm</code>, <code>-md</code>, <code>-lg</code>) spread evenly at
50% black, which makes them visible on the dark ground too. The directional
ones (<code>-t-</code>, <code>-r-</code>, <code>-b-</code>, <code>-l-</code>)
cast toward one edge, for drawers and bars that sit against it.</p>

<section aria-labelledby="radius" class="not-prose mt-12 space-y-6">
  <h2 id="radius">Radius</h2>
  <ul role="list" class="flex flex-wrap gap-8">
    {%- for r in designTokens.radius %}
    {%- set utility = "rounded-" + r.key if r.key else "rounded" %}
    <li class="space-y-2">
      <span aria-hidden="true" class="block size-24 border-2 border-primary-300 bg-primary-900 {{ utility }}"></span>
      <code class="block text-sm text-neutral-100">{{ utility }}</code>
      <span class="text-xs text-neutral-400">{{ r.value }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>

<section aria-labelledby="shadow" class="not-prose mt-12 space-y-6">
  <h2 id="shadow">Shadow</h2>
  <ul role="list" class="grid grid-cols-2 gap-x-6 gap-y-10 rounded-lg bg-neutral-50 p-8 sm:grid-cols-3 lg:grid-cols-4">
    {%- for s in designTokens.shadow %}
    <li class="space-y-3">
      <span aria-hidden="true" class="block h-20 rounded-lg bg-neutral-50 shadow-{{ s.key }}"></span>
      <code class="block text-sm text-neutral-900">shadow-{{ s.key }}</code>
      <span class="block text-xs text-neutral-600">{{ s.value }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>
