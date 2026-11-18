---
title: Radius, shadow, and border
description: Corner radii, the shadow set, the inner-border utility, and the mask utilities, each with its syntax and a live sample.
type: reference
templateEngineOverride: njk
---

{% import "molecules/sample/utility-sample.njk" as UtilitySample %}

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

{{ UtilitySample.render({
  id: "inner-border",
  name: "Inner border",
  file: "styles/decorations.css",
  syntax: "inner-border · inner-border-<color> · inner-border-<px> · inner-border-inset-<step> · inner-border-dashed | dotted | double",
  note: "A rule inset from the edge on ::after, so it paints over children with solid backgrounds. Width in whole px or an arbitrary length (inner-border-[0.5px] for hairlines).",
  examples: [
    "inner-border",
    "inner-border inner-border-primary-400 inner-border-2",
    "inner-border inner-border-accent-400 inner-border-inset-4 inner-border-dashed"
  ]
}) }}

<section aria-labelledby="masks" class="not-prose mt-12 space-y-4">
  <h2 id="masks">Masks</h2>
  <p class="max-w-3xl text-base text-neutral-300">Each utility sets one mask property, with its <code>-webkit-</code> twin, so they combine in any order and take variants. They are defined in <code>styles/utilities/mask.css</code>.</p>
  <dl class="grid max-w-3xl gap-x-6 gap-y-4 sm:grid-cols-[12rem_1fr]">
    {%- set maskGroups = [
      { property: "mask-image", syntax: "mask-image-grunge · mask-image-gradient-vertical · mask-image-gradient-horizontal · mask-image-radial", note: "The mask itself. The grunge image is a luminance mask; the gradients run white to black, top to bottom, left to right, or from the centre out." },
      { property: "mask-mode", syntax: "mask-mode-luminance · mask-mode-alpha", note: "Whether the mask reads brightness or transparency. The gradients are opaque, so they only show under luminance." },
      { property: "mask-size", syntax: "mask-size-auto · mask-size-cover · mask-size-contain", note: "How large the mask is drawn." },
      { property: "mask-position", syntax: "mask-position-center · mask-position-top · mask-position-bottom · mask-position-left · mask-position-right", note: "Where the mask sits." },
      { property: "mask-repeat", syntax: "mask-repeat-repeat · mask-repeat-no-repeat · mask-repeat-repeat-x · mask-repeat-repeat-y", note: "Whether and along which axis the mask tiles." },
      { property: "mask-clip", syntax: "mask-clip-border · mask-clip-padding · mask-clip-content · mask-clip-text", note: "Which box the mask is clipped to." },
      { property: "mask-composite", syntax: "mask-composite-add · mask-composite-subtract · mask-composite-intersect · mask-composite-exclude", note: "How stacked masks combine." }
    ] %}
    {%- for g in maskGroups %}
    <dt class="text-sm text-neutral-100"><code>{{ g.property }}</code></dt>
    <dd class="m-0 space-y-1 text-sm text-neutral-300">
      <code class="block text-neutral-200">{{ g.syntax }}</code>
      <span class="block">{{ g.note }}</span>
    </dd>
    {%- endfor %}
  </dl>
</section>

{{ UtilitySample.render({
  id: "mask-gradients",
  level: 3,
  name: "Gradient masks",
  file: "styles/utilities/mask.css",
  syntax: "mask-image-gradient-vertical · mask-image-gradient-horizontal · mask-image-radial, with mask-mode-luminance",
  note: "A filled block fading out along the mask. The fill is set with an important modifier so it shows over the sample's dark ground.",
  examples: [
    "bg-primary-500! mask-image-gradient-vertical mask-mode-luminance",
    "bg-primary-500! mask-image-gradient-horizontal mask-mode-luminance",
    "bg-primary-500! mask-image-radial mask-mode-luminance"
  ]
}) }}

{{ UtilitySample.render({
  id: "mask-mode",
  level: 3,
  name: "Mask mode",
  file: "styles/utilities/mask.css",
  syntax: "mask-mode-luminance · mask-mode-alpha",
  note: "The same gradient under each mode. Luminance fades the block; alpha leaves it whole, because the gradient is opaque.",
  examples: [
    "bg-primary-500! mask-image-gradient-vertical mask-mode-luminance",
    "bg-primary-500! mask-image-gradient-vertical mask-mode-alpha"
  ]
}) }}
