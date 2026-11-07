---
title: Spacing and containers
description: The spacing scale that every padding, margin, gap, and size utility uses, and the container widths that cap content.
type: reference
templateEngineOverride: njk
---

<p>One scale serves <code>p-*</code>, <code>m-*</code>, <code>gap-*</code>,
<code>space-*</code>, <code>w-*</code>, <code>h-*</code>, <code>inset-*</code>,
and <code>translate-*</code>. The steps below are the ones the site uses. A
step that isn't listed (<code>p-7</code>, say) still compiles from
Tailwind's base unit, but it isn't a token, so prefer the nearest listed
step.</p>

<section aria-labelledby="spacing-scale" class="not-prose mt-12 space-y-6">
  <h2 id="spacing-scale">Spacing</h2>
  <table class="w-full text-left">
    <thead class="text-xs uppercase tracking-wider text-neutral-400">
      <tr>
        <th scope="col" class="py-2 pr-4 font-normal">Step</th>
        <th scope="col" class="py-2 pr-4 font-normal">Value</th>
        <th scope="col" class="w-full py-2 font-normal">Width (<code>w-*</code>)</th>
      </tr>
    </thead>
    <tbody>
      {%- for s in designTokens.spacing %}
      <tr class="border-t border-slate-800">
        <th scope="row" class="py-2 pr-4 font-normal"><code class="text-sm text-neutral-100">{{ s.key }}</code></th>
        <td class="whitespace-nowrap py-2 pr-4 text-xs text-neutral-400">{{ s.value }}</td>
        <td class="py-2"><span aria-hidden="true" class="block h-4 rounded-sm bg-primary-400 w-{{ s.key }}"></span></td>
      </tr>
      {%- endfor %}
    </tbody>
  </table>
</section>

<section aria-labelledby="spacing-containers" class="not-prose mt-12 space-y-6">
  <h2 id="spacing-containers">Containers</h2>
  <p class="max-w-3xl text-base text-neutral-300">Use these as <code>max-w-*</code> to cap a block's width.</p>
  <ul role="list" class="space-y-4">
    {%- for c in designTokens.container %}
    <li class="space-y-1">
      <span aria-hidden="true" class="block h-6 w-full rounded-sm bg-slate-700 max-w-{{ c.key }}"></span>
      <code class="text-sm text-neutral-100">max-w-{{ c.key }}</code>
      <span class="text-xs text-neutral-400">{{ c.value }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>
