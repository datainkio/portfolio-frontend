---
title: Choreography
description: "The living reference for the site's choreography: how it runs, the contracts and values it shares, and a page for every module, each read from the file the site runs."
type: index
---

This is the choreography system as the site actually runs it. Nothing here is
written twice. Each module page is the module's own sidecar, the file next to
its code under `js/choreography/`. The contract and tuning pages are read
from the config modules at build time, and each page's "Built from" and "Used
by" lists come from the code's imports.

## How it runs

{{ choreographyDocs.overview.howItRuns | safe }}

## What's here

- **[Strategy](strategy/)**: the lifecycle every section follows, and how the
  system handles reduced motion.
- **[Reference](reference/)**: the event names, selectors, timing presets,
  breakpoint profiles, and motion tokens the code shares.
- A section per layer, from the smallest pieces up:

<!-- prettier-ignore-start -->

| Layer | Modules | What it holds |
| ----- | ------- | ------------- |
{% for layer in choreographyDocs.layers -%}
| [{{ layer.title }}]({{ layer.url }}) | {{ layer.count }} | {{ layer.description | safe }} |
{% endfor %}

<!-- prettier-ignore-end -->

Duration and easing curves are plotted on the design system's
[motion tokens](/docs/design/tokens/motion/) page.

## Changing this reference

Edit the sidecar, not a page here. A new module needs only its sidecar: the
next build gives it a page and a sidebar entry. The contract is in
`ia/docs/design/choreography/choreography.11tydata.md`.
