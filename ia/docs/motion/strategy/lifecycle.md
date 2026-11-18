---
title: Lifecycle
description: "The order motion happens in: the boot gate, the four phases every section shares, and the events each phase emits."
type: reference
order: 0
---

## Boot

{{ motionDocs.overview.howItRuns | safe }}

The modules involved:
[AnimationDirector](/docs/motion/AnimationDirector/),
[AnimationBus](/docs/motion/system/AnimationBus/),
[the section registry](/docs/motion/system/registry/), and
[LandingSequence](/docs/motion/templates/landing/LandingSequence/).

## Phases

Every section controller extends
[AbstractSection](/docs/motion/system/AbstractSection/) and owns one timeline
per phase. The phase names are `TIMELINE_IDS`:

<!-- prettier-ignore-start -->

| Key | Timeline id |
| --- | ----------- |
{% for r in motionDocs.config.timelines -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

## Events a section emits

Event names follow `section:phase:state`. `makeSectionEvents` builds the same
set for every section, so no name is typed by hand:

<!-- prettier-ignore-start -->

| Key | Event |
| --- | ----- |
{% for r in motionDocs.config.sectionEvents -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

The full list, including system and video events, is on the
[Events](/docs/motion/reference/events/) page.

## How it connects

{{ motionDocs.overview.howItConnects | safe }}
