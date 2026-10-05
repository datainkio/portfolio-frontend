---
title: Mission Statement
description: '{% import "organisms/section/hero.njk" as HeroSection %}'
eleventyComputed:
  value:
    heading: "{{ cms.home[0].valuePropHeading }}"
    subheading: "{{ cms.home[0].valuePropSubHeading }}"
    body: "{{ cms.home[0].valuePropBodyHtml | safe }}"
templateEngineOverride: njk
---

{% import "organisms/section/hero.njk" as HeroSection %}
{{ HeroSection.render({ id: "introduction", copy: value, order: "1/5"}) }}
