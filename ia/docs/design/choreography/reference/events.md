---
title: Events
description: "Every event name on the animation bus, grouped as the EVENTS contract groups them."
type: reference
order: 0
---

From `EVENTS` in `js/choreography/config/contracts/events/events.js`
([sidecar](/docs/design/choreography/config/contracts/events/events/)). Code refers to an
event by its key, such as `EVENTS.hero.introComplete`, never by the string.

{% for g in choreographyDocs.config.events %}

## {{ g.group }}

<!-- prettier-ignore-start -->

| Key | Event |
| --- | ----- |
{% for r in g.rows -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

{% endfor %}
