---
title: "Awards + Recognition"
description: '{% import "organisms/section/awards.njk" as AwardsSection %}'
eleventyComputed:
  title: "{{ title }}"
  recognition:
    heading: "{{ cms.home[0].recognitionHeading }}"
    body: "{{ cms.home[0].recognitionBody }}"
templateEngineOverride: njk
---

{% import "organisms/section/awards.njk" as AwardsSection %}
{% set awardsPreviewParams = {
  id: "recognition",
  copy: recognition,
  awards: collections.awards,
  order: "2/5",
  classes: sharedClasses,
  buildDate: buildDate
} %}
{{ AwardsSection.render(awardsPreviewParams) }}
