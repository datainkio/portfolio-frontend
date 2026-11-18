---
title: Presets
description: "Each section's timing and transform values, as the choreography resolves them from the motion tokens."
type: reference
order: 2
---

From `js/choreography/config/ix/presets/`. Durations and staggers are in
seconds, as GSAP takes them; the values shown are resolved, so a preset built
from `motion.duration("slow")` shows `0.66`. Shared defaults,
`ANIMATION_DEFAULTS`:

```json
{{ motionDocs.config.animationDefaults | safe }}
```

{% for p in motionDocs.config.presets %}

## {{ p.name }}

{% if p.url %}[`{{ p.source }}`]({{ p.url }}){% endif %}

```json
{{ p.json | safe }}
```

{% endfor %}

## ScrollTrigger defaults

`SCROLL_DEFAULTS`, from `config/ix/scrolltriggers.js`. A section's own
trigger settings live beside the section, in its `*Triggers.js`.

<!-- prettier-ignore-start -->

| Key | Value |
| --- | ----- |
{% for r in motionDocs.config.scrollDefaults -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->
