---
title: "Awards + Recognition"
eleventyNavigation:
  key: docs-design-organisms-section-awards
  parent: docs-design
  order: 30
eleventyComputed:
  title: "{{ title }}"
  recognition:
    heading: "{{ cms.home[0].recognitionHeading }}"
    body: "{{ cms.home[0].recognitionBody }}"
---

{% import "organisms/section/awards.njk" as AwardsSection %}

This page renders the awards section organism template with sample data.

## Live Preview

{{ AwardsSection.render({ id: "recognition", copy: recognition, awards: collections.awards, order: "2/5", classes: sharedClasses, buildDate: buildDate }) }}
