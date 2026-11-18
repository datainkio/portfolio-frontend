---
title: Profiles
description: "Which animation variant each section runs at each breakpoint, and under reduced motion, as resolveSectionMotionProfile resolves it."
type: reference
order: 3
---

From `js/choreography/config/ix/profiles.js`
([sidecar](/docs/motion/config/ix/profiles/)). Each cell is the result of
calling `resolveSectionMotionProfile` for that section and condition, so it
shows what runs, not what the config literally says. `reduced` overrides
every breakpoint.

## Variant

<!-- prettier-ignore-start -->

| Section |{% for key in motionDocs.config.profiles.keys %} `{{ key }}` |{% endfor %}
| --- |{% for key in motionDocs.config.profiles.keys %} --- |{% endfor %}
{% for row in motionDocs.config.profiles.sections -%}
| `{{ row.section }}` |{% for c in row.cells %} {{ ("`" ~ c.variant ~ "`") if c.variant else "default" }} |{% endfor %}
{% endfor %}

<!-- prettier-ignore-end -->

## Timelines and triggers

Whether lifecycle timelines play and ScrollTriggers bind. "Both" is the
default at every breakpoint.

<!-- prettier-ignore-start -->

| Section |{% for key in motionDocs.config.profiles.keys %} `{{ key }}` |{% endfor %}
| --- |{% for key in motionDocs.config.profiles.keys %} --- |{% endfor %}
{% for row in motionDocs.config.profiles.sections.concat([motionDocs.config.profiles.default]) -%}
| {{ row.section if row.section.startsWith("(") else ("`" ~ row.section ~ "`") }} |{% for c in row.cells %} {{ "Both" if (c.timeline and c.trigger) else ("Timeline only" if c.timeline else ("Trigger only" if c.trigger else "Off")) }} |{% endfor %}
{% endfor %}

<!-- prettier-ignore-end -->

The media query behind each column is on the
[Accessibility](/docs/motion/strategy/accessibility/) page.
