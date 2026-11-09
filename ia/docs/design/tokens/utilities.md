---
title: Utilities
description: Project utilities built on the tokens, such as inner borders, registration marks, gels, graph paper, and arrows, each with its syntax and a live sample.
type: reference
templateEngineOverride: njk
---

<p>These are defined in <code>styles/</code> with <code>@utility</code>, so
they take responsive and state variants (<code>md:inner-border</code>,
<code>hover:arrow-suffix</code>) and read the palette tokens. Plain classes
(the gels, <code>bg-topo</code>, <code>prm-hidden</code>) take no variants.
The full list is in <code>docs/design-system/inventory.md</code>.</p>

{%- set samples = [
  {
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
  },
  {
    id: "registration-marks",
    name: "Registration marks",
    file: "styles/decorations.css",
    syntax: "registration-marks · registration-marks-<color>[/<opacity>] · registration-marks-offset-<step> · -registration-marks-offset-<step>",
    note: "Corner crop marks on ::before, in currentColor unless a colour is given. A positive offset moves them outward, a negative one inward.",
    examples: [
      "registration-marks text-neutral-300",
      "registration-marks registration-marks-primary-300 registration-marks-offset-2",
      "registration-marks registration-marks-accent-400 -registration-marks-offset-2 inner-border inner-border-neutral-600"
    ]
  },
  {
    id: "graphpaper",
    name: "Graph paper",
    file: "styles/backgrounds/Graphpapers.css",
    syntax: "bg-graphpaper-<color>[/<opacity>]",
    note: "An engineering grid with 1rem minor and 4rem major lines. The opacity modifier sets the minor grid; the major is always 1.25× it. The page body uses bg-graphpaper-accent-400.",
    examples: [
      "bg-neutral-950 bg-graphpaper-accent-400",
      "bg-neutral-950 bg-graphpaper-primary-100/10",
      "bg-neutral-50 bg-graphpaper-primary-950/10"
    ]
  },
  {
    id: "gel",
    name: "Gels",
    file: "styles/backgrounds/Gel.css",
    syntax: "gel · gel-<color> · gel-<direction> · gel-fade-<size> · gel-opacity-<n> · gel-blend-<mode>",
    note: "Translucent colour plates. The bare gel class draws; colour (primary, secondary, accent, neutral, neutral-light), direction (top, bottom, left, right and the corners) fade distance (xs to xl, full) opacity (0 to 100) and blend mode (multiply by default) each set one variable, so they combine in any order and take variants. The fade scale lives in Gel.css.",
    examples: ["gel gel-primary", "gel gel-accent gel-bottom", "gel gel-neutral gel-top-right gel-fade-md", "gel gel-primary gel-opacity-50", "gel gel-accent gel-blend-screen"]
  },
  {
    id: "pattern",
    name: "Geometric patterns",
    file: "styles/backgrounds/Geometric.css",
    syntax: "bg-halftone-<step> · bg-halftone-<color> · bg-halftone-blur-<step> · bg-checkerboard-<step> · bg-checkerboard-<color> · bg-striped-<step> · bg-striped-<color>",
    note: "Pattern size reads the spacing scale and colour reads the palette. Combine a size and a colour.",
    examples: [
      "bg-halftone-2 bg-halftone-primary-400",
      "bg-checkerboard-4 bg-checkerboard-neutral-700",
      "bg-striped-2 bg-striped-secondary-600"
    ]
  }
] -%}

{% for u in samples %}

<section aria-labelledby="utility-{{ u.id }}" class="not-prose mt-12 space-y-4">
  <h2 id="utility-{{ u.id }}">{{ u.name }}</h2>
  <p class="max-w-3xl text-base text-neutral-300">{{ u.note }}</p>
  <p class="text-sm text-neutral-400"><code class="text-neutral-200">{{ u.syntax }}</code> · <code>{{ u.file }}</code></p>
  <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {%- for cls in u.examples %}
    <li class="space-y-2">
      <span aria-hidden="true" class="block h-32 rounded-lg bg-neutral-900 {{ cls }}"></span>
      <code class="block text-xs text-neutral-200">{{ cls }}</code>
    </li>
    {%- endfor %}
  </ul>
</section>
{% endfor %}

<section aria-labelledby="utility-text" class="not-prose mt-12 space-y-4">
  <h2 id="utility-text">Arrows and text</h2>
  <ul role="list" class="space-y-4 text-lg text-neutral-100">
    <li><span class="arrow-prefix">Selected work</span> · <code class="text-sm text-neutral-300">arrow-prefix</code>, an arrow before the text (<code class="text-sm text-neutral-400">styles/decorations.css</code>)</li>
    <li><a href="#utility-text" class="arrow-suffix text-primary-300">Read the case study</a> · <code class="text-sm text-neutral-300">arrow-suffix</code>, an arrow after the text that steps right on hover (<code class="text-sm text-neutral-400">styles/utilities/text.css</code>)</li>
    <li><code class="text-sm text-neutral-300">word-per-line</code>: sets each word on its own line by widening word spacing to the viewport.</li>
    <li><code class="text-sm text-neutral-300">prm-hidden</code>: hides an element when the visitor prefers reduced motion (<code class="text-sm text-neutral-400">styles/utilities/reduced-motion.css</code>).</li>
  </ul>
</section>
