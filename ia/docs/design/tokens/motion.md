---
title: Motion
description: Duration and easing tokens shared by CSS transitions and the GSAP choreography, with each curve plotted against the GSAP ease it runs as, and a toggle to play both.
type: reference
templateEngineOverride: njk
---

<p>The authority is <code>js/choreography/tokens/motion/motion.js</code>,
which the GSAP choreography imports. <code>npm run build:motion</code>
mirrors it to <code>styles/motion.css</code>, so CSS transitions can use the
same values as <code>duration-*</code> and <code>ease-*</code>. Figma can't
express an easing curve, which is why motion stays in code.</p>
<p>GSAP can't read a <code>cubic-bezier()</code> curve, so the choreography
never passes it one. <code>motion.ease(name)</code> returns the nearest GSAP
ease instead, from <code>GSAP_EASE</code> in
<code>js/choreography/config/ix/motion.js</code>, and each curve below shows that
GSAP ease dashed over the designed curve. The match is closest at the end of
the motion, where the eye judges an ease. <code>standard</code> and
<code>emphasis</code> lose their slow start, because GSAP has no curve shaped
like it. A new ease token needs a <code>GSAP_EASE</code> entry, and
<code>npm test</code> fails until it has one. ADR 0004 in
<code>docs/design-system/</code> records the decision.</p>
<p>The scale has no 200ms step, so moving a transition off Tailwind's
<code>duration-200</code> changes its timing. Every transition needs a
reduced-motion path: put it behind <code>motion-safe:</code>, as the demos
below do.</p>

<section aria-labelledby="motion-duration" class="group not-prose mt-12 space-y-6">
  <h2 id="motion-duration">Duration</h2>
  <label class="inline-flex cursor-pointer items-center gap-3 text-sm text-neutral-200">
    <input type="checkbox" class="size-5 accent-primary-500">
    Play the durations
  </label>
  <ul role="list" class="space-y-4">
    {%- for d in designTokens.duration %}
    {%- set ms = d.value | replace("ms", "") | float %}
    <li class="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr_16rem] sm:items-center">
      <span>
        <code class="block text-sm text-neutral-100">duration-{{ d.key }}</code>
        <span class="text-xs text-neutral-400">{{ d.value }}</span>
      </span>
      <span aria-hidden="true" class="block h-2 rounded-sm bg-neutral-800">
        <span class="block h-2 rounded-sm bg-accent-400" style="width: {{ ms / 10 }}%"></span>
      </span>
      <span aria-hidden="true" class="relative block h-4 w-64 rounded-sm bg-neutral-900">
        <span class="absolute left-0 top-0 block size-4 rounded-full bg-primary-400 ease-standard motion-safe:transition-transform duration-{{ d.key }} group-has-checked:translate-x-56"></span>
      </span>
    </li>
    {%- endfor %}
  </ul>
  <p class="text-xs text-neutral-400">Bars are to scale against 1000ms. Each dot uses <code>ease-standard</code>.</p>
</section>

<section aria-labelledby="motion-ease" class="group not-prose mt-12 space-y-6">
  <h2 id="motion-ease">Easing</h2>
  <label class="inline-flex cursor-pointer items-center gap-3 text-sm text-neutral-200">
    <input type="checkbox" class="size-5 accent-primary-500">
    Play the curves
  </label>
  <ul role="list" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {%- for e in designTokens.ease %}
    {%- set p = e.points %}
    <li class="space-y-3">
      <svg viewBox="-5 -50 110 160" class="block h-40 w-full max-w-xs overflow-visible" role="img" aria-label="ease-{{ e.key }} curve, {{ e.value }}{% if e.gsap %}, with the GSAP ease {{ e.gsap }} overlaid{% endif %}">
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" stroke-width="0.5" class="text-neutral-700" />
        <line x1="0" y1="100" x2="{{ p[0] * 100 }}" y2="{{ 100 - p[1] * 100 }}" stroke="currentColor" stroke-width="0.5" class="text-neutral-500" />
        <line x1="100" y1="0" x2="{{ p[2] * 100 }}" y2="{{ 100 - p[3] * 100 }}" stroke="currentColor" stroke-width="0.5" class="text-neutral-500" />
        <path d="M0,100 C{{ p[0] * 100 }},{{ 100 - p[1] * 100 }} {{ p[2] * 100 }},{{ 100 - p[3] * 100 }} 100,0" fill="none" stroke="currentColor" stroke-width="2" class="text-accent-400" />
        {%- if e.gsapPath %}
        <path d="{{ e.gsapPath }}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" class="text-primary-300" />
        {%- endif %}
      </svg>
      <code class="block text-sm text-neutral-100">ease-{{ e.key }}</code>
      <span class="block text-xs text-neutral-400">{{ e.value }}</span>
      {%- if e.gsap %}
      <span class="block text-xs text-neutral-400">GSAP: <code class="text-primary-300">{{ e.gsap }}</code></span>
      {%- endif %}
      <span aria-hidden="true" class="relative block h-4 w-64 rounded-sm bg-neutral-900">
        <span class="absolute left-0 top-0 block size-4 rounded-full bg-accent-400 duration-slow motion-safe:transition-transform ease-{{ e.key }} group-has-checked:translate-x-56"></span>
      </span>
      {%- if e.gsapLinear %}
      <span aria-hidden="true" class="relative block h-4 w-64 rounded-sm bg-neutral-900">
        <span class="absolute left-0 top-0 block size-4 rounded-full bg-primary-300 duration-slow motion-safe:transition-transform group-has-checked:translate-x-56" style="transition-timing-function: {{ e.gsapLinear }}"></span>
      </span>
      {%- endif %}
    </li>
    {%- endfor %}
  </ul>
  <p class="text-xs text-neutral-400">The solid curve and upper dot are the token as CSS runs it. The dashed curve and lower dot are the GSAP ease the choreography runs for it. Each dot runs for <code>duration-slow</code>. With reduced motion on, the dots jump instead of travelling.</p>
</section>
