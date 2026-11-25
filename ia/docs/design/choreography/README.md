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

- **[System](/docs/design/choreography/system/)**: the lifecycle every
  section follows ([Lifecycle](/docs/design/choreography/lifecycle/)); the
  contracts the code shares
  ([Events](/docs/design/choreography/reference/events/),
  [Selectors](/docs/design/choreography/reference/selectors/),
  [Presets](/docs/design/choreography/reference/presets/),
  [Profiles](/docs/design/choreography/reference/profiles/),
  [Motion tokens](/docs/design/tokens/motion/)); and the core and
  supporting layers.
- A section per layer, from the smallest pieces up:

<!-- prettier-ignore-start -->

| Layer | Modules | What it holds |
| ----- | ------- | ------------- |
{% for layer in choreographyDocs.layers -%}
| [{{ layer.title }}]({{ layer.url }}) | {{ layer.count }} | {{ layer.description | safe }} |
{% endfor %}

<!-- prettier-ignore-end -->

How the system handles reduced motion is on the
[Accessibility](/docs/design/accessibility/) page. Every motion token is on the design system's
[motion tokens](/docs/design/tokens/motion/) page: the duration and easing
curves, and the groups that exist only in the choreography.

## Changing this reference

See [Maintenance](/docs/design/maintenance/#adding-a-choreography-module).
