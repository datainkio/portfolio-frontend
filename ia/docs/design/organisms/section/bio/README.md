---
title: "Mission Statement"
eleventyNavigation:
  key: docs-design-organisms-section-mission-statement
  parent: docs-design
  order: 30
# Keep Nunjucks-only rendering here so Markdown does not inject empty <p></p> wrappers around the awards section's inline HTML output.
templateEngineOverride: njk
eleventyComputed:
  value:
    heading: "{{ cms.home[0].valuePropHeading }}"
    subheading: "{{ cms.home[0].valuePropSubHeading }}"
    body: "{{ cms.home[0].valuePropBodyHtml | safe }}"
---

{% import "organisms/section/bio.njk" as BioSection %}
{{ BioSection.render({ id: "introduction", copy: value, order: "1/5"}) }}
