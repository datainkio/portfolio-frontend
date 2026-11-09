---
title: Typography
description: Font families, the type scale with its paired line heights, weights, leading, and tracking, each set in the face it applies to.
type: reference
templateEngineOverride: njk
---

<p>Sizes, weights, leading, and tracking come from the Figma library's Typography variables. The
families are maintained by hand, because the site self-hosts its fonts.
<code>font-display</code> (DraftPaper) carries headings and labels;
<code>font-body</code> (IBM Plex Sans) carries running text.</p>

<section aria-labelledby="type-families" class="not-prose mt-12 space-y-6">
  <h2 id="type-families">Families</h2>
  <ul role="list" class="space-y-6">
    {%- for f in designTokens.font %}
    <li class="space-y-1 border-b border-neutral-800 pb-6">
      <code class="text-sm text-accent-400">font-{{ f.key }}</code>
      <span class="block text-4xl text-neutral-100 font-{{ f.key }}">Data, ink, and the space between</span>
      <span class="block text-xs text-neutral-400">{{ f.value }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>

<section aria-labelledby="type-scale" class="not-prose mt-12 space-y-6">
  <h2 id="type-scale">Size</h2>
  <p class="max-w-3xl text-base text-neutral-300">Each size sets its own line height. Pair it with a <code>leading-*</code> utility only to override that.</p>
  <table class="w-full text-left">
    <thead class="text-xs uppercase tracking-wider text-neutral-400">
      <tr>
        <th scope="col" class="py-2 pr-4 font-normal">Utility</th>
        <th scope="col" class="py-2 pr-4 font-normal">Size / line height</th>
        <th scope="col" class="py-2 font-normal">Display and body</th>
      </tr>
    </thead>
    <tbody>
      {%- for t in designTokens.text %}
      <tr class="border-t border-neutral-800 align-baseline">
        <th scope="row" class="py-3 pr-4 font-normal"><code class="text-sm text-neutral-100">text-{{ t.key }}</code></th>
        <td class="whitespace-nowrap py-3 pr-4 text-xs text-neutral-400">{{ t.value }} / {{ t.lineHeight }}</td>
        <td class="py-3 text-neutral-100">
          <span class="block font-display text-{{ t.key }}">Portfolio</span>
          <span class="block font-body text-{{ t.key }} text-neutral-300">Portfolio</span>
        </td>
      </tr>
      {%- endfor %}
    </tbody>
  </table>
</section>

<section aria-labelledby="type-weight" class="not-prose mt-12 space-y-6">
  <h2 id="type-weight">Weight</h2>
  <p class="max-w-3xl text-base text-neutral-300">IBM Plex Sans has no 800 or 900, so <code>font-extrabold</code> and <code>font-black</code> render as the browser's nearest face. Figma keeps those two styles on Poppins.</p>
  <ul role="list" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {%- for w in designTokens.fontWeight %}
    <li class="space-y-1">
      <span class="block font-body text-2xl text-neutral-100 font-{{ w.key }}">Creative technologist</span>
      <code class="text-sm text-neutral-300">font-{{ w.key }}</code>
      <span class="text-xs text-neutral-400">{{ w.value }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>

<section aria-labelledby="type-leading" class="not-prose mt-12 space-y-6">
  <h2 id="type-leading">Leading</h2>
  <p class="max-w-3xl text-base text-neutral-300"><code>leading-snug</code> and <code>leading-loose</code> come from Figma's styles and differ from Tailwind's defaults (1.375 and 2).</p>
  <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {%- for l in designTokens.leading %}
    <li class="space-y-2">
      <span class="block max-w-xs font-body text-base text-neutral-200 leading-{{ l.key }}">Every project starts with the data, then finds the form that lets people read it at a glance.</span>
      <code class="text-sm text-neutral-300">leading-{{ l.key }}</code>
      <span class="text-xs text-neutral-400">{{ l.value }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>

<section aria-labelledby="type-tracking" class="not-prose mt-12 space-y-6">
  <h2 id="type-tracking">Tracking</h2>
  <ul role="list" class="space-y-4">
    {%- for t in designTokens.tracking %}
    <li class="flex flex-wrap items-baseline gap-x-6 gap-y-1">
      <span class="font-display text-2xl uppercase text-neutral-100 tracking-{{ t.key }}">Selected work</span>
      <code class="text-sm text-neutral-300">tracking-{{ t.key }}</code>
      <span class="text-xs text-neutral-400">{{ t.value }}</span>
    </li>
    {%- endfor %}
  </ul>
</section>
