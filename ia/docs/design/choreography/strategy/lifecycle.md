---
title: Lifecycle
description: "The order motion happens in: the boot gate, the four phases every section shares, and the events each phase emits."
type: reference
order: 0
---

## Boot

{{ choreographyDocs.overview.howItRuns | safe }}

The modules involved:
[AnimationDirector](/docs/design/choreography/AnimationDirector/),
[AnimationBus](/docs/design/choreography/system/AnimationBus/),
[the section registry](/docs/design/choreography/system/registry/), and
[LandingSequence](/docs/design/choreography/templates/landing/LandingSequence/).

## Phases

Every section controller extends
[AbstractSection](/docs/design/choreography/system/AbstractSection/) and owns one timeline
per phase. The phase names are `TIMELINE_IDS`:

<!-- prettier-ignore-start -->

| Key | Timeline id |
| --- | ----------- |
{% for r in choreographyDocs.config.timelines -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

## Events a section emits

Event names follow `section:phase:state`. `makeSectionEvents` builds the same
set for every section, so no name is typed by hand:

<!-- prettier-ignore-start -->

| Key | Event |
| --- | ----- |
{% for r in choreographyDocs.config.sectionEvents -%}
| `{{ r.key }}` | `{{ r.value }}` |
{% endfor %}

<!-- prettier-ignore-end -->

The full list, including system and video events, is on the
[Events](/docs/design/choreography/reference/events/) page.

## How it connects

{{ choreographyDocs.overview.howItConnects | safe }}
