---
title: Stats
description: A definition list of key and value pairs. Rows with an empty value are skipped, and callers colour the terms and values through slots.
type: reference
component: molecules/stats/stats.njk
specimens:
  - title: Project metadata
    note: The terms and values carry no colour of their own, so the caller sets it, as project pages do.
    params:
      aria: Project metadata
      stats:
        - { key: Client, value: Ford Motor Company }
        - { key: Role, value: Creative technologist }
        - { key: Year, value: "2019" }
        - { key: Skipped, value: "" }
      classes:
        base: grid gap-4
        sm: grid-cols-3
      styles:
        term: text-sm uppercase tracking-wider text-slate-400
        value: text-lg text-neutral-100
  - title: On paper
    params:
      stats:
        - { key: Awards, value: "12" }
        - { key: Organizations, value: "9" }
      classes: flex gap-8
      styles:
        term: text-sm text-neutral-600
        value: font-display text-4xl text-neutral-900
    surface: paper
inContext:
  - url: /work/
    label: Project cards on the Work page
---
